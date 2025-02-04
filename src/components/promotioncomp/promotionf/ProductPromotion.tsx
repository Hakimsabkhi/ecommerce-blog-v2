"use client";
import React, { useEffect, useState } from "react";
import ProductList from "@/components/Products/ProductPage/ProductList";
import FilterProducts from "@/components/Products/ProductPage/FilterProducts"; // Import the new FilterProducts component
import OrderPrice from "@/components/Products/ProductPage/OrderPrice";



interface ProductData {
  _id: string;
  name: string;
  description: string;
  ref: string;
  tva?:number;
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
  boutique: { _id: string; nom: string };
}

interface Category {
  name: string;
  slug: string;
}

interface Brand {
  _id: string;
  name: string;
}


const ProductPromotion: React.FC = () => {


  const [products, setProducts] = useState<ProductData[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const res = await fetch(`/api/promotion/getproductpromotion`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
          },
          next: { revalidate: 0 }, // Disable caching
        });

        if (!res.ok) {
          throw new Error('Products not found');
        }

        const data: ProductData[] = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products data:', error);
      }
    };

    const fetchBrandData = async () => {
      try {
        const res = await fetch(`/api/brand/getAllBrand`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
          },
          next: { revalidate: 0 }, // Disable caching
        });

        if (!res.ok) {
          throw new Error('Brand not found');
        }

        const data: Brand[] = await res.json();
        setBrands(data);
      } catch (error) {
        console.error('Error fetching brand data:', error);
      }
    };

    fetchProductsData();
    fetchBrandData();
  }, []);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Added sorting state
 const [selectedBoutique, setSelectedBoutique] = useState<string | null>(null);
  // Helper function to get unique values
  const getUniqueValues = (array: (string | undefined)[]) => {
    return Array.from(new Set(array.filter(item => item !== undefined))).filter((item): item is string => !!item);
  };
  const boutique = Array.from(
    new Map(
      products
        .map((product) => product?.boutique)
        .filter(Boolean)
        .map((boutique) => [boutique._id, boutique]) // Map the brand by _id
    ).values()
  );
  // Get unique colors and materials from products
  const uniqueColors = getUniqueValues(products.map(product => product.color));
  const uniqueMaterials = getUniqueValues(products.map(product => product.material));

  // Filter products based on the selected filters
  const filteredProducts = products.filter(product => {
    
    const brandMatch = selectedBrand ? product?.brand?._id === selectedBrand : true;
    const boutiqueMatch = selectedBoutique
        ? product?.boutique?._id === selectedBoutique
        : true;
    const colorMatch = selectedColor ? product.color === selectedColor : true;
    const materialMatch = selectedMaterial ? product.material === selectedMaterial : true;

    // Calculate effective price considering discount
    const effectivePrice = product.discount
      ? (product.price * (100 - product.discount)) / 100
      : product.price;

    const priceMatch =
      (minPrice !== null ? effectivePrice >= minPrice : true) &&
      (maxPrice !== null ? effectivePrice <= maxPrice : true);

    return brandMatch && boutiqueMatch && colorMatch && materialMatch && priceMatch;
  });

  // Sort the filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discount ? (a.price * (100 - a.discount)) / 100 : a.price;
    const priceB = b.discount ? (b.price * (100 - b.discount)) / 100 : b.price;

    return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
  });

  return (
    <div className="py-8  desktop max-2xl:w-[95%] gap-8 max-md:items-center xl:flex xl:flex-cols-2 ">
      {/* Filter */}
        
      <div className="xl:w-1/6 sm:w-5/6 mx-auto  border-2 p-2 rounded-lg shadow-md ">
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
          selectedBoutique={selectedBoutique} 
          setSelectedBoutique={setSelectedBoutique } 
          boutique={boutique}        
        />
      </div>

 
      {/* Products */}
      <div className="xl:w-5/6">
        <OrderPrice  setSortOrder={setSortOrder} sortOrder={sortOrder} />
        <ProductList products={sortedProducts} />
      </div>
    </div>
  );
};

export default ProductPromotion;