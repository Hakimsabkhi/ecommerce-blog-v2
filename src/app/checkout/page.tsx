"use client";
import OrderSummary from '@/components/checkoutComp/OrderSummary';
import CheckoutNav from '@/components/checkoutComp/CheckoutNav';
import RecapProduct from '@/components/checkoutComp/RecapProduct'; // Ensure you have this component imported
import PaymentSummary from '@/components/checkoutComp/PaymentSummary';
import PaymentMethode from '@/components/checkoutComp/PaymentMethode';
import Addresse from '@/components/checkoutComp/addresse';

import { CartItem, removeItem, updateItemQuantity } from '@/store/cartSlice';
import { RootState } from '@/store';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DeliveryMethod from '@/components/checkoutComp/DeliveryMethod';

const Checkout = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  // Step state to control the view of the process
  const [currentStep, setCurrentStep] = useState<'cart' | 'checkout' | 'order-summary'>('cart');
  const [refOrder, setRefOrder] = useState('');
  
  // State for managing checkout data
  const [checkoutData, setCheckoutData] = useState({
    totalPrice: 0,
    totalDiscount: 0,
    items: [] as CartItem[],
  });

  // Function to handle checkout
  const handleCheckout = (price: number, discount: number, items: CartItem[]) => {
    setCheckoutData({ totalPrice: price, totalDiscount: discount, items });
    setCurrentStep('checkout');
  };

  // Function to handle order summary
  const handleOrderSummary = async (ref: string) => {
    setRefOrder(ref);

    setCurrentStep('order-summary');
  };

  // Go back to cart step
  const handleCart = () => {
    setCurrentStep('cart');
  };

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Payment on delivery');
  
  const [selectedMethod, setSelectedMethod] = useState<string>("fedex");
  const [deliveryCost, setDeliveryCost] = useState<number>(0);
  // Handle change of payment method
  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPaymentMethod(e.target.value);
  };
  const handleMethodChange = (method: string, cost: number) => {
    setSelectedMethod(method);
    setDeliveryCost(cost);
  };

  // Increment item quantity
  const incrementHandler = (item: CartItem) => {
    if (item.quantity < item.stock) {
      dispatch(updateItemQuantity({ _id: item._id, quantity: item.quantity + 1 }));
    }
  };

  // Decrement item quantity
  const decrementHandler = (item: CartItem) => {
    if (item.quantity > 1) {
      dispatch(updateItemQuantity({ _id: item._id, quantity: item.quantity - 1 }));
    }
  };

  // Calculate totals
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => {
    const finalPrice = item.discount ? item.price - (item.price * item.discount) / 100 : item.price;
    return total + finalPrice * item.quantity;
  }, 0);
  
  const totalDiscount = items.reduce((total, item) => {
    const originalPrice = item.price * item.quantity;
    const discountedPrice = item.discount
      ? item.price - (item.price * item.discount) / 100
      : item.price;
    const discountAmount = originalPrice - discountedPrice * item.quantity;
    return total + discountAmount;
  }, 0);



  // Remove item from cart
  const removeCartHandler = (_id: string) => {
    dispatch(removeItem({ _id }));
  };

  return (
    <div>
      <CheckoutNav currentStep={currentStep} />
      {currentStep === 'cart' && (
       < div className="mx-auto max-w-screen-2xl px-4 2xl:px-0 ">
        <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
        <div className="min-w-0 flex-1 space-y-8  bg-gray-100 p-4 rounded-md mb-4 ">
        
          <RecapProduct
            items={items}
            incrementHandler={incrementHandler}
            decrementHandler={decrementHandler}
            removeCartHandler={removeCartHandler}
          />
        </div>
          <PaymentSummary
              currentStep={currentStep}
              items={items}
              totalPrice={totalPrice}
              totalDiscount={totalDiscount}
              onCheckout={handleCheckout}
              selectedPaymentMethod={selectedPaymentMethod}

              backcarte={handleCart} handleOrderSummary={function (ref: string): void {
                throw new Error('Function not implemented.');
              } } selectedMethod={selectedMethod} deliveryCost={deliveryCost}          />
          
           
          </div>
          </div>
          
      )}
      {currentStep === 'checkout' && (
        <div className="mx-auto max-w-screen-2xl px-4 2xl:px-0">
          <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
            <div className="min-w-0 flex-1 space-y-8 mb-4 ">
              <Addresse />
              <DeliveryMethod selectedMethod={selectedMethod}
                onMethodChange={handleMethodChange}/>
              <PaymentMethode
                handlePaymentMethodChange={handlePaymentMethodChange}
                selectedPaymentMethod={selectedPaymentMethod}
              />
            
            </div>
            <PaymentSummary
              handleOrderSummary={handleOrderSummary}
              items={items}
              totalPrice={totalPrice}
              totalDiscount={totalDiscount}
              currentStep={currentStep}
              onCheckout={handleCheckout}
              selectedPaymentMethod={selectedPaymentMethod}
              backcarte={handleCart}
              selectedMethod={selectedMethod}
              deliveryCost={deliveryCost}
            />
          </div>
        </div>
      )}
      {currentStep === 'order-summary' && (
        <OrderSummary data={refOrder} />
      )}
    </div>
  );
};

export default Checkout;
