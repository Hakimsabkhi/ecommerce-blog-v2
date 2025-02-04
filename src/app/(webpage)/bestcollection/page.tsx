import React from "react";
import ProductFilterClient from "@/components/Products/ProductPage/ProductFilterClient"; // <-- Our client component
import { getBestCollectionData } from "@/lib/StaticDataHomePage";



export default async function ProductsPage() {
 
  try {

    const productsRe= await getBestCollectionData()
    
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
