"use client"
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Use 'next/navigation' for Next.js App Route
import ProductCard from '../ProductPage/ProductCard';


interface ProductData {
  _id: string;
  name: string;
  description: string;
  ref: string;
  tva:number;
  price: number;
  imageUrl?: string;
  category:category
  brand?: Brand; // Make brand optional
  stock: number;
  discount?: number;
  color?: string;
  material?: string;
  status?: string;
  slug:string;
}
interface category{
  _id:string;
  name:string;
  slug:string;
}

interface Brand {
  _id: string;
  place: string;
  name: string;
  imageUrl: string;
}

const FifthBlock: React.FC = () => {
  const params = useParams<{ slugCategory?: string }>(); // Adjust params based on your route setup
  const categoryId = params.slugCategory; // Safe access
  const [products, setProducts] = useState<ProductData[]>([]);
  const [error, setError] = useState<string | null>(null);
console.log(products)
  useEffect(() => {
    const fetchCategory = async () => {
      if (categoryId) {
        try {
          const response = await fetch(`/api/search/${categoryId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch products');
          }
          const data = await response.json();
          setProducts(data.products);
        } catch (error) {
          setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        }  
      }
    };
    fetchCategory();
  }, [categoryId]);
  const getRandomProducts = (products: ProductData[], n: number) => {
    const shuffled = [...products].sort(() => Math.random() - 0.5); // Shuffle the array
    return shuffled.slice(0, n); // Return the first 'n' items
  };

  // Get 4 random products
  const randomProducts = getRandomProducts(products, 4);
    return (
      <main className=' desktop bg-white py-10 flex justify-center flex-col  gap-8 p-4 '>
      <hr></hr>
        <p className="text-xl ">Produit Similaire</p>
      
      <div className="grid grid-cols-4 w-full max-sm:grid-cols-1 max-xl:grid-cols-2 group max-2xl:grid-cols-3 gap-8 max-md:gap-3">
        { error ? (
          <div className="col-span-full text-center text-red-600">{error}</div> // Display error message
        ) : (
          randomProducts.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))
        )}
      </div>
    </main>
    );
}

export default FifthBlock;