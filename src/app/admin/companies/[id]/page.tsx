"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const Page = () => {
     const params = useParams() as { id: string };
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [imgPatentes, setImgPatentes] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    matriculefiscal: '',
    address: '',
    numtele: '',
    gerantsoc: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
 // Assuming you have a company ID, can be fetched from the URL or context

  // Fetch company data when component is mounted
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await fetch(`/api/companies/admin/getcompaiesbyid/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch company data');
        }
        const data = await response.json();
        setFormData({
          name: data.name,
          matriculefiscal: data.matriculefiscal,
          address: data.address,
          numtele: data.numtele,
          gerantsoc: data.gerantsoc,
        });
        setImagePreview(data.imgPattente); // Assuming the image URL is provided
      } catch (error) {
        console.error("Error fetching company data:", error);
        setError("An error occurred while fetching the company data.");
      }
    };

    fetchCompanyData();
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (e.target.files) {
        setImgPatentes(e.target.files[0]);
    
    }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // Set the preview image as base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Phone number validation (simple example: only allow digits, and must be at least 8 digits long)
    const phonePattern = /^[0-9]{8,15}$/; // Adjust this pattern based on your specific requirements
    if (!phonePattern.test(formData.numtele)) {
      setError('Invalid phone number. Please enter a valid number with 8 to 15 digits.');
      return;
    }

    // Simple validation checks before submitting
    if (!formData.name || !formData.matriculefiscal || !formData.address ||
        !formData.numtele || !formData.gerantsoc) {
      setError('All fields are required and an image must be uploaded');
      return; // Stop submission if there's an error
    }

    const formDataObj = new FormData();
    formDataObj.append('name', formData.name);
    formDataObj.append('matriculefiscal', formData.matriculefiscal);
    formDataObj.append('address', formData.address);
    formDataObj.append('numtele', formData.numtele);
    formDataObj.append('gerantsoc', formData.gerantsoc);

    if (imgPatentes) {
      formDataObj.append('imgPatentes', imgPatentes); // imgPatentes is of type File
    }

    try {
      const response = await fetch(`/api/companies/admin/updatecompanies/${params.id}`, {
        method: "PUT", // Use PUT for updating data
        body: formDataObj,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error updating company");
      }

      router.push("/admin/companies"); // Redirect after successful update
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error updating company:", error.message);
        setError(error.message);
      } else {
        console.error("Unknown error:", error);
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 mx-auto w-[90%] py-8">
      <p className="text-3xl font-bold">Update Entreprise</p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center mx-auto gap-4 w-full lg:w-3/5"
      >
        <div className="flex items-center gap-6 w-full justify-between">
          <p className="text-xl max-lg:text-base font-bold">Name Entreprise*</p>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="bg-gray-50 border w-1/2 border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
            required
          />
        </div>

        <div className="flex items-center gap-6 w-full justify-between">
          <p className="text-xl max-lg:text-base font-bold">Matricule Fiscal*</p>
          <input
            type="text"
            name="matriculefiscal"
            value={formData.matriculefiscal}
            onChange={handleInputChange}
            className="bg-gray-50 border w-1/2 border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
            required
          />
        </div>

        <div className="flex items-center gap-6 w-full justify-between">
          <p className="text-xl max-lg:text-base font-bold">Address*</p>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="bg-gray-50 border w-1/2 border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
            required
          />
        </div>

        <div className="flex items-center gap-6 w-full justify-between">
          <p className="text-xl max-lg:text-base font-bold">Telephone*</p>
          <input
            type="text"
            name="numtele"
            value={formData.numtele}
            onChange={handleInputChange}
            className="bg-gray-50 border w-1/2 border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
            required
          />
        </div>

        <div className="flex items-center gap-6 w-full justify-between">
          <p className="text-xl max-lg:text-base font-bold">Nom de gérant de société*</p>
          <input
            type="text"
            name="gerantsoc"
            value={formData.gerantsoc}
            onChange={handleInputChange}
            className="bg-gray-50 border w-1/2 border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
            required
          />
        </div>

        <div className="flex w-full items-center justify-between">
          <p className="max-lg:text-base font-bold">Upload Image Pattente*</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="upload-image"
          />
          <label
            htmlFor="upload-image"
            className="bg-[#EFEFEF] max-xl:text-xs text-black rounded-md w-[50%] h-10 border-2 flex items-center justify-center cursor-pointer"
          >
            Select an Image
          </label>
          {imagePreview && (
            <div className="w-[50%] max-lg:w-full">
              <Image
                src={imagePreview}
                alt="Image preview"
                className="w-full h-auto mt-4"
                width={500}
                height={500}
              />
            </div>
          )}
           {imagePreview && (
            <div className="w-[50%] max-lg:w-full">
              <Image
                src={imagePreview}
                alt="Image preview"
                className="w-full h-auto mt-4"
                width={500}
                height={500}
              />
            </div>
          )}
        </div>

        <div className="flex w-full justify-center gap-4 px-20">
          <Link className="w-1/2" href="/admin/companies">
            <button className="w-full rounded-md border-2 font-light h-10">
              <p className="font-bold">Cancel</p>
            </button>
          </Link>
          <button
            type="submit"
            className="w-1/2 bg-gray-800 text-white rounded-md hover:bg-gray-600 h-10"
          >
            <p className="text-white">Update Entreprise</p>
          </button>
        </div>
      </form>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default Page;
