"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Company {
  _id?: string;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  zipcode?: string;
  governorate?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
  logoUrl?: string;
  imageUrl?: string;
  bannercontacts?: string;
}

const Display: React.FC = () => {
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
  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [iconPreviewBanner, setIconPreviewBanner] = useState<string | null>(
    null
  );
  const [iconPreviewContacts, setIconPreviewBannerContacts] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCompanyData = async () => {
    try {
      const response = await fetch(`/api/websiteinfo/getwebsiteinfo`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Error fetching websiteinfo data");
      }
      const data = await response.json();
      setCompanyData(data);
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
      setIconPreview(data.logoUrl || null);
      setIconPreviewBanner(data.imageUrl || null);
      setIconPreviewBannerContacts(data.bannercontacts || null);
    } catch (error) {
      console.error("Error fetching company data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  return (
    <div className=" w-[90%] mx-auto pt-8">
      {loading ? (
        <p className="text-xl font-bold text-center">Loading...</p>
      ) : (
        <div className="flex flex-col pl-8">
          <p className="text-3xl font-bold">Company Details</p>
          <button
            type="button"
            className="bg-gray-800 text-white hover:bg-gray-600 rounded-md w-[20%] h-10 ml-[70%] mb-6 max-lg:w-[30%]"
            onClick={() => router.push("company/details")}
          >
            <p className="text-white">{companyData ? "Update" : "Create"}</p>
          </button>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="mb-4">
              <p className="block text-lg font-bold">Upload Icon</p>
              {iconPreview && (
                <Image
                  src={iconPreview}
                  alt="Icon preview"
                  className="w-24 h-auto mt-4"
                  width={50}
                  height={50}
                />
              )}
            </div>
            <div className="mb-4">
              <p className="block text-lg font-bold">Upload Banner</p>
              {iconPreviewBanner && (
                <Image
                  src={iconPreviewBanner}
                  alt="Banner preview"
                  className="w-24 h-auto mt-4"
                  width={50}
                  height={50}
                />
              )}
            </div>
            <div className="mb-4">
              <p className="block text-lg font-bold">Upload Banner Contact</p>
              {iconPreviewContacts && (
                <Image
                  src={iconPreviewContacts}
                  alt="Banner Contact preview"
                  className="w-24 h-auto mt-4"
                  width={50}
                  height={50}
                />
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
      )}
    </div>
  );
};

export default Display;
