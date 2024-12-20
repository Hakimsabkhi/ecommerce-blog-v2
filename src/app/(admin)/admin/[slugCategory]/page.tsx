'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Products from '@/components/approve/Products';
import Chairsbanner from '@/components/approve/Chairsbanner';

interface ProductData {
  _id: string;
  name: string;
  description: string;
  ref: string;
  price: number;
  imageUrl?: string;
  brand: Brand;
  stock: number;
  discount?: number;
  color?: string;
  material?: string;
  status?: string;
  category: Category;
  slug: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Brand {
  _id: string;
  name: string;
}

export default function CategoryPage() {
  const { slugCategory } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/searchcategoryadmin/${slugCategory}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (!res.ok) {
          console.error('Category not found');
          return;
        }

        const data = await res.json();
        setCategory(data);
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };

    const fetchProductsData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/searchadmin/${slugCategory}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (!res.ok) {
          console.error('Products not found');
          return;
        }

        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products data:', error);
      }
    };

    const fetchBrandData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/brand/getAllBrand`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (!res.ok) {
          console.error('Brands not found');
          return;
        }

        const data = await res.json();
        setBrands(data);
      } catch (error) {
        console.error('Error fetching brand data:', error);
      }
    };

    fetchCategoryData();
    fetchProductsData();
    fetchBrandData();
  }, [slugCategory]);

  if (!category) {
    return <div>Category not found or loading...</div>;
  }

  return (
    <div>
      <Chairsbanner category={category} />
      <Products products={products} brands={brands} />
    </div>
  );
}
