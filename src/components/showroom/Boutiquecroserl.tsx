"use client";
import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { BsFillTelephoneFill } from "react-icons/bs";
import {
  FaMapMarkerAlt,
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
} from "react-icons/fa";

interface OpeningHours {
  [day: string]: { open: string; close: string }[];
}

interface StoreData {
  _id: string;
  nom: string;
  image: string;
  phoneNumber: string;
  address: string;
  city: string;
  localisation: string;
  openingHours: OpeningHours;
}

interface BoutiqueProps {
  boutiques: StoreData[];
}

const ITEMS_PER_SLIDE = 3; // A single source of truth for items per slide

// Boutique card component
const BoutiqueCard: React.FC<{ boutique: StoreData }> = ({ boutique }) => {
  return (
    <div className="px-2 flex w-1/3 h-full">
      {/* Image Section */}
      <div className="w-1/3">
        {boutique.image && (
          <Image
            src={boutique.image}
            alt={boutique.nom}
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Info Section */}
      <div className="bg-white w-2/3 h-full overflow-hidden">
        <div className="p-2">
          <h2 className="text-center text-lg font-bold uppercase mb-4">
            {boutique.nom}
          </h2>
          <div className="text-center text-black flex justify-center items-center gap-4">
            <div className="flex justify-center items-center">
              <span className="inline-block bg-black p-1 font-semibold mr-2 rounded-md">
                <BsFillTelephoneFill className="text-white" size={15} />
              </span>
              <span className="font-bold">{boutique.phoneNumber}</span>
            </div>

            <div className="flex justify-center items-center">
              <span className="inline-block text-black font-semibold mr-2">
                <FaMapMarkerAlt size={23} />
              </span>
              <span className="font-bold">
                {boutique.address} {boutique.city}
              </span>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="mt-4 flex flex-col justify-center w-fit mx-auto">
            <h3 className="text-center text-black font-bold mb-4">
              TEMPS OUVERT :
            </h3>
            <ul className="text-center text-sm space-y-1">
              {boutique.openingHours
                ? Object.entries(boutique.openingHours).map(([day, hours]) => (
                    <li key={day} className="flex text-left">
                      <span className="font-medium w-28">{day}:</span>
                      {Array.isArray(hours) && hours.length > 0
                        ? hours
                            .map((hour) => {
                              const openTime = hour.open || "";
                              const closeTime = hour.close || "";
                              if (!openTime && !closeTime) return "";
                              return `${openTime} - ${closeTime}`;
                            })
                            .filter(Boolean)
                            .join(" / ") || "Closed"
                        : "Closed"}
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const BoutiqueCarousel: React.FC<BoutiqueProps> = ({ boutiques }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Compute slides in groups of ITEMS_PER_SLIDE
  const slides = useMemo(() => {
    const chunked: StoreData[][] = [];
    for (let i = 0; i < boutiques.length; i += ITEMS_PER_SLIDE) {
      chunked.push(boutiques.slice(i, i + ITEMS_PER_SLIDE));
    }
    return chunked;
  }, [boutiques]);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  return (
    <div className="py-8 w-full">
      <div className="relative overflow-hidden">
        {/* Slides Wrapper */}
        <div
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slideItems, slideIndex) => (
            <div
              key={`slide-${slideIndex}`}
              className="flex-shrink-0 w-full flex ml-9 pl-4 pr-12 mr-9"
            >
              {slideItems.map((item) => (
                <BoutiqueCard key={item._id} boutique={item} />
              ))}
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 -left-1 transform -translate-y-1/2 p-1 z-10"
        >
          <FaRegArrowAltCircleLeft size={50} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 -right-1 transform -translate-y-1/2 p-1 z-10"
        >
          <FaRegArrowAltCircleRight size={50} />
        </button>
      </div>

      {/* Slider Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <div
            key={`indicator-${index}`}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              index === currentSlide ? "bg-black" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BoutiqueCarousel;
