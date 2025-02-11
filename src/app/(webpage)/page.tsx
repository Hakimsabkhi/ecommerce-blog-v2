import Banner from "@/components/Client/homepage/Banner";

import BestProductCollection from "@/components/Client/homepage/BestProductCollection";
import Brands from "@/components/Client/homepage/Brands";
import MainProductCollection from "@/components/Client/homepage/MainProductCollection";  
import ProductInPromotionCollection from "@/components/Client/homepage/ProductInPromotionCollection";    
import Categories from "@/components/Client/homepage/Categories";
import Stores from "@/components/Client/homepage/Stores";

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
