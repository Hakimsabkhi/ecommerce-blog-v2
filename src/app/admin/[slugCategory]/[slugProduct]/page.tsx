'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import FirstBlock from '@/components/Admin/Products/Admin/NotApproved/SingleProduct/FirstBlock';
import SecondBlock from '@/components/Admin/Products/Admin/NotApproved/SingleProduct/SecondBlock';
import { FaSpinner } from 'react-icons/fa6';

interface ProductData {
  _id: string;
  name: string;
  description: string;
  info: string;
  ref: string;
  price: number;
  imageUrl?: string;
  images?: string[];
  brand?: Brand;
  stock: number;
  category: Category;
  dimensions?: string;
  discount?: number;
  warranty?: number;
  weight?: number;
  color?: string;
  material?: string;
  status?: string;
  boutique: { _id: string; nom: string; address:string;city:string;phoneNumber:string;vadmin:string };
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Brand {
  _id: string;
  name: string;
  place: string;
  imageUrl: string;
}

export default function ProductPage() {
  const { slugCategory, slugProduct } = useParams();
  const [product, setProduct] = useState<ProductData | null>(null);
 const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `/api/products/admin/getProductByIdAdmin/${slugProduct}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!res.ok) {
          console.error('Product not found');
          return;
        }

        const data = await res.json();
        if (data.category.slug !== slugCategory) {
          console.error('Category mismatch');
          return;
        }

        setProduct(data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }finally{
        setLoading(false);
            }
    };

    fetchProduct();
  }, [slugCategory, slugProduct]);

  
  return (
    <>
    {loading? (
              <div className="flex justify-center items-center h-full w-full py-6 pt-50">
                                  <FaSpinner className="animate-spin text-[30px]" />
                                </div> // or another appropriate fallback UI
            ):(
    <div>
      <FirstBlock product={product} />
      <SecondBlock product={product} />
    </div>)}
    </>
  );
}
