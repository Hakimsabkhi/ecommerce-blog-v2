// pages/categories.tsx
import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import React from 'react';


interface Category {
  id: string;
  name: string;
  logoUrl: string;
}

interface CategoriesPageProps {
  categories: Category[];
}

const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`http://loaclhost:3000/api/category/getAllCategory`); // Update URL as needed
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText} (Status: ${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const getStaticProps: GetStaticProps<CategoriesPageProps> = async () => {
  const categories = await fetchCategories();
  return {
    props: {
      categories,
    },
    revalidate: 60, // Optional: Revalidate every 60 seconds
  };
};

const CategoriesPage: NextPage<CategoriesPageProps> = ({ categories }) => {
  return (
    <div>
      <ul className='text-sm'>
        {categories.map((category) => (
          <Link key={category.id} href={`/category/${category.id}`}>
            <li className='cursor-pointer h-10 items-center flex pl-5 hover:bg-gray-200 border'>
              {category.name}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesPage;
