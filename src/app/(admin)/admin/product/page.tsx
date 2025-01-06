"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaSpinner, FaTrashAlt, FaRegEye, FaRegEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import DeletePopup from "@/components/Popup/DeletePopup";
import Pagination from "@/components/Pagination";
import Image from "next/image";
import useIs2xl from "@/hooks/useIs2x";

type User = {
  _id: string;
  username: string;
};

type Product = {
  _id: string;
  name: string;
  description: string;
  ref: string;
  price: number;
  imageUrl: string;
  category: Category;
  stock: number;
  user: User;
  discount: number;
  status: string;
  statuspage: string;
  vadmin: string;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
};
interface Category {
  _id: string;
  name: string;
  slug: string;
}

const AddedProducts: React.FC = () => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const is2xl = useIs2xl();
  const productsPerPage=is2xl ? 8 : 5; 
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState({ id: "", name: "" });
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
   const [colSpan, setColSpan] = useState(6);
  const handleDeleteClick = (product: Product) => {
    setLoadingProductId(product._id);
    setSelectedProduct({ id: product._id, name: product.name });
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setLoadingProductId(null);
  };

  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/admin/deleteProduct/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the product");
      }

      setCurrentPage(1);
      setProducts(products.filter((Product) => Product._id !== productId));
      toast.success(`Product ${selectedProduct.name} deleted successfully!`);
      handleClosePopup();
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
    }  finally {
      setLoadingProductId(null);
    }
  };

  const updateProductStatusstock = async (productId: string, newStatus: string) => {
    setLoadingProductId(productId);
    try {
      const updateFormData = new FormData();
      updateFormData.append("status", newStatus);

      const response = await fetch(
        `/api/products/admin/updateStatusProductstock/${productId}`,
        {
          method: "PUT",
          body: updateFormData,
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Product status updated successfully:", data);
      setProducts((prevData) =>
        prevData.map((item) =>
          item._id === productId ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error("Failed to update product status:", error);
      toast.error("Failed to update product status");
    } finally {
      setLoadingProductId(null);
    }
  };
  const updateProductvadmin = async (productId: string, newStatus: string) => {
    setLoadingProductId(productId);
    try {
      const updateFormData = new FormData();
      updateFormData.append("vadmin", newStatus);

      const response = await fetch(
        `/api/products/admin/updateProductvadmin/${productId}`,
        {
          method: "PUT",
          body: updateFormData,
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      setProducts((prevData) =>
        prevData.map((item) =>
          item._id === productId ? { ...item, vadmin: newStatus } : item
        )
      );
      const data = await response.json();
      console.log("Product status updated successfully:", data);
    } catch (error) {
      console.error("Failed to update product status approve:", error);
      toast.error("Failed to update product approve");
    } finally {
      setLoadingProductId(null);
    }
  };
  const updateProductStatusPlace = async (
    productId: string,
    statuspage: string
  ) => {
    setLoadingProductId(productId);
    try {
      const updateFormData = new FormData();
      updateFormData.append("statuspage", statuspage);

      const response = await fetch(
        `/api/products/admin/updatePlaceProduct/${productId}`,
        {
          method: "PUT",
          body: updateFormData,
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Product status page updated successfully:", data);
      setProducts((prevData) =>
        prevData.map((item) =>
          item._id === productId ? { ...item, statuspage: statuspage } : item
        )
      );
      toast.success("Product status updated successfully");
    } catch (error) {
      console.error("Failed to update product status page:", error);
      toast.error("Failed to update product status");
    } finally {
      setLoadingProductId(null);
    }
  };

  useEffect(() => {
    const updateColSpan = () => {
      const isSmallestScreen = window.innerWidth <= 640; // max-sm
      const isSmallScreen = window.innerWidth <= 768; // max-md
      const isMediumScreen = window.innerWidth <= 1024; // max-lg
      const isXlLScreen = window.innerWidth <= 1280; // max-lg

      if (isSmallestScreen) {
        setColSpan(1); // max-sm: colSpan = 3
      } else if (isSmallScreen) {
        setColSpan(2); // max-md: colSpan = 4
      } else if (isMediumScreen) {
        setColSpan(3); // max-lg: colSpan = 5
      } else if (isXlLScreen) {
        setColSpan(4); // max-lg: colSpan = 5
      } else {
        setColSpan(6); // Default: colSpan = 6
      }
    };

    // Initial check
    updateColSpan();

    // Add event listener
    window.addEventListener("resize", updateColSpan);

    // Cleanup event listener
    return () => window.removeEventListener("resize", updateColSpan);
  }, []);
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch("/api/products/admin/getAllProduct", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data: Product[] = await response.json();
        setProducts(data);
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
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearchTerm =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.ref.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "" || product.category._id === selectedCategory;
      return matchesSearchTerm && matchesCategory;
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, products]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mx-auto w-[90%] py-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold">ALL Products</p>
        <Link href="/admin/product/addproduct">
          <button className="bg-gray-800 font-bold hover:bg-gray-600 text-white rounded-lg w-[200px] h-10">
            <p>Add the new Product</p>
          </button>
        </Link>
      </div>

     
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Search products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg max-sm:w-[50%] "
          />
          <select
            name="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block p-2.5 min-w-32"
            required
          >
            {/* <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))} */}
          </select>
        </div>
      
      <div className="max-2xl:h-80 h-[50vh] max-md:hidden">
        <table className="w-full rounded overflow-hidden table-fixed ">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-3 xl:w-1/12 lg:w-1/6 md:w-1/6">REF</th>
              <th className="px-4 py-3 xl:w-2/12 lg:w-1/6 md:w-1/6">Name</th>
              <th className="px-4 py-3 xl:w-1/12 max-xl:hidden">Quantity</th>
              <th className="px-4 py-3 xl:w-1/12 lg:w-1/6 max-lg:hidden">Image</th>
              <th className="px-4 py-3 xl:w-2/12 max-xl:hidden">Created By</th>
              <th className="px-4 py-3 xl:w-5/12 lg:w-2/3 md:w-4/6 text-center">Action</th>
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td colSpan={colSpan}>
                  <div className="flex justify-center items-center h-full w-full py-6">
                    <FaSpinner className="animate-spin text-[30px]" />
                  </div>
                </td>
              </tr>
            </tbody>
          ) : filteredProducts.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={colSpan}>
                  <div className="text-center py-6 text-gray-600 w-full">
                    <p>Aucune Products trouvée.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {currentProducts.map((item) => (
                <tr key={item._id} className="bg-white text-black">
                  <td className="border px-4 py-2 truncate">{item.ref}</td>
                  <td className="border px-4 py-2 truncate">
                    {item.name}
                  </td>
                  <td className="border px-4 py-2 text-center  max-xl:hidden">{item.stock}</td>
                  <td className="border px-4 py-2 max-lg:hidden">
                    <div className="items-center justify-center flex">
                      <Image
                        alt={item.name}
                        src={item.imageUrl}
                        width={50}
                        height={50}
                      />
                    </div>
                  </td>
                  <td className="border px-4 py-2  max-xl:hidden">{item?.user?.username}</td>
                  <td className="border px-4 py-2">
                    <div className="flex items-center justify-center gap-2">
                      <select
                        className={`w-50 text-black rounded-md truncate p-2 ${
                          item.vadmin === "not-approve"
                            ? "bg-gray-400 text-white"
                            : "bg-green-500 text-white"
                        }`}
                        value={item.vadmin}
                        onChange={(e) =>
                          updateProductvadmin(item._id, e.target.value)
                        }
                      >
                        <option
                          value="approve"
                          className="text-white uppercase"
                        >
                          approve
                        </option>
                        <option
                          value="not-approve"
                          className="text-white uppercase"
                        >
                          Not approve{" "}
                        </option>
                      </select>
                      {item.stock > 0 ? (
                        <select
                          className={`w-50 text-black truncate rounded-md p-2 ${
                            item.status === "in-stock"
                              ? "bg-gray-800 text-white"
                              : item.status === "out-of-stock"
                              ? "bg-red-700 text-white"
                              : "bg-gray-800 text-white" // If none of the conditions match, apply no background color
                          }`}
                          value={item.status}
                          onChange={(e) =>
                            updateProductStatusstock(item._id, e.target.value)
                          }
                        >
                          <option value="in-stock" className="text-white">
                            In stock
                          </option>
                          <option value="out-of-stock" className="text-white">
                            Out of stock
                          </option>
                        </select>
                      ) : (
                        <div className="w-32 bg-gray-500 text-white rounded-md p-2 ">
                          <p>Out of stock</p>
                        </div>
                      )}
                      <select
                        className={` text-black rounded-md p-2 truncate ${
                          item.statuspage === "none"
                            ? "bg-gray-800 text-white"
                            : "bg-emerald-950 text-white"
                        }`}
                        value={item.statuspage || ""}
                        onChange={(e) =>
                          updateProductStatusPlace(item._id, e.target.value)
                        }
                        disabled={loadingProductId === item._id}
                      >
                        <option value="">Select a Place</option>
                        <option value="home-page">Weekly Best Sellers</option>
                        <option value="best-collection">Best Collection</option>
                        <option value="promotion">Promotion</option>
                      </select>

                      <Link href={`/admin/product/${item._id}`}>
                        <button className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md">
                          <FaRegEdit />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="bg-gray-800 text-white pl-3 w-10 min-w-10 h-10 hover:bg-gray-600 rounded-md"
                        disabled={loadingProductId === item._id}
                      >
                        {loadingProductId === item._id ? (
                          "Processing..."
                        ) : (
                          <FaTrashAlt />
                        )}
                      </button>
                      <Link
                        href={`/${item.vadmin === "approve" ? "" : "admin/"}${
                          item.category?.slug
                        }/${item.slug}`}
                      >
                        <button className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md">
                          <FaRegEye />
                        </button>
                      </Link>

                      {isPopupOpen && (
                        <DeletePopup
                          handleClosePopup={handleClosePopup}
                          Delete={deleteProduct}
                          id={selectedProduct.id}
                          name={selectedProduct.name}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <div className="space-y-4 md:hidden">
  {loading ? (
    <div className="flex justify-center items-center h-full w-full py-6">
      <FaSpinner className="animate-spin text-[30px]" />
    </div>
  ) : filteredProducts.length === 0 ? (
    <div className="text-center py-6 text-gray-600 w-full">
      <p>No products found.</p>
    </div>
  ) : (
    currentProducts.map((item) => (
      <div
        key={item._id}
        className="p-4 mb-4 bg-gray-100 rounded shadow-md"
      >
        <div>
            <div className=" ">
                
                <div className="flex  gap-1 ">
                  <p className="text-gray-600 font-medium w-1/5 mr-4">REF:</p>
                  <p>{item.ref}</p>
                </div>
                
                <div className="flex  gap-1 ">
                  <p className="text-gray-600 font-medium w-1/5 mr-4">Name:</p>
                  <p className="truncate">{item.name}</p>
                  </div>
                  <div className="flex gap-1 ">
                  <p className="text-gray-600 font-medium w-1/5 mr-4">Quantity:</p>
                  <p>{item.stock}</p>
                  </div>
                <div className="flex gap-5 ">
                  <p className="text-gray-600 font-medium w-1/5 mr-4 pb-2">Image:</p>
                  <div className="w-full">
                    <Image
                      alt={item.name}
                      src={item.imageUrl}
                      width={100}
                      height={100}
                      className="rounded-md"
                    />
                  </div>
                </div>
              </div>
        </div>
        <div>
          <p className="text-gray-600 font-medium pb-2">Actions:</p>
          <div className="flex flex-col gap-2">
            <div className="justify-center flex gap-4">
              <select
                className={`w-50 text-black rounded-md p-2 ${
                  item.vadmin === "not-approve"
                    ? "bg-gray-400 text-white"
                    : "bg-green-500 text-white"
                }`}
                value={item.vadmin}
                onChange={(e) => updateProductvadmin(item._id, e.target.value)}
              >
                <option value="approve" className="text-white uppercase">
                  Approve
                </option>
                <option value="not-approve" className="text-white uppercase">
                  Not Approve
                </option>
              </select>
              {item.stock > 0 ? (
                <select
                  className={`w-50 text-black rounded-md p-2 ${
                    item.status === "in-stock"
                      ? "bg-gray-800 text-white"
                      : "bg-red-700 text-white"
                  }`}
                  value={item.status}
                  onChange={(e) =>
                    updateProductStatusstock(item._id, e.target.value)
                  }
                >
                  <option value="in-stock" className="text-white">
                    In Stock
                  </option>
                  <option value="out-of-stock" className="text-white">
                    Out of Stock
                  </option>
                </select>
              ) : (
                <div className="w-32 bg-gray-500 text-white rounded-md p-2">
                  <p>Out of Stock</p>
                </div>
              )}
            </div>
            <div className="flex justify-center">
            <select
              className={`w-72 text-black rounded-md p-2 ${
                item.statuspage === "none"
                  ? "bg-gray-800 text-white"
                  : "bg-emerald-950 text-white"
              }`}
              value={item.statuspage || ""}
              onChange={(e) =>
                updateProductStatusPlace(item._id, e.target.value)
              }
              disabled={loadingProductId === item._id}
            >
              <option value="">Select a Place</option>
              <option value="home-page">Weekly Best Sellers</option>
              <option value="best-collection">Best Collection</option>
              <option value="promotion">Promotion</option>
            </select>
            </div>
            <div className="flex justify-center gap-5  ">
              <Link href={`/admin/product/${item._id}`}>
                <button className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md">
                  <FaRegEdit />
                </button>
              </Link>
              <button
                onClick={() => handleDeleteClick(item)}
                className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md"
                disabled={loadingProductId === item._id}
              >
                {loadingProductId === item._id ? "Processing..." : <FaTrashAlt />}
              </button>
              <Link
                href={`/${item.vadmin === "approve" ? "" : "admin/"}${
                  item.category?.slug
                }/${item.slug}`}
              >
                <button className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md">
                  <FaRegEye />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    ))
  )}
</div>
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

export default AddedProducts;
