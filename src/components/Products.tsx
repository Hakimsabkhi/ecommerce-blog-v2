"use client";

import React, { useEffect, useState } from "react";
import ProductList from "./Products/ProductPage/ProductList";
import FilterProducts from "./Products/ProductPage/FilterProducts";
import OrderPrice from "./Products/ProductPage/OrderPrice";

interface ProductData {
  _id: string;
  name: string;
  description: string;
  ref: string;
  tva: number;
  price: number;
  imageUrl?: string;
  brand: Brand;
  stock: number;
  discount?: number;
  color?: string;
  material?: string;
  status?: string;
  category: Category;
  slug: string;
}

interface Category {
  name: string;
  slug: string;
}

interface Brand {
  _id: string;
  name: string;
}

interface ProductsProps {
  params: {
    slugCategory?: string;
  };
}

const Products: React.FC<ProductsProps> = ({ params }) => {
  const { slugCategory: id } = params;

  const [products, setProducts] = useState<ProductData[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Fetch Products and Brands Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, brandsRes] = await Promise.all([
          fetch(`/api/search/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            next: { revalidate: 0 },
          }),
          fetch(`/api/brand/getAllBrand`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            next: { revalidate: 0 },
          }),
        ]);
  
        if (!productsRes.ok) throw new Error("Failed to fetch products.");
        if (!brandsRes.ok) throw new Error("Failed to fetch brands.");
  
        const productsData = await productsRes.json();
        const brandsData = await brandsRes.json();
  
        if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else {
          throw new Error("Unexpected products.");
        }
  
        if (Array.isArray(brandsData)) {
          setBrands(brandsData);
        } else {
          throw new Error("Unexpected brands data format.");
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [id]);
  

  // Helper Function to Get Unique Values
  const getUniqueValues = (array: (string | undefined)[]): string[] => {
    return Array.from(new Set(array.filter((item): item is string => item !== undefined)));
  };

  // Unique Colors and Materials
  const uniqueColors = getUniqueValues(products.map((product) => product.color));
  const uniqueMaterials = getUniqueValues(products.map((product) => product.material));

  // Filtered Products
  const filteredProducts = products.filter((product) => {
    const brandMatch = selectedBrand ? product.brand._id === selectedBrand : true;
    const colorMatch = selectedColor ? product.color === selectedColor : true;
    const materialMatch = selectedMaterial ? product.material === selectedMaterial : true;

    const effectivePrice = product.discount
      ? (product.price * (100 - product.discount)) / 100
      : product.price;

    const priceMatch =
      (minPrice !== null ? effectivePrice >= minPrice : true) &&
      (maxPrice !== null ? effectivePrice <= maxPrice : true);

    return brandMatch && colorMatch && materialMatch && priceMatch;
  });

  // Sorted Products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discount ? (a.price * (100 - a.discount)) / 100 : a.price;
    const priceB = b.discount ? (b.price * (100 - b.discount)) / 100 : b.price;
    return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
  });

  // UI: Loading State
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  // UI: Error State
  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  // UI: Main Render
  return (
    <div className="py-8 desktop max-2xl:w-[95%] gap-8 max-md:items-center xl:flex xl:flex-cols-2">
      {/* Filters */}
      {products.length > 0 && (
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
      )}

      {/* Products List */}
      {products.length > 0 ? (
        <div className="xl:w-5/6">
          <OrderPrice setSortOrder={setSortOrder} sortOrder={sortOrder} />
          <ProductList products={sortedProducts} />
        </div>
      ) : (
        <div className="text-gray-500 text-center">No Products Found</div>
      )}
    </div>
  );
};

export default Products;
