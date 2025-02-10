import React from 'react';
import { getproductpromotionData } from '@/lib/StaticCatgoryproduct';
import ProductFilterClient from '@/components/Products/ProductPage/ProductFilterClient';
import { getCustomProductTitle } from '@/lib/StaticDataHomePage';
import CollectionBanner from '@/components/CollectionBanner';







export default async function promotionPage() {
 
  try {
    const productstitledata= await getCustomProductTitle()
    const productsRe= await getproductpromotionData()
    
    const products = JSON.parse(productsRe)
    const producttitle = JSON.parse(productstitledata)
    return (
      <><CollectionBanner title={producttitle?.ProductPromotionTitle} banner={producttitle?.ProductPromotionBanner} url={"/bestcollection"} />
      <ProductFilterClient
        products={products} /></>
    );
  } catch (error) {
    return <div className="text-red-500 text-center">Error: {String(error)}</div>;
  }
}

