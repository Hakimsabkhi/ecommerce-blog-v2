import React from 'react';
import Products from '@/components/Products';
import Chairsbanner from '@/components/Chairsbanner';
import { ICategory } from '@/models/Category';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: {
    slugCategory?: string;
  };
}

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
category:Category;
slug:string;
}
interface Category {
  name: string;
  slug:string;
}
interface Brand {
  _id: string;
  name: string;
}

// Fetch category data by ID
const fetchCategoryData = async (id: string): Promise<ICategory | null> => {
  try {
    if (!id) return notFound(); // Check if id is valid
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/searchcategory/${id}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 }, 
    });


    if (!res.ok) {
      console.log('Category not found');
      return notFound();
    }

    const data: ICategory = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching category data:', error);
    return notFound();
  }
};


// HomePage component
async function CategoryPage({ params }: CategoryPageProps) {

 const id = params?.slugCategory;

  // Early return if no product id
  if (!id) {
    return notFound();
  }

  const category = await fetchCategoryData(id);
  /* const products = await fetchProductsData(id);
  const brand = await fetchBrandData(); */

  // Return 404 if no category or products found
  if (!category ) {
    return notFound();
  } 

  return (
    <div>
      {/* Uncomment the following if you need to show a banner */}
      <Chairsbanner category={category} />
        <Products params={params}  /> 
    </div>
  );
}

// Export the HomePage component at the end
export default CategoryPage;
