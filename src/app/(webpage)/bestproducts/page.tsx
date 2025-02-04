import React from "react";
import ProductFilterClient from "@/components/Products/ProductPage/ProductFilterClient"; // <-- Our client component
import { getBestproductData } from "@/lib/StaticDataHomePage";



export default async function ProductsPage() {
 
  try {

    const productsRe= await getBestproductData()
    
    const products = JSON.parse(productsRe)

    return (
      <ProductFilterClient
        products={products}
       
     
      />
    );
  } catch (error) {
    return <div className="text-red-500 text-center">Error: {String(error)}</div>;
  }
}
