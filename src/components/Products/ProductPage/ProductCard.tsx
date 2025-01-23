// components/ProductCard.tsx
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaRegHeart, FaHeart, FaCartShopping, FaStar, FaRegStar } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { addItem } from "@/store/cartSlice";
import { addToWishlist } from "@/store/wishlistSlice";
import { FaStarHalfAlt } from "react-icons/fa";

interface Brand {
  _id: string;
  name: string;
}
interface Review {
  _id: string;
  name: string;
  email: string;
  text: string;
  reply: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}
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
  category: Category;
  slug: string;
}
interface Category {
  name: string;
  slug: string;
}

interface ProductCardProps {
  item: ProductData;
}
const fetchReviews = async (productId: string) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  const response = await fetch(
    `/api/review/getAllReviewByProduct?id=${productId}`
  );
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data; // Ensure you return the fetched data
};

const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  useEffect(() => {
    const loadReviews = async () => {

        const data = await fetchReviews(item._id);
        setReviews(data);
      } 
  
  
    loadReviews();
  }, [item._id]);
  
  const countRatings = (reviews: Review[]): Record<number, number> => {
    const counts: Record<number, number> = {};
  
    reviews.forEach((review) => {
      counts[review.rating] = (counts[review.rating] || 0) + 1;
    });
  
    return counts;
  };
  
  const ratingCounts = countRatings(reviews);
  const ratingCounts1 = ratingCounts[1] || 0;
  const ratingCounts2 = ratingCounts[2] || 0;
  const ratingCounts3 = ratingCounts[3] || 0;
  const ratingCounts4 = ratingCounts[4] || 0;
  const ratingCounts5 = ratingCounts[5] || 0;
  
  const numberOfReviews = reviews.length;
  const reatingstatictotal=((ratingCounts1*1)+(ratingCounts2*2)+(ratingCounts3*3)+(ratingCounts4*4)+(ratingCounts5*5))/numberOfReviews;
  const handleClick = async (product: ProductData) => {
  
    dispatch(addToWishlist(product));
  
   
};
  const dispatch = useDispatch();
  const addToCartHandler = (product: ProductData, quantity: number) => {
    dispatch(addItem({ item: product, quantity }));
   
  };

  return (
    <div className="flex gap-2 h-fit flex-col duration-500 lg:group-hover:scale-[0.85] lg:hover:!scale-100 max-md:h-fit relative
                   ">
      <Link href={`/${item.category?.slug}/${item.slug}`}>
        <Image
          className=" w-full h-auto mx-auto top-5"
          src={item.imageUrl || ""}
          alt={item.name}
          height={300}
          width={300}
        />
      </Link>
      <div className="flex-col flex bottom-0 gap-2 pl-2 pr-2 w-full">
        <Link href={`/${item.category?.slug}/${item.slug}`}>
          <div className=" flex justify-between h-24 max-md:h-20">
            <div className="flex-col gap-1" >
              <p className="text-productNameCard cursor-pointer text-2xl max-md:text-lg font-bold first-letter:uppercase">
              {item.name}
            </p>
            <div className="flex gap-2 items-center text-secondary mt-2">
            {Array.from({ length: 5 }, (_, index) => {
                    const starValue = index + 1;
                    if (starValue <= reatingstatictotal) {
                        return <FaStar key={index} />;  // Full star
                    } else if (starValue - 0.5 <= reatingstatictotal) {
                        return <FaStarHalfAlt key={index} />;  // Half star
                    } else {
                        return <FaRegStar key={index} />;  // Empty star
                    }
                })}
          
        </div>
             </div>
            <div className="flex-col gap-1">
              {item.discount && item.discount !== 0 ? (
                <div className="flex-col flex gap-1">
                  <p className="text-2xl max-md:text-lg font-bold rounded-lg text-primary">
                    {item.price - item.price * (item.discount / 100)} TND
                  </p>
                  <span className="text-primary line-through text-xl max-md:text-sm font-bold">
                    <p className="text-gray-300">{item.price} TND</p>
                  </span>
                </div>
              ) : (
                <p className="text-primary text-2xl max-md:text-lg font-bold">
                  {item.price} TND
                </p>
              )}
            </div>
          </div>
        </Link>

        <div className="flex text-lg max-md:text-sm justify-between">
          {item.status !== "out-of-stock" ? (
            item.stock > 0 ? (
              <button
                onClick={() => addToCartHandler(item, 1)}
                className="AddtoCart bg-primary hover:bg-[#15335D] text-white w-[50%] max-lg:w-[60%] max-md:rounded-[3px] group/box"
              >
                <p className="absolute flex items-center justify-center w-full h-full transition-all duration-300 transform lg:group-hover/box:translate-x-[10%] ease max-md:text-xs">
                  Add to cart
                </p>
                <p className="text-white absolute flex items-center justify-center w-full h-full duration-300 -translate-x-[100%] lg:group-hover/box:translate-x-[-30%] ease">
                  <FaCartShopping
                    className="w-6 h-6"
                    aria-hidden="true"
                    fill="currentColor"
                  />
                </p>
              </button>
            ) : (
              <button
                className="AddtoCart bg-gray-400 hover:bg-gray-500 text-white w-[50%] max-lg:w-[60%] max-md:rounded-[3px] max-2xl:text-sm group/box"
                disabled
              >
                <p className="absolute flex items-center justify-center w-full h-full transition-all duration-300 transform lg:group-hover/box:translate-x-[10%] ease max-md:text-xs">
                  Out of stock
                </p>
              </button>
            )
          ) : (
            <button
              className="AddtoCart bg-gray-400 hover:bg-gray-500 text-white max-lg:w-[60%] w-[50%]  max-md:rounded-[3px] max-2xl:text-sm group/box"
              disabled
            >
              <p className="absolute flex items-center justify-center w-full h-full transition-all duration-300 ease max-md:text-xs">
                Out of stock
              </p>
            </button>
          )}

          <a href={`/${item.category?.slug}/${item.slug}`} className="w-[25%] max-lg:w-[30%]">
            <button className="AddtoCart bg-white max-md:rounded-[3px] w-full group/box text-primary border border-primary">
              <p className="absolute flex items-center justify-center w-full h-full transition-all duration-300 transform lg:group-hover/box:translate-y-[-100%] ease max-md:text-xs">
                View
              </p>
              <p className="text-primary absolute w-full h-full flex items-center justify-center duration-300 -translate-y-[-100%] lg:group-hover/box:translate-y-0 ease">
                <FaEye
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                />
              </p>
            </button>
          </a>
          <button
            onClick={()=>handleClick(item)}
            className="relative bg-white hover:bg-primary max-md:rounded-[3px] AddtoCart w-[15%] group/box text-primary hover:text-white border border-primary max-lg:hidden"
            aria-label="wishlist"
          >
            <p className="absolute flex items-center justify-center w-full h-full">
              <FaRegHeart
                className="w-5 h-5 max-2xl:w-3 max-2xl:h-3"
                aria-hidden="true"
                fill="currentColor"
              />
            </p>
            <p
              className="absolute flex items-center justify-center w-full h-full group-hover/box:opacity-100"
            >
              <FaHeart
                className="w-5 h-5 max-2xl:w-3 max-2xl:h-3"
                aria-hidden="true"
                fill="currentColor"
              />
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
