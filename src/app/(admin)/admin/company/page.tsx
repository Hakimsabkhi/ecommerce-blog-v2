"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image"; // Make sure to import Image if you're using it
import { useRouter } from "next/navigation";

const Display: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [idCompany, setIdCompany] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");
  const [companyData, setCompanyData] = useState(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [iconPreviewBanner, setIconPreviewBanner] = useState<string | null>(
    null
  );
  const [iconPreviewcontacts, setIconPreviewBannerContacts] = useState<string | null>(null);
  const router = useRouter();
  const fetchCompanyData = async () => {
    try {
      const response = await fetch(`/api/company/getCompany`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Error fetching company data");
      }
      const data = await response.json();
      setCompanyData(data);
      setIdCompany(data._id || "");
      setName(data.name || "");
      setPhone(data.phone || "");
      setEmail(data.email || "");
      setAddress(data.address || "");
      setCity(data.city || "");
      setZipcode(data.zipcode || "");
      setGovernorate(data.governorate || "");
      setFacebook(data.facebook || "");
      setLinkedin(data.linkedin || "");
      setInstagram(data.instagram || "");
      if (data.logoUrl) {
        setIconPreview(data.logoUrl);
      }
      if (data.imageUrl) {
        setIconPreviewBanner(data.imageUrl);
      }
      if (data.bannercontacts) {
        setIconPreviewBannerContacts(data.bannercontacts);
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Fetch company data

    fetchCompanyData();
  }, []);
  return (
    <div className="mx-auto w-[90%] max-xl:w-[90%] py-8 max-lg:pt-20 gap-8">
      <p className="text-3xl font-bold">Company Details</p>
      <button
        type="button"
        className="bg-gray-800 text-white hover:bg-gray-600 rounded-md w-[20%] h-10 ml-[70%] mb-6 max-lg:w-[30%]"
        onClick={() => router.push("company/details")}
      >
        <p className="text-white">
          {" "}
          {companyData ? "Update Company" : "Create Company"}
        </p>
      </button>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-center justify-center ml-[20%] max-sm:ml-1">
        <div className="mb-4">
          <p className="block text-lg font-bold">Name Company</p>
          <p>{name}</p>
        </div>
        <div className="mb-4">
          <p className="block text-lg font-bold">Phone</p>
          <p>{phone}</p>
        </div>
        <div className="mb-4">
          <p className="block text-lg font-bold">Email</p>
          <p>{email}</p>
        </div>
        <div className="mb-4">
          <p className="block text-lg font-bold">Address</p>
          <p>{address}</p>
        </div>
        <div className="mb-4">
          <p className="block text-lg font-bold">City</p>
          <p>{city}</p>
        </div>
        <div className="mb-4">
          <p className="block text-lg font-bold">ZipCode</p>
          <p>{zipcode}</p>
        </div>
        <div className="mb-4">
          <p className="block text-lg font-bold">Governorate</p>
          <p>{governorate}</p>
        </div>
        <div className="mb-4">
          <p className="block text-lg font-bold">Upload Icon</p>
          {iconPreview && (
            <div className="w-[15%] max-lg:w-full">
              <Image
                src={iconPreview}
                alt="Icon preview"
                className="w-full h-auto mt-4"
                width={50}
                height={50}
              />
            </div>
          )}
        </div>
        <div className="mb-4">
          <p className="block text-lg font-bold">Upload Banner</p>
          {iconPreviewBanner && (
            <div className="w-[15%] max-lg:w-full">
              <Image
                src={iconPreviewBanner}
                alt="Banner preview"
                className="w-full h-auto mt-4"
                width={50}
                height={50}
              />
            </div>
          )}
        </div>
        <div className="mb-4">
          <p className="block text-lg font-bold">Upload Banner Contact</p>
          {iconPreviewcontacts && (
            <div className="w-[15%] max-lg:w-full">
              <Image
                src={iconPreviewcontacts}
                alt="Banner preview"
                className="w-full h-auto mt-4"
                width={50}
                height={50}
              />
            </div>
          )}
        </div>
        {facebook && (
          <div className="mb-4">
            <p className="block text-lg font-bold">Facebook</p>
            <p>{facebook}</p>
          </div>
        )}

        {linkedin && (
          <div className="mb-4">
            <p className="block text-lg font-bold">LinkedIn</p>
            <p>{linkedin}</p>
          </div>
        )}
        {instagram && (
          <div className="mb-4">
            <p className="block text-lg font-bold">Instagram</p>
            <p>{instagram}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Display;
