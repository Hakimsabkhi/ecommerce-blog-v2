"use client"
import Pagination from '@/components/Pagination';
import useIs2xl from '@/hooks/useIs2x';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa6';
type Product = {
    _id: string;
    name: string;
    
    ref: string;
  
    imageUrl: string;
   
    user: {_id:string}; // Reference to a User document or User ID
    nbreview:number;
    createdAt: Date;
    updatedAt: Date;
};

const Page = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const is2xl = useIs2xl();
    const productsPerPage =is2xl ? 8 : 5;
    const fetchProducts = async () => {
            try {
                const response = await fetch('/api/review/admin/getAllProductReview', {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProducts(data); // Assuming data is an array of products
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
    useEffect(() => {
        setFilteredProducts(products);
        setCurrentPage(1);
        setLoading(false);
      }, [products]);
    
      useEffect(() => {
        const filtered = products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.ref.toLowerCase().includes(searchTerm.toLowerCase())
          // product.user.toLowerCase().includes(searchTerm.toLowerCase())
          
        );
        setFilteredProducts(filtered);
        setCurrentPage(1);
      
      }, [searchTerm, products]);
    
      const indexOfLastProduct = currentPage * productsPerPage;
      const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
      const currentProducts = filteredProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
      );
      const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    
    
      
    
    
    
    useEffect(() => {
        
        setLoading(true);
        fetchProducts();
    }, []);

    return (
        <div className="mx-auto w-[90%] py-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold "> Product Reviews</p>
      </div>
      <div className="w-full">
        <input
          type="text"
          placeholder="Search products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-4 p-2 border border-gray-300 rounded"
        />
      </div>
      <div className='max-2xl:h-80 h-[50vh] pt-1'>
      <table className="w-full rounded overflow-hidden table-fixed">
        <thead>
          <tr className="bg-gray-800 ">
            <th className="px-4 py-3">REF</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Number Review</th>
            <th className="px-4 py-3 ">ImageURL</th>
            <th className="px-4 py-3">
              Action
            </th>
          </tr>
        </thead>
        {loading ? (
            <tbody>
              <tr>
                <td colSpan={5}>
                  <div className="flex justify-center items-center h-full w-full py-6">
                    <FaSpinner className="animate-spin text-[30px]" />
                  </div>
                </td>
              </tr>
            </tbody>
          ) : filteredProducts.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={5}>
                  <div className="text-center py-6 text-gray-600 w-full">
                    <p>Aucun review trouvée.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
        <tbody>
          {currentProducts.map((item) => (
            <tr key={item._id} className="bg-white text-balck">
              <td className="border px-4 py-2 text-center">{item.ref}</td>
              <td className="border px-4 py-2 text-center">{item.name}</td>
              <td className="border px-4 py-2 text-center">{item.nbreview}</td>
              <td className="border px-4 py-2  text-center">
                <Image
                  alt={item.name}
                  src={item.imageUrl}
                  height={60}
                  width={60}
                   className="mx-auto"
                />
              </td>
              <td className="border px-4 py-2 flex justify-center items-center">
                <Link href={`/admin/review/${item._id}`}>
                  <button className="bg-gray-800 hover:bg-gray-600 text-white  w-28 h-10 rounded-md uppercase">
                    Reviews 
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody> )}
      </table></div>
      <div className="flex justify-center mt-4">
       
      <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalPages)}
          onPageChange={setCurrentPage}/>
      </div>
    </div>
            
      
    )
}

export default Page;
