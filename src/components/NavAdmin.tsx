"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { pageUrls } from "@/lib/page";
import { FaBars, FaTimes } from "react-icons/fa";

const NavAdmin = () => {
  const { data: session, status } = useSession();
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [allowedPages, setAllowedPages] = useState<string[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClick = (link: string) => {
    setActiveLink(link);
    setIsMenuOpen(false); 
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      const fetchAllowedPages = async () => {
        if (session.user.role !== "Admin" && session.user.role !== "SuperAdmin") {
          try {
            const response = await fetch(`/api/roles/access?role=${session.user.role}`);
            if (!response.ok) throw new Error("Failed to fetch role access");

            const data = await response.json();
            setAllowedPages(data.allowedPages || []);
          } catch (error) {
            console.error("Error fetching role access:", error);
          }
        }
      };

      fetchAllowedPages();
    }
  }, [session, status]);

  if (status === "loading") {
    return null;
  }

  const filteredNavigationItems =
    session?.user?.role === "Admin" || session?.user?.role === "SuperAdmin"
      ? pageUrls
      : pageUrls.filter((page) => allowedPages.includes(page.name));

  return (
    <nav className="bg-gray-800 w-full">
      <div className="w-[90%] mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <p className="text-white font-bold text-xl cursor-pointer">Dashboard</p>
          </div>
          <div className="xl:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
          <div className="hidden xl:flex xl:items-center">
            <div className="flex gap-4 max-2xl:gap-0 items-center">
              {filteredNavigationItems.map((item) => (
                <Link key={item.name} href={item.path}>
                  <p
                    onClick={() => handleClick(item.name)}
                    className={`w-fit text-gray-300 hover:bg-gray-700 hover:text-white p-3 rounded-md max-2xl:text-xs text-sm font-medium cursor-pointer ${
                      activeLink === item.name ? "bg-gray-700" : ""
                    }`}
                  >
                    {item.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="xl:hidden">
            <div className="flex flex-col gap-2 bg-gray-700 p-4 rounded-md">
              {filteredNavigationItems.map((item) => (
                <Link key={item.name} href={item.path}>
                  <p
                    onClick={() => handleClick(item.name)}
                    className={`text-gray-300 hover:bg-gray-600 hover:text-white p-2 rounded-md text-sm font-medium cursor-pointer ${
                      activeLink === item.name ? "bg-gray-600" : ""
                    }`}
                  >
                    {item.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavAdmin;
