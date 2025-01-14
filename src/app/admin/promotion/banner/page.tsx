"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const DisplayBanner: React.FC = () => {
  const [name, setName] = useState("");
  const [PomotionData, setPomotionData] = useState(null);
  const [iconPreviewBanner, setIconPreviewBanner] = useState<string | null>(
    null
  );
  const router = useRouter();
  const fetchPomotionData = async () => {
    try {
      const response = await fetch(`/api/promotion/admin/getpromotion`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Error fetching promotion data");
      }
      const data = await response.json();
      setPomotionData(data);
      setName(data.name || "");

      if (data.bannerUrl) {
        setIconPreviewBanner(data.bannerUrl);
      }
    } catch (error) {
      console.error("Error fetching promotion data:", error);
    }
  };
  useEffect(() => {
    // Fetch company data

    fetchPomotionData();
  }, []);
  return (
    <div className="  mx-auto mt-8 ">
      <div className="flex justify-center">
        <p className="text-3xl font-bold">Promation Details</p>
      </div>

      <div className="flex flex-col items-center gap-4 mt-8">
        

        <div className="mb-4 w-[50%] max-md:w-4/5 ">
          <div className="mb-4">
            <p className="block text-lg font-bold">Name Promation</p>
            <p>{name}</p>
          </div>
          <p className="block text-lg font-bold"> Banner</p>
          {iconPreviewBanner && (
            <div className="w-[100%] max-lg:w-full">
              <Image
                src={iconPreviewBanner}
                alt="Banner preview"
                className="w-full h-auto mt-4"
                width={1000}
                height={1000}
              />
            </div>
          )}
          <div className="flex justify-between gap-4 pt-5">
            <button
              type="button"
              className="bg-gray-800 text-white hover:bg-gray-600 rounded-md w-[40%] h-10  mb-6 max-lg:w-[40%]"
              onClick={() => router.push("/admin/promotion")}
            >
              <p className="text-white"> Back</p>
            </button>
            <button
              type="button"
              className="bg-gray-800 text-white hover:bg-gray-600 rounded-md w-[40%] h-10 mb-6 max-lg:w-[40%]"
              onClick={() => router.push("banner/promation")}
            >
              <p className="text-white">
                {" "}
                {PomotionData ? "Update Promation" : "Create Promation"}
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayBanner;
