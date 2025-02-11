import Banner from "@/components/client/homepage/Banner";

import BestProductCollection from "@/components/client/homepage/BestProductCollection";
import Brands from "@/components/client/homepage/Brands";
import MainProductCollection from "@/components/client/homepage/MainProductCollection";  
import ProductInPromotionCollection from "@/components/client/homepage/ProductInPromotionCollection";    
import Categories from "@/components/client/homepage/Categories";
import Stores from "@/components/client/homepage/Stores";

export default function HomePage() {
  return (
    <>
      <Banner />
      <Categories />
      <MainProductCollection />
      <Brands />
      <BestProductCollection />  
      <ProductInPromotionCollection />   
      <Stores/>
    </>
  );
}
