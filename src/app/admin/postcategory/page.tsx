"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import Pagination from "@/components/Pagination";
import DeletePopup from "@/components/Popup/DeletePopup";
import { FaSpinner } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";



type Post = {
  _id: string;
  name: string;
  user:user;
  vadmin:string;
  slug:string;
  createdAt: Date;
  updatedAt: Date;
};

interface user{
_id:string;
username:string;
}

const AddedCategories: React.FC = () => {
  const [addedCategory, setAddedCategory] = useState<Post[]>([]);
  const [filteredCategory, setFilteredCategory] = useState<Post[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const categoriesPerPage = 5; // Number of categories to display per page
  const [loading, setLoading] = useState(true);
  const [selectedCatgory, setSelectedCatgory] = useState({ id: "", name: "" });
  const [loadingCategoryId, setLoadingCategoryId] = useState<string | null>(null);
  const handleDeleteClick = (Category: Post) => {
    setLoadingCategoryId(Category._id); 
    setSelectedCatgory({ id: Category._id, name: Category.name });
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setLoadingCategoryId(null);
  };

  const DeleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(
        `/api/blog/PostCategory/admin/deleteCategory/${categoryId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      handleClosePopup();
      getCategory();
      toast.success("Category delete successfully!");
    } catch (error: unknown) {
      // Handle different error types effectively
      if (error instanceof Error) {
        console.error("Error deleting category:", error.message);
        setError(error.message);
      } else if (typeof error === "string") {
        console.error("String error:", error);
        setError(error);
      } else {
        console.error("Unknown error:", error);
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoadingCategoryId(null);
    }
  };

  const getCategory = async () => {
    try {
      const response = await fetch("/api/blog/PostCategory/admin/getAllCategory");

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setAddedCategory(data);
      setFilteredCategory(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Safe to access error.message
        console.error(error.message);
      } else {
        // Handle unexpected error types
        console.error('An unexpected error occurred:', error);
      }
    } finally {
      setLoading(false);
    }
  };
  
  
  const updateBlogCategoryStatus = async (blogId: string, newStatus: string) => {
    try {
      const updateFormData = new FormData();
      updateFormData.append("vadmin", newStatus);

      const response = await fetch(`/api/blog/PostCategory/admin/updateBlogCategoryStatus/${blogId}`, {
        method: "PUT",
        body: updateFormData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      setAddedCategory((prevData) =>
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
    getCategory();
  }, []);

  useEffect(() => {
    const filtered = addedCategory.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategory(filtered);
    setCurrentPage(1); // Reset to the first page when search term changes
  }, [searchTerm, addedCategory]);

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategory.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );
  const totalPages = Math.ceil(filteredCategory.length / categoriesPerPage);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mx-auto w-[90%] py-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold">ALL Post Categories</p>
        <div className="flex gap-2">
        <Link href="/admin/blog" >
          <button className="bg-gray-800 font-bold hover:bg-gray-600 text-white rounded-lg  pl-10 pr-10  h-10">
            Back
          </button>
          </Link>
        <Link href="/admin/blog/postcategory/addpostcategory" >
          <button className="bg-gray-800 font-bold hover:bg-gray-600 text-white rounded-lg  h-10  pl-10 pr-10">
            Add a new category
          </button>
        </Link>
        </div>
      </div>
      <input
        type="text"
        placeholder="Search categories"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mt-4 p-2 border border-gray-300 rounded"
      />
      <div className="max-2xl:h-80 h-[50vh]">
      <table className="w-full rounded overflow-hidden table-fixed">
        <thead>
          <tr className="bg-gray-800 ">
            
            <th className="px-4 py-3 w-1/3">Name</th>
            <th className="px-4 py-3 w-1/3"> Created By</th>
            <th className="px-4 py-3 w-1/3 text-center"> Action</th>
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
        ) : filteredCategory.length === 0 ? (
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
          {currentCategories.map((item, index) => (
            <tr key={index} className="bg-white text-balck">
             <td className="border px-4 py-2">{item.name}</td>

              <td className="border px-4 py-2">{item?.user?.username}</td>
              <td>
               
                <div className="flex items-center justify-center gap-2">
                <select
                    className={`w-50 text-black rounded-md p-2 ${
                      item.vadmin === "not-approve"
                        ? "bg-gray-400 text-white"
                        : "bg-green-500 text-white"
                    }`}
                    value={item.vadmin}
                    onChange={(e) =>
                      updateBlogCategoryStatus(item._id, e.target.value)
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
                  <Link href={`/admin/blog/postcategory/${item._id}`}>
                    <button className="bg-gray-800 text-white w-28 h-10  hover:bg-gray-600 rounded-md">
                      Modify
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(item)}
                    className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md"
                    disabled={loadingCategoryId === item._id}
                  >
                    {loadingCategoryId ===item._id ? "Processing..." :<FaTrashAlt />}
                  </button>
                  {isPopupOpen && (
                    <DeletePopup
                      handleClosePopup={handleClosePopup}
                      Delete={DeleteCategory}
                      id={selectedCatgory.id}
                      name={selectedCatgory.name}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>)}
      </table></div>
      <div className="flex justify-center mt-4">
        
      <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalPages)}
          onPageChange={setCurrentPage}/>
      </div>
    </div>
  );
};

export default AddedCategories;
