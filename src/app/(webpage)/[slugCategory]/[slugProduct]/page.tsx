import React from "react";
import { notFound } from "next/navigation";
import FirstBlock from "@/components/Products/SingleProduct/FirstBlock";
import SecondBlock from "@/components/Products/SingleProduct/SecondBlock";
import ForthBlock from "@/components/Products/SingleProduct/ForthBlock";
import FifthBlock from "@/components/Products/SingleProduct/FifthBlock";
import { getProductById } from "@/lib/StaticCatgoryproduct";






export default async function Page({ params }: { params:Promise< { slugCategory: string; slugProduct: string }>}) {

  const { slugCategory } =  await params;
  const { slugProduct } =  await params;

  const products = await getProductById(slugProduct);
  const product = JSON.parse(products)

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
