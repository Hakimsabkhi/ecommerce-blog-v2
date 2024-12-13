import React from "react";
import Image from "next/image";
import ProductCard from "./Products/ProductPage/ProductCard";

interface Brand {
  _id: string;
  name: string;
}

interface Products {
  _id: string;
  name: string;
  description: string;
  ref: string;
  tva:number;
  price: number;
  imageUrl?: string;
  brand?: Brand; // Make brand optional
  stock: number;
  discount?: number;
  color?: string;
  material?: string;
  status?: string;
  statuspage: string;
  category:category;
  slug:string;
}
interface category{
  _id:string;
  name:string;
  slug:string;
}

interface Brand {
  _id: string;
  name: string;
  place: string;
  imageUrl: string;
}

// Function to fetch categories data
const fetchProduct = async (): Promise<Products[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/products/getProductbyStatue`
    ); // Adjust the API endpoint
    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }
    const data: Products[] = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const Collection: React.FC = async () => {
  const products = await fetchProduct();
  const filteredProducts = products.filter(item => item.statuspage === "best-collection").length;
  return (
    <div className="desktop max-lg:w-[95%] flex flex-col justify-center items-center gap-10 py-8">
       {filteredProducts>0 &&<div className="col-span-full flex flex-col items-center gap-2">
        <h2 className="font-bold text-HomePageTitles text-4xl">Product Collection</h2>
      </div>}

      <div className="grid grid-cols-4 w-full max-sm:grid-cols-1 max-xl:grid-cols-2 group max-2xl:grid-cols-3 gap-8 max-md:gap-3">
        {products.map(
          (item, _id) =>
            item.statuspage === "best-collection" && (
              <ProductCard key={item._id} item={item} />
            )
        )}
      </div>
    </div>
  );
};

export default Collection;
