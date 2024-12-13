"use client";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

import { toast } from "react-toastify";
import DeletePopup from "@/components/Popup/DeletePopup";
import Pagination from "@/components/Pagination";
import useIs2xl from "@/hooks/useIs2x";
import { FaSpinner } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";

type Postmain = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  user: { _id: string; username: string; role: string };
  slug: string;
  vadmin: string;
  blogCategory: blogCategory;
  createdAt: Date;
  updatedAt: Date;
};
interface blogCategory {
  _id: string;
  name: string;
  slug: string;
}

const BlogTable: React.FC = () => {
  const [postlist, setpostlist] = useState<Postmain[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setselectedPost] = useState<Postmain | null>(null);

  const is2xl = useIs2xl();
  const blogsPerPage = is2xl ? 8 : 5;

  const handleDeleteClick = (blog: Postmain) => {
    setselectedPost(blog);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setselectedPost(null);
  };

  const deleteBlog = async (blogId: string) => {
    try {
      const response = await fetch(`/api/blog/DeletePost/${blogId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }

      setpostlist((prevBlogs) =>
        prevBlogs.filter((blog) => blog._id !== blogId)
      );

      toast.success("Blog deleted successfully!");
    } catch (err: any) {
      toast.error(`Failed to delete blog: ${err.message}`);
    } finally {
      handleClosePopup();
    }
  };

  const updateBlogStatus = async (blogId: string, newStatus: string) => {
    try {
      const updateFormData = new FormData();
      updateFormData.append("vadmin", newStatus);

      const response = await fetch(`/api/blog/updatePostStatus/${blogId}`, {
        method: "PUT",
        body: updateFormData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      setpostlist((prevData) =>
        prevData.map((item) =>
          item._id === blogId ? { ...item, vadmin: newStatus } : item
        )
      );

      const data = await response.json();
      console.log("Blog status updated successfully:", data);
    } catch (error) {
      console.error("Failed to update blog status:", error);
      toast.error("Failed to update blog status");
    }
  };

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const response = await fetch("/api/blog/ListPostadmin", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const data = await response.json();
        console.log(data);
        setpostlist(data);
      } catch (err: any) {
        setError(`[Blog_GET] ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    getBlogs();
  }, []);

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



  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mx-auto w-[90%] py-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold">ALL Blogs</p>
        <div className="grid grid-cols-2 gap-2 items-center justify-center">
          <Link href="blog/postcategory" className="w-full">
            <button className="bg-gray-800 font-bold hover:bg-gray-600 text-white rounded-lg pl-4 pr-4  h-10">
              CATEGORY BLOG
            </button>
          </Link>
          <Link href="blog/addpost" className="w-full">
            <button className="bg-gray-800 font-bold hover:bg-gray-600 text-white rounded-lg  pl-4 pr-4  h-10">
              Add a new blog
            </button>
          </Link>
        </div>
      </div>
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
            <th className="px-4 py-3 border-r-white w-[15%]">Title</th>
            <th className="px-4 py-3 border-r-white w-[10%] ">Category</th>
            <th className="px-4 py-3 border-r-white w-[10%] ">ImageURL</th>
            <th className="px-4 py-3 border-r-white w-[15%] ">Author</th>
            <th className="px-4 py-3 border-r-white w-[10%] ">Role</th>
            <th className="px-4 py-3 border-r-white text-center">Action</th>
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <tr>
              <td colSpan={6}>
                <div className="flex justify-center items-center h-full w-full py-6">
                  <FaSpinner className="animate-spin text-[30px]" />
                </div>
              </td>
            </tr>
          </tbody>
        ) : filteredBlogs.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={6}>
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
                <td className="border px-4 py-2 flex  justify-center">
                  
                    <Link href={blog.imageUrl}>
                      <Image
                        src={blog.imageUrl}
                        alt={blog.title}
                        
                        width={40}
                        height={40} // Makes image fill the container
                         // Ensures image covers the div without stretching/distorting
                        // Optional: rounded corners on the image
                      />
                    </Link>
                  
                </td>

                <td className="border px-4 py-2">{blog?.user?.username}</td>
                <td className="border px-4 py-2">{blog?.user?.role}</td>
                <td className="border px-4 py-2">
                  <div className="flex items-center justify-center gap-2">
                    <select
                      className={`w-50 text-black rounded-md p-2 ${
                        blog.vadmin === "not-approve"
                          ? "bg-gray-400 text-white"
                          : "bg-green-500 text-white"
                      }`}
                      value={blog.vadmin}
                      onChange={(e) =>
                        updateBlogStatus(blog._id, e.target.value)
                      }
                    >
                      <option value="approve" className="text-white uppercase">
                        Approve
                      </option>
                      <option
                        value="not-approve"
                        className="text-white uppercase"
                      >
                        Not approve
                      </option>
                    </select>
                    <Link href={`/admin/blog/edit/${blog._id}`}>
                      <button className="bg-gray-800 text-white w-28 h-10 hover:bg-gray-600 rounded-md uppercase">
                        Modify
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(blog)}
                      className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md"
                      disabled={selectedPost?._id === blog._id}
                    >
                      {selectedPost?._id === blog._id
                        ? "Processing..."
                        :  <FaTrashAlt />}
                    </button>

                    {blog.blogCategory && (
                      <Link
                        href={`/${
                          blog.vadmin === "approve" ? "" : "admin/"
                        }blog/${blog.blogCategory.slug}/${blog.slug}`}
                      >
                        <button className="bg-gray-800 text-white w-36 h-10 hover:bg-gray-600 rounded-md uppercase">
                          See Blog
                        </button>
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table> </div>
      <div className="flex justify-center mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      {isPopupOpen && selectedPost && (
        <DeletePopup
          handleClosePopup={handleClosePopup}
          Delete={deleteBlog}
          id={selectedPost._id}
          name={selectedPost.title}
        />
      )}
    </div>
  );
};

export default BlogTable;
