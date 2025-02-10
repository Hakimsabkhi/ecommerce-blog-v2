// app/banner/page.tsx
import React from "react";
import Image from "next/image";
import { getWebsiteinfoData } from "@/lib/StaticDataHomePage";

export const revalidate =1000;

export default async function Banner() {
  const companyData = await getWebsiteinfoData();

  return (
    <div className="relative md:h-[600px] shadow-lg">
     <h1 className="absolute z-10 text-xl md:text-4xl lg:text-7xl text-white transform animate-pulse -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 font-bold text-center">
      {companyData?.titlehome}
    </h1>
      <Image
        className="w-full md:h-full"
        fill
        style={{ objectFit: "cover" }}
        alt="banner"
        src={companyData?.imageUrl || "/fallback.jpg"}
        sizes="(max-width: 900px) 400px, 900px"
        loading="eager"
        decoding="async"
        priority // Preload the image
      />
    </div>
  );
}
