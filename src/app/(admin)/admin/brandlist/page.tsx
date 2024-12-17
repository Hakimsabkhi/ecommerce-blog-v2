"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaSpinner, FaTrashAlt } from "react-icons/fa";
import { toast } from 'react-toastify';
import DeletePopup from "@/components/Popup/DeletePopup";
import Pagination from '@/components/Pagination';
import useIs2xl from '@/hooks/useIs2x';

type Brand = {
  _id: string;
  name: string;
  place: string;
  imageUrl: string;
  logoUrl: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
};

interface User {
  _id: string;
  username: string;
}

const AddedBrands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const is2xl = useIs2xl();
  const brandsPerPage = is2xl ? 8 : 5; // Number of brands to display per page
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState({ id: '', name: '' });
  const [loadingBrandId, setLoadingBrandId] = useState<string | null>(null);



  const handleDeleteClick = (brand: Brand) => {
    setLoadingBrandId(brand._id);
    setSelectedBrand({ id: brand._id, name: brand.name });
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setLoadingBrandId(null);
  };

  const deleteBrand = async (brandId: string) => {
    try {
      const response = await fetch(`/api/brand/deleteBrand/${brandId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      handleClosePopup();
      toast.success("Brand deleted successfully!");
      setBrands(brands.filter((brand) => brand._id !== brandId));
    } catch (error: unknown) {
      // Handle different error types effectively
      if (error instanceof Error) {
        console.error("Error deleting category:", error.message);
      } else if (typeof error === "string") {
        console.error("String error:", error);
      } else {
        console.error("Unknown error:", error);
      }
    }  finally {
      setLoadingBrandId(null);
    }
  };

  const getBrands = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/brand/getAllBrandAdmin`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Brand[] = await response.json();
      setBrands(data);
    } catch (error: unknown) {
      // Handle different error types effectively
      if (error instanceof Error) {
        console.error("Error deleting category:", error.message);
      } else if (typeof error === "string") {
        console.error("String error:", error);
      } else {
        console.error("Unknown error:", error);
      }
    }  finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBrands();
  }, []);

  useEffect(() => {
    const filtered = brands.filter((brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBrands(filtered);
    setCurrentPage(1); // Reset to the first page when search term changes
  }, [searchTerm, brands]);

  const indexOfLastBrand = currentPage * brandsPerPage;
  const indexOfFirstBrand = indexOfLastBrand - brandsPerPage;
  const currentBrands = filteredBrands.slice(indexOfFirstBrand, indexOfLastBrand);
  const totalPages = Math.ceil(filteredBrands.length / brandsPerPage);



  return (
    <div className='mx-auto w-[90%] py-8 flex flex-col gap-8'>
      <div className="flex items-center justify-between">
        <p className='text-3xl font-bold'>ALL Brands</p>
        <Link href="/admin/brandlist/addbrand" className="w-[15%]">
          <button className='bg-gray-800 font-bold hover:bg-gray-600 text-white rounded-lg w-full h-10'>
            Add a new Brand
          </button>
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search brands"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='mt-4 p-2 border border-gray-300 rounded'
      />

      <div className='max-2xl:h-80 h-[50vh]'>
      <table className="w-full  rounded overflow-hidden table-fixed ">
        <thead>
          <tr className='bg-gray-800'>
            <th className="px-4 text-left border-r-white py-3 w-[20px]">Icon</th>
            <th className="px-4 text-left border-r-white py-3 w-[120px]">ImageURL</th>
            <th className="px-4 text-left border-r-white py-3 w-[80px]">Name</th>
            <th className="px-4 text-left border-r-white py-3 w-[80px]">Place</th>
            <th className="px-4 text-left border-r-white py-3 w-[80px]">Created By</th>
            <th className="px-4 text-left border-r-white py-3 w-[200px]">Action</th>
          </tr>
        </thead>
        {loading ? (
            <tbody>
              <tr>
                <td colSpan={6}>
                  <div className="flex justify-center items-center h-full w-full py-6">
                    <FaSpinner className="animate-spin text-[30px] items-center" />
                  </div>
                </td>
              </tr>
            </tbody>
          ) : filteredBrands.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={6}>
                  <div className="text-center py-6 text-gray-600 w-full">
                    <p>Aucune marque trouvée.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
        <tbody>
          {currentBrands.map((item, index) => (
            <tr key={index} className='bg-white text-black'>
              <td className="border px-4 py-3">
                <Image src={item.logoUrl} width={30} height={30} alt="icon" />
              </td>
              <td className="border px-4 py-3">
                <Link href={item.imageUrl}>
                  {item.imageUrl.split('/').pop()}
                </Link>
              </td>
              <td className="border px-4 py-3">{item.name}</td>
              <td className="border px-4 py-3">{item.place}</td>
              <td className="border px-4 py-3">{item?.user?.username}</td>
              <td className="flex items-center justify-center gap-2">
                <Link href={`/admin/brandlist/${item._id}`}>
                  <button className="bg-gray-800 text-white w-28 h-10 hover:bg-gray-600 rounded-md uppercase">
                    Modify
                  </button>
                </Link>
                <button
                  onClick={() => handleDeleteClick(item)}
                  className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md"
                >
                  {loadingBrandId === item._id ? "Processing..." : <FaTrashAlt />}
                </button>
                {isPopupOpen && (
                  <DeletePopup
                    handleClosePopup={handleClosePopup}
                    Delete={deleteBrand}
                    id={selectedBrand.id}
                    name={selectedBrand.name}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>)}
      </table> </div>

      <div className=''>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default AddedBrands;
