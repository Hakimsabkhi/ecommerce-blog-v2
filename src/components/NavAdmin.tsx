"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { pageUrls } from "@/lib/page";

const NavAdmin = () => {
  const { data: session, status } = useSession();
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [allowedPages, setAllowedPages] = useState<string[]>([]);

  const handleClick = (link: string) => {
    setActiveLink(link);
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
    <nav className="bg-gray-800 w-[100%]">
      <div className="w-[90%] mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <p className="text-white font-bold text-xl cursor-pointer">Dashboard</p>
          </div>
          <div className="hidden md:flex md:items-center">
            <div className="flex gap-2 items-center">
              {filteredNavigationItems.map((item) => (
                <Link key={item.name} href={item.path}>
                  <p
                    onClick={() => handleClick(item.name)}
                    className={`w-fit align-center text-gray-300 hover:bg-gray-700 hover:text-white p-3 rounded-md text-sm font-medium cursor-pointer ${
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
      </div>
    </nav>
  );
};

export default NavAdmin;
