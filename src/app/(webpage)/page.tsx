import Banner from "@/components/Banner";

import Sellers from "@/components/Sellers";
import Brands from "@/components/Brands";
import Collection from "@/components/Collection";    {/*  not fixed */}
import Furniture from "@/components/Furniture";       {/*  not fixed */}
import Categories from "@/components/Categorys/Categories";

export default function HomePage() {
  return (
    <>
      <Banner />
      <Categories />
      <Sellers />
      <Brands />
      <Collection />  {/*  not fixed */}
      <Furniture />   {/*  not fixed */}
    </>
  );
}
