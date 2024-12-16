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

// Fetch category data by ID
const fetchCategoryData = async (id: string): Promise<ICategory | null> => {
  if (!id) return null; // Early return if the ID is invalid
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/searchcategory/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 }, // Disable caching for dynamic data
    });

    if (!res.ok) {
      console.error('Failed to fetch category data:', res.statusText);
      return null;
    }

    const data: ICategory = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching category data:', error);
    return null;
  }
};

// CategoryPage component
async function CategoryPage({ params }: CategoryPageProps) {
  // Await the params object if it is a Promise
  const resolvedParams = await params;

  const id = resolvedParams?.slugCategory;

  if (!id) {
    return notFound();
  }

  // Fetch category data
  const category = await fetchCategoryData(id);

  if (!category) {
    return notFound();
  }

  // Render category-specific components
  return (
    <div>
      {/* Banner showcasing category details */}
      <Chairsbanner category={category} />
      {/* Products listing */}
      <Products params={resolvedParams} />
    </div>
  );
}

export default CategoryPage;
