"use client";
import Link from "next/link";
import React, { useState } from "react";

interface Product {
  _id: string;
  name: string;
  description: string;
  info: string;
  ref: string;
  tva?:number
  price: number;
  imageUrl?: string;
  images?: string[];
  stock: number;
  dimensions?: string;
  discount?: number;
  warranty?: number;
  weight?: number;
  color?: string;
  material?: string;
  status?: string;
}

interface ProductQProps {
  product: Product | null;
  addToCartHandler: (product: Product, quantity: number) => void;
}

const ProductQ: React.FC<ProductQProps> = ({ product, addToCartHandler }) => {
  const [quantity, setQuantity] = useState<number>(1);
  if (!product) {
    return null; // Ensure the component returns null if product is not available
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((prevQuantity) => prevQuantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(
      1,
      Math.min(product.stock, parseInt(event.target.value, 10) || 1)
    );
    setQuantity(value);
  };

  return (
    <>
      {product?.discount && product?.discount !== 0 ? (
        <div className="items-center max-xl:justify-center flex gap-4">
          <p className="text-primary text-2xl font-bold max-xl:justify-center flex">
            {product.price - product.price * (product.discount / 100)} TND
          </p>
          <span className="   text-xl font-bold">
            <p className="text-gray-300 line-through"> {product.price} TND</p>
          </span>
        </div>
      ) : (
        <p className="text-primary text-2xl font-bold max-xl:justify-center flex">
          {product?.price} TND
        </p>
      )}

      <hr className=" mt-5 mb-5"></hr>
      <div className="xl:flex xl:items-center  gap-3 ">
        {product.status != "out-of-stock" ? (
          product.stock > 0 ? (
            <div className="flex max-md:flex-col xl:flex-col justify-between gap-5">
              <div className=" items-center md:max-xl:w-2/5 ">
                <div className="flex items-center max-md:justify-center space-x-2">
                  <p>Quantity:&nbsp;</p>
                  <button
                    onClick={decreaseQuantity}
                    className="p-2 border text-xl text-gray-700"
                    disabled={quantity === 1}
                  >
                    -
                  </button>
                  <input
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={product.stock}
                    className="p-2 border text-xl text-center w-[20%] "
                  />
                  <button
                    onClick={increaseQuantity}
                    className="p-2 border text-xl text-gray-700"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                {/* Assuming you want to show the quantity here */}
              </div>
              <div className="flex gap-4 md:max-xl:w-2/5">
                <button
                  onClick={() => addToCartHandler(product, quantity)}
                  className="text-white bg-primary hover:bg-[#15335D] h-10 w-[60%]  font-bold rounded-md"
                >
                  <p>Add to cart </p>
                </button>
                <Link
                  href={"/checkout"}
                  className="text-white bg-black h-10 w-[60%]  font-bold text-center rounded-md"
                >
                  <button
                    onClick={() => addToCartHandler(product, quantity)}
                    className="text-white bg-black h-10 w-[60%] font-bold rounded-md"
                  >
                    <p>Buy now</p>
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <button
              className="text-white bg-gray-500 h-10 w-[60%] font-bold rounded-md"
              disabled
            >
              <p>Out of stock</p>
            </button>
          )
        ) : (
          <button
            className="text-white bg-gray-500 h-10 w-[60%] font-bold rounded-md"
            disabled
          >
            <p>Out of stock</p>
          </button>
        )}
      </div>
    </>
  );
};

export default ProductQ;
