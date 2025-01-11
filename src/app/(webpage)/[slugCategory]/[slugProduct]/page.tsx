import React from "react";
import { notFound } from "next/navigation";
import FirstBlock from "@/components/Products/SingleProduct/FirstBlock";
import SecondBlock from "@/components/Products/SingleProduct/SecondBlock";
import ForthBlock from "@/components/Products/SingleProduct/ForthBlock";
import FifthBlock from "@/components/Products/SingleProduct/FifthBlock";

interface Product {
  _id: string;
  name: string;
  description: string;
  info: string;
  ref: string;
  tva?: number;
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



async function getProduct(id: string): Promise<Product> {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}api/products/fgetProductById/${id}`,
    {
      method: "GET",
      next: { revalidate: 0 },
    }
  );

  if (!res.ok) {
    console.error("Product not found");
    notFound();
  }

  const data: Product = await res.json();
  return data;
}
export default async function Page({ params }: { params:Promise< { slugCategory: string; slugProduct: string }>}) {

  const { slugCategory } =  await params;
  const { slugProduct } =  await params;

  const product = await getProduct(slugProduct);

  if (slugCategory !== product.category.slug) {
    notFound();
  }

  if (!product) {
    notFound();
  }

  return (
    <div>
      <FirstBlock product={product} />
      <SecondBlock product={product} />
      <ForthBlock product={product} />
      <FifthBlock />
    </div>
  );
}
