"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { AiOutlineUser } from "react-icons/ai";
import Dropdown from "@/components/Dropdown";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";

interface UserMenuProps {
  session: Session | null;
}

const UserMenuadmin: React.FC<UserMenuProps> = ({ session }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    const handleScroll = () => {
      if (isDropdownOpen) closeDropdown();
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    closeDropdown();
  }, [pathname]);

  return (
    <div className="flex items-center justify-center w-[200px] max-lg:w-fit text-primary cursor-pointer select-none">
      <div
        className="flex items-center justify-center gap-2 w-fit max-lg:w-fit text-primary"
        ref={dropdownRef}
        onClick={toggleDropdown}
      >
        <div className="relative my-auto mx-2">
          <AiOutlineUser size={40} />
          {isDropdownOpen && (
            session ? (
              <div
                className="absolute shadow-xl z-30 flex gap-2 flex-col top-12 -translate-x-1/5 max-md:-translate-x-28"
                onClick={(e) => e.stopPropagation()}
              >
                <Dropdown
                  username={session.user?.name ?? ""}
                  role={session.user?.role ?? ""}
                />
              </div>
            ) : (
              <div className="absolute shadow-xl z-30 flex flex-col gap-4 top-12 -translate-x-1/5 bg-white p-4 border-[#15335D] border-4 rounded-lg">
                <Link href="/signin" className="bg-primary px-8 py-2 rounded border-2 border-primary text-center hover:bg-white hover:text-black ">
                  LOGIN
                </Link>
                <Link href="/signup" className="bg-secondary px-8 py-2 border-2 border-secondary rounded text-center hover:bg-white hover:text-black">
                  REGISTER
                </Link>
              </div>
            )
          )}
        </div>
        <div className="flex flex-col">
          <p className="text-primary text-sm max-md:hidden">My Account</p>
          <p className="text-primary font-bold max-lg:hidden">Details</p>
        </div>
      </div>
    </div>
  );
};

export default UserMenuadmin;
