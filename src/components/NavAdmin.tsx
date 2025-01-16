"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { pages } from "@/lib/page";

const NavAdmin = () => {
  const { data: session, status } = useSession();
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleClick = (link: string) => {
    setActiveLink(link);
    setIsMenuOpen(false);
    setOpenDropdown(null);
  };

  const toggleDropdown = (groupName: string) => {
    setOpenDropdown((prev) => (prev === groupName ? null : groupName));
  };

  useEffect(() => {
    // Add any side effects if necessary
  }, [session, status]);

  if (status === "loading") {
    return null;
  }

  return (
    <nav className="bg-gray-800 w-full">
      <div className="w-[90%] mx-auto">
        <div className="flex items-center justify-between h-[40px]">
          <p className="text-white font-bold text-xl cursor-pointer">Dashboard</p>
          <div className="xl:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 w-[200px] hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
          <div className="hidden xl:flex xl:items-center gap-4 h-full">
            {Object.entries(pages).map(([groupName, links]) => (
              <div
                key={groupName}
                className="relative group h-full"
                onMouseEnter={() => setOpenDropdown(groupName)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <div className="flex justify-around items-center gap-2 hover:bg-gray-600 hover:text-white px-2 h-full w-fit min-w-[130px] ">
                  <p className="text-gray-300  text-sm font-medium cursor-pointer">
                    {groupName}
                  </p>
                  {openDropdown === groupName ? (
                    <FaChevronUp className="text-gray-300" />
                  ) : (
                    <FaChevronDown className="text-gray-300" />
                  )}
                </div>
                {openDropdown === groupName && (
                  <div className="absolute  bg-gray-800  text-gray-300 shadow-lg w-full z-50">
                    {links.map((link) => (
                      <Link key={link.name} href={link.path}>
                        <p
                          onClick={() => handleClick(link.name)}
                          className={` p-2  text-sm font-medium cursor-pointer hover:bg-gray-300 hover:text-gray-900 ${
                            activeLink === link.name ? "bg-gray-600" : ""
                          }`}
                        >
                          {link.name}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {isMenuOpen && (
          <div className="xl:hidden bg-gray-700 z-50">
            <div className="flex flex-col gap-4 p-4">
              {Object.entries(pages).map(([groupName, links]) => (
                <div key={groupName} className="flex flex-col gap-2">
                  <div
                    className="flex items-center justify-between text-gray-300 font-medium cursor-pointer"
                    onClick={() => toggleDropdown(groupName)}
                  >
                    <p>{groupName}</p>
                    {openDropdown === groupName ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                  {openDropdown === groupName &&
                    links.map((link) => (
                      <Link key={link.name} href={link.path}>
                        <p
                          onClick={() => handleClick(link.name)}
                          className={`text-gray-300 hover:bg-gray-600 hover:text-white p-2  text-sm font-medium cursor-pointer ${
                            activeLink === link.name ? "bg-gray-600" : ""
                          }`}
                        >
                          {link.name}
                        </p>
                      </Link>
                    ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavAdmin;
