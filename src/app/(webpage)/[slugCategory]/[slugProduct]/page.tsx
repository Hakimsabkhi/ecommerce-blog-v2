import React from "react";
import { notFound } from "next/navigation";
import FirstBlock from "@/components/Client/Products/SingleProduct/FirstBlock";
import SecondBlock from "@/components/Client/Products/SingleProduct/SecondBlock";
import ForthBlock from "@/components/Client/Products/SingleProduct/ForthBlock";
import FifthBlock from "@/components/Client/Products/SingleProduct/FifthBlock";
import { getproductbycatgory, getProductById } from "@/lib/StaticCatgoryProduct";






export default async function Page({ params }: { params:Promise< { slugCategory: string; slugProduct: string }>}) {

  const { slugCategory } =  await params;
  const { slugProduct } =  await params;

  const product = await getProductById(slugProduct);
  const productJson = JSON.parse(product)
 const productCategory= await getproductbycatgory(slugCategory) 
    const productCategoryJson = JSON.parse(productCategory)
  
  if (slugCategory !== productJson.category.slug) {
    notFound();
  }

  if (!product) {
    notFound();
  }

  return (
    <div>
      <FirstBlock product={productJson} />
      <SecondBlock product={productJson} />
      <ForthBlock product={productJson} />
      <FifthBlock products={productCategoryJson}/>
    </div>
  );
}
