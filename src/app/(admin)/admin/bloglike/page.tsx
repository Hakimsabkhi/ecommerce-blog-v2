"use client";
import React, { useState, useEffect, useMemo } from "react";
import Pagination from "@/components/Pagination";
import Image from "next/image";
import Link from "next/link";
import { FaSpinner } from "react-icons/fa6";


interface Postsecondsubsection {
  secondtitle: string;
  description: string;
  imageUrl?: string;
  imageFile?: File; // Temporary property to store the selected file before upload
}

interface Postfirstsubsection {
  fisttitle: string;
  description: string;
  Postsecondsubsections: Postsecondsubsection[];
  imageUrl?: string;
  imageFile?: File; // Temporary property to store the selected file before upload
}

interface blog {
  _id: string;
  title: string;
  description: string;
  Postfirstsubsections: Postfirstsubsection[];
  blogCategory: blogCategory;
  imageUrl: string;
  user: User;
  numbercomment: number;
  createdAt: string;
}
interface User {
  _id: string;
  username: string;
}
interface blogCategory {
  _id: string;
  name: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
}
const BlogLikes = () => {
  const [postlist, setPostlist] = useState<blog[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const blogsPerPage = 5;
  const filteredBlogs = useMemo(() => {
    return postlist.filter((blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, postlist]);

  const currentBlogs = useMemo(() => {
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    return filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  }, [currentPage, filteredBlogs, blogsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredBlogs.length / blogsPerPage);
  }, [filteredBlogs.length, blogsPerPage]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/comments/admin/getbolgcomments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        
        setPostlist(data); // Assuming data is an array of products
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
    
  }, []);

  return (
    <div className="mx-auto w-[90%] py-8 flex flex-col gap-8">
        <h1 className="text-4xl font-bold pt-4 ">List blog comment</h1>
        <input
        type="text"
        placeholder="Search blogs"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mt-4 p-2 border border-gray-300 rounded"
      />
      <div className="max-2xl:h-80 h-[50vh]">
      <table className="w-full rounded overflow-hidden table-fixed">
        <thead>
          <tr className="bg-gray-800">
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">ImageURL</th>

            <th className="px-4 py-3">Author</th>
           
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <tr>
              <td colSpan={5}>
                <div className="flex justify-center items-center h-full w-full py-6">
                  <FaSpinner className="animate-spin text-[30px]" />
                </div>
              </td>
            </tr>
          </tbody>
        ) : filteredBlogs.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={5}>
                <div className="text-center py-6 text-gray-600 w-full">
                  <p>Aucun blog trouvé.</p>
                </div>
              </td>
            </tr>
          </tbody>
        ) : (
        <tbody>
          {currentBlogs.map((blog) => (
            <tr key={blog._id} className="bg-white text-black">
              <td className="border px-4 py-2">{blog.title.slice(0, 19)}</td>
              <td className="border px-4 py-2">{blog.blogCategory?.name}</td>
              <td className="border px-4 py-2">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-[40px] relative">
                  {" "}
                  {/* Set a desired height for the div */}
                  <Link href={blog.imageUrl}>
                    <Image
                      src={blog.imageUrl}
                      alt={blog.title}
                      quality={100}
                      layout="fill" // Makes image fill the container
                      objectFit="cover" // Ensures image covers the div without stretching/distorting
                      // Optional: rounded corners on the image
                    />
                  </Link>
                </div>
              </td>

              <td className="border px-4 py-2">{blog?.user?.username}</td>

              <td className="border px-4 py-2 flex justify-center">
                <div>
                    <Link href={`/admin/bloglike/${blog._id}`}>
                           <button className="bg-gray-800 text-white w-32 h-10  hover:bg-gray-600 rounded-md uppercase">
                         {blog.numbercomment} Comments
                      </button>
                    </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>)}
      </table></div>
      <div className="flex justify-center mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default BlogLikes;
