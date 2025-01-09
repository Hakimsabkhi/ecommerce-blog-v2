"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaSpinner } from "react-icons/fa";
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

const ListPromotion: React.FC = () => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const is2xl = useIs2xl();
  const productsPerPage = is2xl ? 8 : 5;

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [colSpan, setColSpan] = useState(5);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch(
          "/api/promotion/admin/getproductpromotionB",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
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
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "/api/category/admin/getAllCategoryAdmin",
          {
            method: "GET",
            next: { revalidate: 0 }, // Disable caching to always fetch the latest data
          }
        );
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
    getProducts();
  }, []);
  useEffect(() => {
    const updateColSpan = () => {
      const isSmallestScreen = window.innerWidth <= 640; // max-sm

      const isMediumScreen = window.innerWidth <= 1024; // max-lg

      if (isSmallestScreen) {
        setColSpan(3); // max-sm: colSpan = 3
      } else if (isMediumScreen) {
        setColSpan(4); // max-lg: colSpan = 5
      } else {
        setColSpan(5); // Default: colSpan = 6
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
      <div className="flex justify-between">
        <p className="text-3xl font-bold">ALL Products Promotion</p>
        <Link href="/admin/promotion/banner">
          <button className="bg-gray-800 font-bold hover:bg-gray-600 text-white rounded-lg p-2">
            <p>Banner promotion</p>
          </button>
        </Link>
      </div>

      <div className="flex justify-between items-center  ">
        <input
          type="text"
          placeholder="Search products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg max-sm:w-[50%]"
        />
        <select
          name="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block p-2.5 min-w-32"
          required
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="max-2xl:h-80 h-[50vh] max-md:hidden">
        <table className="w-full rounded overflow-hidden table-fixed ">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-3 w-1/5">REF</th>
              <th className="px-4 py-3 w-1/5 md:max-lg:w-[25%]">Name</th>
              <th className="px-4 py-3 w-1/5">ImageURL</th>
              <th className="px-4 py-3 w-1/5 max-lg:hidden">Created By</th>
              <th className="px-4 text-center py-3 w-1/5 md:max-lg:w-[35%]">
                Action
              </th>
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
                    <p>Aucune categorie trouvée.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {currentProducts.map((item) => (
                <tr key={item._id} className="even:bg-gray-100 odd:bg-white">
                  <td className="border px-4 py-2 truncate">{item.ref}</td>
                  <td className="border px-4 py-2 truncate">{item.name}</td>
                  <td className="border px-4 py-2 max-sm:hidden">
                    <div className="items-center justify-center flex">
                      <Image
                        alt={item.name}
                        src={item.imageUrl}
                        width={50}
                        height={50}
                      />
                    </div>
                  </td>
                  <td className="border px-4 py-2 max-lg:hidden">
                    {item?.user?.username}
                  </td>
                  <td className="border px-4 py-2">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/${item.vadmin === "approve" ? "" : "admin/"}${
                          item.category?.slug
                        }/${item.slug}`}
                      >
                        <button className="bg-gray-800 text-white px-2 h-10 hover:bg-gray-600 rounded-md max-sm:text-sm">
                          See Product
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <div className="flex flex-col gap-4 md:hidden">
        {currentProducts.map((product) => (
          <div
            key={product._id}
            className="p-4 mb-4 flex flex-col gap-4 bg-gray-100 rounded shadow-md"
          >
            <div className="flex flex-col gap-2">
              <div className="flex  text-3xl font-semibold uppercase text-center justify-center ">
                <p className="">{product.name}</p>
              </div>
              <hr className="border-white border-2 w-full my-2" />
              <div className="w-full flex justify-center py-2">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={300}
                  height={100}
                  className="rounded-lg"
                />
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-2 font-semibold ">
                  <p className="text-gray-600 ">REF:</p>
                  <p >{product.ref}</p>
                </div>
                <Link href={`/${product.slug}`}>
                  <button className="bg-gray-800 text-white px-4 py-2 rounded-md">
                    See Product
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
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

export default ListPromotion;
