"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from 'react-toastify';
interface BrandData {
  name: string;
  place: string;
  imageUrl: string;
  logoUrl: string;
}

const ModifyBrand = () => {
  const params = useParams() as { id: string }; // Explicitly type the params object
  const router = useRouter();
  const [brandData, setBrandData] = useState<BrandData>({
    name: "",
    place: "",
    imageUrl: "",
    logoUrl: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<File | null>(null);

  useEffect(() => {
    // Fetch brand data by ID
    const fetchBrandData = async () => {
      try {
        const response = await fetch(`/api/brand/admin/getBrandById/${params.id}`);
        if (!response.ok) {
          throw new Error("Error fetching brand data");
        }
        const data = await response.json();
        setBrandData(data);
      } catch (error) {
        console.error("Error fetching brand data:", error);
      }
    };
  
    fetchBrandData();
  }, [params.id]);
  

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBrandData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleIconChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedIcon(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", brandData.name);
    formData.append("place", brandData.place);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
    if (selectedIcon) {
      formData.append("logo", selectedIcon);
    }
  
    try {
      const response = await fetch(`/api/brand/admin/updateBrand/${params.id}`, {
        method: "PUT",
        body: formData,
       
      });
  
      if (!response.ok) {
        throw new Error("Error updating brand");
      }
      toast.success(`Brand  ${brandData.name} modification successfully!`);
    router.push('/admin/brand');
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  

  return (
    <div className="mx-auto w-[90%] max-xl:w-[90%] py-8 max-lg:pt-20 flex flex-col gap-8">
      <p className="text-3xl font-bold">Modify Brand</p>
      <form onSubmit={handleSubmit} className="flex max-lg:flex-col max-lg:gap-4 lg:items-center gap-4">
        <div className="flex items-center w-[40%] max-lg:w-full gap-6 justify-between">
          <p className="text-xl max-lg:text-base font-bold">Name*</p>
          <input
            type="text"
            name="name"
            value={brandData.name}
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-[80%] block p-2.5"
            required
          />
        </div>
        <div className="flex items-center w-[40%] max-lg:w-full gap-6 justify-between">
          <p className="text-xl max-lg:text-base font-bold">Place*</p>
          <input
            type="text"
            name="place"
            value={brandData.place}
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-[80%] block p-2.5"
            required
          />
        </div>
        <div className="flex items-center w-[30%] max-lg:w-full justify-between">
          <p className="max-lg:text-base font-bold">Upload Image</p>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="upload-image"
            onChange={handleImageChange}
          />
          <label
            htmlFor="upload-image"
            className="bg-[#EFEFEF] max-xl:text-xs text-black rounded-md w-[50%] h-10 border-2 flex items-center justify-center cursor-pointer"
          >
            Select an Image
          </label>
        </div>
        {brandData.imageUrl && !selectedImage && (
          <div className="flex items-center w-[10%] max-lg:w-full justify-between">
            <Image
              src={brandData.imageUrl}
              alt="Current Image"
              width={50}
              height={50}
              className="rounded-md"
            />
          </div>
        )}
        {selectedImage && (
          <div className="flex items-center w-[10%] max-lg:w-full justify-between">
            <Image
              src={URL.createObjectURL(selectedImage)}
              alt="Selected Image"
              width={50}
              height={50}
              className="rounded-md"
            />
          </div>
        )}
        <div className="flex items-center w-[30%] max-lg:w-full justify-between">
          <p className="max-lg:text-base font-bold">Upload Icon</p>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="upload-icon"
            onChange={handleIconChange}
          />
          <label
            htmlFor="upload-icon"
            className="bg-[#EFEFEF] max-xl:text-xs text-black rounded-md w-[50%] h-10 border-2 flex items-center justify-center cursor-pointer"
          >
            Select an Icon
          </label>
        </div>
        {brandData.logoUrl && !selectedIcon && (
          <div className="flex items-center w-[10%] max-lg:w-full justify-between">
            <Image
              src={brandData.logoUrl}
              alt="Current Icon"
              width={50}
              height={50}
              className="rounded-md"
            />
          </div>
        )}
        {selectedIcon && (
          <div className="flex items-center w-[30%] max-lg:w-full justify-between">
            <Image
              src={URL.createObjectURL(selectedIcon)}
              alt="Selected Icon"
              width={50}
              height={50}
              className="rounded-md"
            />
          </div>
        )}
        <div className="w-[20%] max-xl:w-[30%] max-md:w-[50%] items-start">
          <button
            type="submit"
            className="bg-gray-800 text-white hover:bg-gray-600   rounded-md w-full h-10"
          >
            <p className=" font-bold">Modify</p>
          </button>
        </div>
        <div className="w-[20%] max-xl:w-[30%] max-md:w-[50%] items-start">
          <Link href="/admin/brand">
            <button className="bg-white border-2 border-gray-400 hover:bg-gray-600 hover:border-0 hover:text-white rounded-md w-full h-10 flex items-center justify-center">
              <p className=" font-bold">Cancel</p>
            </button>
          </Link>
        </div>
        
      </form>
    </div>
  );
};

export default ModifyBrand;
