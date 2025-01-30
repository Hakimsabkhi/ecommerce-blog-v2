"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, ChangeEvent } from "react";

import Image from "next/image";
import Link from "next/link";

import { toast } from "react-toastify";

interface SubCategoryData {
  name: string;
  logoUrl: string;
  bannerUrl: string;
}

const ModifyCategory = () => {
  const params = useParams() as { id:string;edit: string }; // Explicitly type the params object
  const router = useRouter();
  const [subCategoryData, setSubCategoryData] = useState<SubCategoryData>({
    name: "",
    logoUrl: "",
    bannerUrl: "",
  });

  const [selectedIcon, setSelectedIcon] = useState<File | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<File | null>(null);

  useEffect(() => {
    // Fetch category data by ID
    const fetchCategoryData = async () => {
      try {
        const response = await fetch(
          `/api/category/admin/SubCategory/getsubCategoryById/${params.edit}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch subcategory data");
        }

        const data = await response.json();
        setSubCategoryData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching subcategory data:", error);
      }
    };

    fetchCategoryData();
  }, [params.edit]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSubCategoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };



  const handleIconChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedIcon(e.target.files[0]);
    }
  };

  const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedBanner(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", subCategoryData.name);
  
    if (selectedIcon) {
      formData.append("logo", selectedIcon);
    }
    if (selectedBanner) {
      formData.append("banner", selectedBanner);
    }

    try {
      const response = await fetch(
        `/api/category/admin/SubCategory/updatesubCategory/${params.edit}`,
        {
          method: "PUT",
          body: formData,
          // Content-Type header is automatically set by the browser when using FormData
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      toast.success(`Sub Category ${subCategoryData.name} modification successfully!`);
      router.push(`/admin/category/subcategory/${params.id}`);
    } catch (error) {
      toast.error(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  return (
    <div className="flex flex-col gap-8  mx-auto w-[90%] py-8 ">
      <p className="text-3xl font-bold">Modify Sub Category</p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center mx-auto gap-4 w-full lg:w-3/5"
      >
        <div className="flex items-center gap-6 w-full justify-between">
          <p className="text-xl max-lg:text-base font-bold">Name*</p>
          <input
            type="text"
            name="name"
            value={subCategoryData.name}
            onChange={handleInputChange}
            className="bg-gray-50 border w-1/2 border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
          />
        </div>

        <div className="flex  w-full  items-center  justify-between">
          <p className="max-lg:text-base font-bold">Upload Icon*</p>
          <input
            type="file"
            accept="image/svg+xml"
            className="hidden"
            id="upload-icon"
            onChange={handleIconChange}
          />
          <label
            htmlFor="upload-icon"
            className="bg-[#EFEFEF] max-xl:text-xs text-black rounded-md w-[60%] h-10 border-2 flex items-center justify-center cursor-pointer"
          >
            Select an Icon Type SVG
          </label>
        </div>
        {subCategoryData.logoUrl && !selectedIcon && (
          <div className="flex items-center w-[30%] max-lg:w-full justify-between">
            <Image
              src={subCategoryData.logoUrl}
              alt="Current Icon"
              width={100}
              height={100}
              className="rounded-md"
            />
          </div>
        )}
        {selectedIcon && (
          <div className="flex items-center w-[30%] max-lg:w-full justify-between">
            <Image
              src={URL.createObjectURL(selectedIcon)}
              alt="Selected Icon"
              width={100}
              height={100}
              className="rounded-md"
            />
          </div>
        )}
       <div className="flex items-center  w-full   justify-between">
          <p className="max-lg:text-base font-bold">Upload Banner*</p>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="upload-banner"
            onChange={handleBannerChange}
          />
          <label
            htmlFor="upload-banner"
            className="bg-[#EFEFEF] max-xl:text-xs text-black rounded-md w-[50%] h-10 border-2 flex items-center justify-center cursor-pointer"
          >
            Select a Banner
          </label>
        </div>
        {subCategoryData.bannerUrl && !selectedBanner && (
          <div className="flex items-center w-[30%] max-lg:w-full justify-between">
            <Image
              src={subCategoryData.bannerUrl}
              alt="Current Banner"
              width={100}
              height={100}
              className="rounded-md"
            />
          </div>
        )}
        {selectedBanner && (
          <div className="flex items-center w-[30%] max-lg:w-full justify-between">
            <Image
              src={URL.createObjectURL(selectedBanner)}
              alt="Selected Banner"
              width={100}
              height={100}
              className="rounded-md"
            />
          </div>
        )}
        <div className="flex w-full justify-center gap-4 px-20">
           <Link className="w-1/2"  href={`/admin/category/subcategory/${params.id}`}>
           <button className="w-full  rounded-md border-2 font-light  h-10
             "><p className="font-bold">Cancel</p>
            </button>
          </Link>
          <button
            type="submit"
            className="w-1/2 bg-gray-800 text-white rounded-md  hover:bg-gray-600 h-10"
            >
            <p className="text-white font-bold">Modify</p>
          </button>
        </div>
        
      </form>
    </div>
  );
};

export default ModifyCategory;
