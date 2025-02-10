import Banner from "@/components/Banner";

import BestProductCollection from "@/components/BestProductCollection";
import Brands from "@/components/Brands";
import MainProductCollection from "@/components/MainProductCollection";  
import ProductInPromotionCollection from "@/components/ProductInPromotionCollection";    
import Categories from "@/components/Categorys/Categories";
import Boutique from "@/components/Boutique";

export default function HomePage() {
  return (
    <>
      <Banner />
      <Categories />
      <MainProductCollection />
      <Brands />
      <BestProductCollection />  
      <ProductInPromotionCollection />   
      <Boutique/>
    </>
  );
}
