import React from "react";
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
  statuspage:string;
  category: Category;
  slug:string;
}
interface Category {
  name: string;
  slug:string;
}

// Function to fetch categories data
const fetchProduct = async (): Promise<Products[]> => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products/getProductbyStatue`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
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

const Sellers: React.FC = async () => {
  const products = await fetchProduct();
  const filteredProducts = products.filter(item => item.statuspage === "home-page").length;
  return (
    <div className=" max-lg:w-[95%] desktop mx-auto flex flex-col gap-10 py-8">
      {filteredProducts>0&& <div className="flex w-full flex-col">
       <h3 className="font-bold text-4xl text-center text-HomePageTitles ">
          Weekly bestsellers
        </h3>
      </div>}
      <div className="grid grid-cols-4 w-full max-sm:grid-cols-1 max-xl:grid-cols-2 group max-2xl:grid-cols-3 gap-8 max-md:gap-3">
        {products.map((item) => (
          item.statuspage==="home-page" &&<ProductCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Sellers;
