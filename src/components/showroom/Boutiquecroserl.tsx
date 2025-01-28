"use client"
import Image from "next/image"; 
import React, { useState } from "react"; 
import { BsFillTelephoneFill } from "react-icons/bs"; 
import { FaMapMarkerAlt, FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from "react-icons/fa"; 

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

interface Boutiqueprops { 
  boutiques: StoreData[]; 
} 

const Boutiquecroserl: React.FC<Boutiqueprops> = ({ boutiques }) => { 
  const [currentIndex, setCurrentIndex] = useState(0); 

  // Function to go to the next slide (4 items at a time)
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(boutiques.length / 4));
  };

  // Function to go to the previous slide (4 items at a time)
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + Math.ceil(boutiques.length / 4)) % Math.ceil(boutiques.length / 4));
  };

  return ( 
    <div className="container mx-auto py-8">
      {/* Slider wrapper */}
      <div className="relative overflow-hidden">
        {/* Slide content */}
        <div
          className="flex transition-transform duration-100"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {/* Group items in sets of 4 */}
          {Array.from({ length: Math.ceil(boutiques.length / 4) }).map((_, slideIndex) => {
            const start = slideIndex * 4;
            const end = start + 4;
            const slideItems = boutiques.slice(start, end);

            return (
              <div key={slideIndex} className="flex-shrink-0 w-full flex ml-9 mr-9">
                {slideItems.map((item: StoreData) => (
                  <div key={item._id} className="w-1/4 p-2 ">
                    <div className="bg-white shadow-lg overflow-hidden">
                      {item.image && (
                        <Image
                          src={item.image} // Replace with your image path
                          alt="Store Image"
                          width={1920}
                          height={1080}
                          className="w-full object-cover h-96"
                        />
                      )}
                      <div className="p-6">
                        <h2 className="text-center text-lg font-bold uppercase mb-4">
                          {item.nom}
                        </h2>
                        <div className="text-center text-black flex justify-center items-center gap-4">
                          <div className="flex flex-col justify-center items-center">
                            <span className="inline-block bg-black p-1 font-semibold mr-2 rounded-md">
                              <BsFillTelephoneFill className="text-white" size={15} />
                            </span>
                            <span className="font-bold"> {item.phoneNumber}</span>
                          </div>
                          <div className="flex flex-col justify-center items-center">
                            <span className="inline-block text-black font-semibold mr-2">
                              <FaMapMarkerAlt size={23} />
                            </span>
                            <span className="font-bold">
                              {item.address} {item.city}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-col justify-center gap-3">
                          <h3 className="text-center text-black font-bold mb-2">
                            TEMPS OUVERT :
                          </h3>
                          <ul className="text-center text-md space-y-1">
                            {item?.openingHours &&
                              Object.entries(item.openingHours).map(([day, hours]) => (
                                <li key={day} className="flex gap-8 text-left">
                                  <span className="font-medium w-20">{day}:</span>{" "}
                                  {Array.isArray(hours) && hours.length > 0
                                    ? hours
                                        .map((hour) => {
                                          const openTime = hour.open || ""; // Fallback to "-" if open is invalid
                                          const closeTime = hour.close || ""; // Fallback to "-" if close is invalid
                                          if (!openTime && !closeTime) return "";
                                          return `${openTime} - ${closeTime}`;
                                        })
                                        .filter(Boolean) // Remove any null or empty entries from the array
                                        .join(" / ") || "Closed" // If the array is empty after filtering, display "Closed"
                                    : "Closed"}
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Prev & Next buttons */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 p-1  z-10"
        >
          <FaRegArrowAltCircleLeft size={30} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 p-1    z-10"
        >
         <FaRegArrowAltCircleRight size={30}/>

        </button>
      </div>

      {/* Optional: Display indicator for the slider */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: Math.ceil(boutiques.length / 4) }).map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => setCurrentIndex(slideIndex)}
            className={`w-3 h-3 rounded-full bg-gray-800 cursor-pointer ${
              slideIndex === currentIndex ? "bg-white" : "opacity-50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Boutiquecroserl;
