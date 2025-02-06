import React from "react";
import Image from "next/image";
interface CompanyData {
  bannercontacts: string;
}
const Showroombanner = ({ companyData }: { companyData: CompanyData }) => {
  return (
    <div className="max-lg:pt-16">
      <div className="relative  w-full">
        <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/4 text-white">
          <h1 className="text-8xl font-bold max-lg:text-6xl max-md:text-xl">
            Showrooms
          </h1>
          <p className="max-md:text-xs">HOME / SHOWROOMS</p>
        </div>
        <Image
          src={companyData.bannercontacts}
          alt="banner"
          layout="responsive"
          width={1920}
          height={1080}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1920px"
          className="w-full h-[500px] object-cover"
          priority
        />
      </div>
    </div>
  );
};

export default Showroombanner;
