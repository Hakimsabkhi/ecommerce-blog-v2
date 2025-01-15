import React from "react";
import Image from "next/image";

// Mongoose models & DB connection
import connectToDatabase from "@/lib/db";
import Brand from "@/models/Brand";


// 1) Enable ISR at the page level
export const revalidate = 60; // Re-generate this page every 60s

// 2) Fetch brands data directly from MongoDB
async function getAllBrands() {
  await connectToDatabase();
  
  // For instance, fetch only approved brands, or all—adjust as needed
  const brands = await Brand.find({})
    .populate("user", "_id username") // if you need user info
    .lean();

  // Convert `_id` to string so Next.js won't complain about serializing ObjectIds
  return brands.map((brand) => ({
    ...brand,
    _id: brand._id.toString(),
    // Optionally ensure `imageUrl` and `logoUrl` have a fallback
    imageUrl: brand.imageUrl || "/fallback.jpg",
    logoUrl: brand.logoUrl || "/brand-logo-fallback.png",
  }));
}

export default async function BrandsPage() {
  // 3) Fetch data at build time + revalidate in background
  const brands = await getAllBrands();

  // 4) Render your brand layout (similar to Sellers or Categories)
  return (
    <div className="desktop max-md:w-[95%] flex flex-col gap-10 max-md:gap-4 py-8">
      {brands.length > 0 && (
        <div>
          <div className="flex-col flex gap-2 max-md:gap-1 text-center w-full pb-8">
            <h3 className="font-bold text-4xl text-HomePageTitles">
              Shopping by brands
            </h3>
            <p className="text-base text-[#525566]">
              Discover lots of products from popular brands
            </p>
          </div>

          <div className="grid grid-cols-4 w-full max-md:grid-cols-2 group max-xl:grid-cols-3 gap-8 max-md:gap-3">
            {brands.map((brand, index) => (
              <div key={brand._id} className="flex flex-col group cursor-pointer">
                {/* Header (logo, name, place, etc.) */}
                <div className="flex gap-4 justify-center rounded-t border-x border-t-2 border-black py-4">
                  <Image
                    className="max-xl:w-10 max-xl:h-auto max-lg:w-10 max-lg:h-auto"
                    src={brand.logoUrl}
                    alt={brand.name ?? "Brand logo"}
                    width={40}
                    height={40}
                  />
                  <div className="flex flex-col gap-2">
                    <p className="text-xl max-xl:text-base max-lg:text-sm font-bold">
                      {brand.name}
                    </p>
                    <p className="max-xl:text-xs max-lg:text-sm text-sm">
                      {brand.place}
                    </p>
                  </div>
                </div>

                {/* Main brand image */}
                <Image
                  className="w-full h-auto"
                  src={brand.imageUrl}
                  alt={brand.name ?? "Brand image"}
                  width={300}
                  height={200}
                  priority={index === 0} // Eagerly load the first image for better LCP
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
