import React from "react";
import Products from "@/components/approve/Products";
import Chairsbanner from "@/components/approve/Chairsbanner";
import { ICategory } from "@/models/Category";
import { notFound } from "next/navigation";

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
  category: Category;
  slug: string;
}

interface Category {
  name: string;
  slug: string;
}

interface Brand {
  _id: string;
  name: string;
}

// Fetch category data
const fetchCategoryData = async (id: string): Promise<ICategory | null> => {
  if (!id) {
    return null; // Return null instead of calling `notFound()` directly here
  }
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/searchcategoryadmin/${id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 0 },
      }
    );

    if (!res.ok) {
      return null; // Handle errors appropriately
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching category data:", error);
    return null;
  }
};


// Fetch products by category ID
const fetchProductsData = async (id: string): Promise<ProductData[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/searchadmin/${id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 0 },
      }
    );

    if (!res.ok) throw new Error("Products not found");
    return res.json();
  } catch (error) {
    console.error("Error fetching products data:", error);
    return [];
  }
};

// Fetch all brands
const fetchBrandData = async (): Promise<Brand[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/brand/getAllBrand`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 0 },
      }
    );

    if (!res.ok) throw new Error("Brand not found");
    return res.json();
  } catch (error) {
    console.error("Error fetching brand data:", error);
    return [];
  }
};

// Category Page component
export default async function CategoryPage({ params }: CategoryPageProps) {
  const id = params?.slugCategory;

  if (!id) return notFound();

  const [category, products, brands] = await Promise.all([
    fetchCategoryData(id),
    fetchProductsData(id),
    fetchBrandData(),
  ]);

  if (!category) {
    return notFound();
  }

  return (
    <div>
      <Chairsbanner category={category} />
      <Products products={products} brands={brands} />
    </div>
  );
}
