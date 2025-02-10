import React from "react";
import ProductFilterClient from "@/components/Products/ProductPage/ProductFilterClient"; // <-- Our client component
import { getBestProducts, getCustomProductTitle } from "@/lib/StaticDataHomePage";
import Chairsproduct from "@/components/Chairsproduct";



export default async function ProductsPage() {
 
  try {
 const productstitledata= await getCustomProductTitle()
    const productsRe= await getBestProducts()
    
    const products = JSON.parse(productsRe)
    const producttitle = JSON.parse(productstitledata)
    return (

      <>
      <Chairsproduct title={producttitle?.BestProductTitle} banner={producttitle?.BestProductBanner} url={"/bestproducts"} />
      <ProductFilterClient
        products={products}
      />
      </>
    );
  } catch (error) {
    return <div className="text-red-500 text-center">Error: {String(error)}</div>;
  }
}
