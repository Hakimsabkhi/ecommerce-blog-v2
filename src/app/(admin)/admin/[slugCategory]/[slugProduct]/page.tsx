import React from "react";
import { notFound } from "next/navigation";
import FirstBlock from "@/components/Products/SingleProduct/FirstBlock";
import SecondBlock from "@/components/Products/SingleProduct/SecondBlock";
import { Metadata } from "next";

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

interface PageProps {
  params: {
    slugCategory: string;
    slugProduct: string;
  };
}

// Fetch product data
async function getProduct(id: string): Promise<ProductData | null> {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/products/fgetProductByIdadmin/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 0 }, // Disable caching
      }
    );

    if (!res.ok) {
      console.error("Product not found");
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching product data:", error);
    return null;
  }
}

// Metadata function
export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { slugCategory, slugProduct } = params;

  return {
    title: `Product: ${slugProduct} - Category: ${slugCategory}`,
    description: `Explore ${slugProduct} under the ${slugCategory} category.`,
  };
};

// Page component
export default async function Page({ params }: PageProps) {
  const { slugCategory, slugProduct } = params;

  const product = await getProduct(slugProduct);

  // Return 404 if product is not found or category doesn't match
  if (!product || slugCategory !== product.category.slug) {
    notFound();
  }

  return (
    <div>
      <FirstBlock product={product} />
      <SecondBlock product={product} />
    </div>
  );
}
