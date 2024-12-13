// ProductPage/ProductList.tsx
import React from "react";
import ProductCard from "./ProductCard";


interface ProductData {
  _id: string;
  name: string;
  description: string;
  ref: string;
  tva?:number;
  price: number;
  imageUrl?: string;
  brand?: Brand;
  stock: number;
  discount?: number;
  color?: string;
  material?: string;
  status?: string;
  category:Category;
  slug:string;
}
interface Category {
  name: string;
  slug:string;
}
interface Brand {
  _id: string;
  name: string;
}

interface ProductListProps {
  products: ProductData[];
 

}

const ProductList: React.FC<ProductListProps> = ({ products   }) => {
  return (
    <div>
    
    
        <div className="grid group grid-cols-3 max-md:grid-cols-1 max-lg:grid-cols-2 max-md:gap-3 gap-8">
          {products.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </div>
     
       
     
    </div>
  );
};

export default ProductList;
