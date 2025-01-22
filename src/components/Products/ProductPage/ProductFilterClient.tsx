"use client";

import React, { useState, useMemo } from "react";
import FilterProducts from "@/components/Products/ProductPage/FilterProducts";
import OrderPrice from "@/components/Products/ProductPage/OrderPrice";
import ProductList from "@/components/Products/ProductPage/ProductList";

interface ProductData {
  _id: string;
  name: string;
  description: string;
  ref: string;
  tva: number;
  price: number;
  imageUrl?: string;
  brand: { _id: string; name: string };
  stock: number;
  discount?: number;
  color?: string;
  material?: string;
  status?: string;
  category: { name: string; slug: string };
  slug: string;
}



interface ProductFilterClientProps {
  products: ProductData[];
 
  slugCategory?: string;
}

const ProductFilterClient: React.FC<ProductFilterClientProps> = ({
  products,
}) => {
  // ----- Client state and filtering logic -----
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const uniqueColors = useMemo(() => {
    return Array.from(
      new Set(products.map((p) => p.color).filter((c): c is string => !!c))
    );
  }, [products]);

  const uniqueMaterials = useMemo(() => {
  return Array.from(
    new Set(products.map((p) => p.material).filter((m): m is string => !!m))
  );
}, [products]);
const brands = Array.from(
  new Map(
    products
      .map((product) => product?.brand)
      .filter(Boolean)
      .map((brand) => [brand._id, brand]) // Map the brand by _id
  ).values()
);


  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      console.log(product)
      const brandMatch = selectedBrand
        ? product?.brand?._id === selectedBrand
        : true;
      const colorMatch = selectedColor ? product.color === selectedColor : true;
      const materialMatch = selectedMaterial
        ? product.material === selectedMaterial
        : true;

      const effectivePrice = product.discount
        ? (product.price * (100 - product.discount)) / 100
        : product.price;

      const priceMatch =
        (minPrice !== null ? effectivePrice >= minPrice : true) &&
        (maxPrice !== null ? effectivePrice <= maxPrice : true);

      return brandMatch && colorMatch && materialMatch && priceMatch;
    });
  }, [products, selectedBrand, selectedColor, selectedMaterial, minPrice, maxPrice]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const priceA = a.discount ? (a.price * (100 - a.discount)) / 100 : a.price;
      const priceB = b.discount ? (b.price * (100 - b.discount)) / 100 : b.price;
      return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
    });
  }, [filteredProducts, sortOrder]);


  if (!products || products.length === 0) {
    return <div className="text-gray-500 text-center">No Products Found</div>;
  }

  return (
    <div className="py-8 desktop max-2xl:w-[95%] gap-8 max-md:items-center xl:flex xl:flex-cols-2">
      {/* Filters */}
      <div className="xl:w-1/6 sm:w-5/6 mx-auto border-2 p-2 rounded-lg shadow-md">
        <FilterProducts
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedMaterial={selectedMaterial}
          setSelectedMaterial={setSelectedMaterial}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          brands={brands}
          uniqueColors={uniqueColors}
          uniqueMaterials={uniqueMaterials}
        />
      </div>

      {/* Products List */}
      <div className="xl:w-5/6">
        <OrderPrice setSortOrder={setSortOrder} sortOrder={sortOrder} />
        <ProductList products={sortedProducts} />
      </div>
    </div>
  );
};

export default ProductFilterClient;
