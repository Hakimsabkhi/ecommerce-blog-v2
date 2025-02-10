import Banner from "@/components/client/Banner/Banner";

import BestProductCollection from "@/components/BestProductCollection";
import Brands from "@/components/Brands";
import MainProductCollection from "@/components/MainProductCollection";  
import ProductInPromotionCollection from "@/components/ProductInPromotionCollection";    
import Categories from "@/components/client/Categorys/Categories";
import Stores from "@/components/client/OurStores/Stores";

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
