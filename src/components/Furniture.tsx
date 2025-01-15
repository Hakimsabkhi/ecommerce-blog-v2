export const revalidate = 60;

import React from 'react';
import ProductCard from './Products/ProductPage/ProductCard';
import { getproductstatusData } from '@/lib/StaticDataHomePage';

interface Brand {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Products {
  _id: string;
  name: string;
  description: string;
  ref: string;
  tva: number;
  price: number;
  imageUrl?: string;
  brand?: Brand;
  stock: number;
  discount?: number;
  color?: string;
  material?: string;
  status?: string;
  statuspage: string;
  category: Category;
  slug: string;
}


const Furniture = async () => {
   const rawProducts = await getproductstatusData();
  
    // Cast `rawProducts` to match the `Products[]` type
    const products: Products[] = Array.isArray(rawProducts) 
    ? rawProducts.map((product: Products) => ({
        ...product,
        _id: product._id?.toString() ?? '', // Ensure _id is treated as a string or fallback to empty string
      }))
    : [];  
  const filteredProductsCount = products.filter(
    (item) => item.statuspage === 'promotion'
  ).length;

  return (
    <div className="desktop max-lg:w-[95%] flex flex-col justify-center items-center gap-10 py-8">
      {filteredProductsCount > 0 && (
        <div className="flex w-full flex-col gap-2 items-center">
          <h3 className="font-bold text-4xl text-HomePageTitles">
            Collection of The Promotion
          </h3>
        </div>
      )}

      <div className="grid grid-cols-4 w-full max-sm:grid-cols-1 max-xl:grid-cols-2 group max-2xl:grid-cols-3 gap-8 max-md:gap-3">
        {products.map(
          (item) =>
            item.statuspage === 'promotion' && (
              <ProductCard key={item._id} item={item} />
            )
        )}
      </div>
    </div>
  );
};

export default Furniture;
