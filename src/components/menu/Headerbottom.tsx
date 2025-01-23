"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBars } from "react-icons/fa";

interface Category {
  _id: string;
  name: string;
  logoUrl?: string;
  slug: string;
}

const Headerbottom: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuWrapperRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLDivElement>(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const res = await fetch(`/api/category/getAllCategory`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategoryData();
  }, []);

  const toggleMenu = (event: React.MouseEvent) => {
    event.stopPropagation(); // Stop propagation to prevent outside click logic
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside both the menu and the toggle button
      if (
        isMenuOpen &&
        !menuWrapperRef.current?.contains(event.target as Node) &&
        !toggleButtonRef.current?.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) {
        closeMenu();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMenuOpen]);

  return (
    <header>
      <div className="w-full h-[80px] bg-primary flex justify-center items-center gap-4 border-y border-gray-600">
        <div className="w-[90%] h-full flex justify-between max-md:justify-center items-center">
          {/* Toggle Button */}
          <div
            className="relative w-[300px] border-4 border-[#15335D] h-[70%] bg-white text-primary font-bold flex justify-center items-center cursor-pointer"
            onClick={toggleMenu} // Toggle menu on click
            ref={toggleButtonRef} // Reference to the toggle button
          >
            <div className="flex gap-6 items-center">
              <FaBars />
              <p>ALL OUR CATEGORIES</p>
            </div>

            {/* Category Dropdown Menu */}
            {isMenuOpen && (
              <div
                className="absolute shadow-xl z-30 flex gap-2 flex-col top-12 left-1/2 -translate-x-1/2 max-md:-translate-x-1/2 max-md:top-12"
                ref={menuWrapperRef} // Reference to the dropdown menu
                onClick={(e) => e.stopPropagation()} // Prevent menu close on inside click
              >
                <div className="flex flex-col w-[300px] border-[#15335D] border-4 bg-white z-30">
                  {categories.map((category) => (
                    <Link
                      href={`/${category.slug}`}
                      key={category._id}
                      className="flex items-center gap-3 duration-300 hover:bg-primary hover:text-white border-b-2"
                      onClick={closeMenu} // Close menu on link click
                    >
                      <div className="pl-4 flex gap-6 items-center py-2">
                        {category.logoUrl && (
                          <Image
                            src={category.logoUrl}
                            alt={category.name}
                            width={20}
                            height={20}
                            className="rounded-full object-cover"
                          />
                        )}
                        <span className="font-bold text-base">{category.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex w-[60%] justify-end gap-8 font-semibold items-center text-white text-xl tracking-wider max-xl:text-base max-lg:text-xs max-md:hidden">
            <Link className="hover:text-secondary" href="/promotion">PROMOTION</Link>
            <Link className="hover:text-secondary" href="/">BEST PRODUCTS</Link>
            <Link className="hover:text-secondary" href="/stores"> NOS BOUTIQUES</Link>
            <Link className="hover:text-secondary" href="/blog">BLOG</Link>
            <Link className="hover:text-secondary" href="/contactus">CONTACT US</Link>
            

          </div>
        </div>
      </div>
    </header>
  );
};

export default Headerbottom;
