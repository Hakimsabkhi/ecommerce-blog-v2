import React from "react";
import ProductFilterClient from "@/components/Products/ProductPage/ProductFilterClient"; // <-- Our client component
import { getBestCollections, getCustomProductTitle } from "@/lib/StaticDataHomePage";
import CollectionBanner from "@/components/CollectionBanner";



export default async function ProductsPage() {
 
  try {
    const productstitledata= await getCustomProductTitle()
    const productsRe= await getBestCollections()
    
    const products = JSON.parse(productsRe)
    const producttitle = JSON.parse(productstitledata)
    return (
      <><CollectionBanner title={producttitle?.ProductCollectionTitle} banner={producttitle?.ProductCollectionBanner} url={"/bestcollection"} />
      <ProductFilterClient
        products={products} /></>
    );
  } catch (error) {
    return <div className="text-red-500 text-center">Error: {String(error)}</div>;
  }
}
