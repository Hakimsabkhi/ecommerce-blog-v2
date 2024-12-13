"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {pageUrls} from "@/lib/page"
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useSessionData } from "@/lib/useSessionData"; // Adjust the import path as necessary

const NavAdmin = () => {
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { session, loading } = useSessionData();
  const [selectedPath, setSelectedPath] = useState<string>(pathname);
  const [allowedPages, setAllowedPages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
    const handleClick = (link: string) => {
    setActiveLink(link);
  };
  useEffect(() => {
    setSelectedPath(pathname);
  }, [pathname]);
  useEffect(() => {
    const fetchAllowedPages = async () => {
      if (!session?.user?.role) return;

      try {
        setError(null); // Reset error state
        const response = await fetch(`/api/roles/access?role=${session.user.role}`);
        if (!response.ok) throw new Error("Failed to fetch role access");

        const data = await response.json();
        setAllowedPages(data.allowedPages || []);
      } catch (error) {
        console.error("Error fetching role access:", error);
        setError("Unable to load navigation. Please try again.");
      }
    };

    // Fetch allowed pages only for non-admin roles
    if (session?.user?.role !== "Admin" && session?.user?.role !== "SuperAdmin") {
      fetchAllowedPages();
    }
  }, [session]);

  const navigateTo = (path: string) => {
    router.push(path);
    setSelectedPath(path);
  };

  const filteredNavigationItems = session?.user?.role === "Admin" || session?.user?.role === "SuperAdmin"
    ? pageUrls // Show all pages for Admin and SuperAdmin
    : pageUrls.filter(page =>
        allowedPages.includes(page.name) // Only include pages user has permission for
      );


  return (
    <nav className="bg-gray-800 w-[100%] relative ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
           
              <p
               
                className={`text-white font-bold text-xl cursor-pointer `}
              >
                Dashboard
              </p>
           
          </div>
          <div className="hidden md:flex md:items-center">
                        <div className="ml-4 flex items-center ">
            {filteredNavigationItems.map((item) => (<Link key={item.name} href={item.path}>
                <p
                  onClick={() => handleClick(item.name)}
                  className={`text-gray-300 hover:bg-gray-700 hover:text-white 
                               p-3 rounded-md text-sm font-medium cursor-pointer ${
                    activeLink === item.name ? 'bg-gray-700' : ''
                  }`}
                >
                  {item.name}
                </p>
              </Link> ))}
              </div>
          </div>
          <div>

    </div>
        </div>
      </div>
    </nav>
  );
};

export default NavAdmin;
