import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import PaypalButton from '@/components/checkoutComp/PaypalButton';
import { clearCart } from '@/store/cartSlice';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  quantity: number;
}

interface PaymentSummaryProps {
  totalPrice: number;
  totalDiscount: number;
  deliveryCost: number;
  selectedMethod: string;
  items: CartItem[];
  currentStep: 'cart' | 'checkout' | 'order-summary';
  onCheckout: (price: number, discount: number, items: CartItem[]) => void;
  selectedPaymentMethod: string;
  backcarte: () => void;
  handleOrderSummary: (ref: string) => void;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  totalPrice,
  totalDiscount,
  deliveryCost,
  selectedMethod,
  items,
  currentStep,
  onCheckout,
  selectedPaymentMethod,
  backcarte,
  handleOrderSummary,
}) => {
  const dispatch = useDispatch();
  const [totalWithShipping, setTotalWithShipping] = useState(totalPrice + deliveryCost);

  useEffect(() => {
    setTotalWithShipping(totalPrice + deliveryCost);
  }, [totalPrice, deliveryCost]);

  // Send confirmation email
  const sendMail = async (ref: string) => {
    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref }),
      });

      if (!response.ok) throw new Error('Failed to send email');
    } catch (error) {
      console.error(error);
      toast.error('Failed to send confirmation email.');
    }
  };

  // Submit the order
  const handleOrderSubmit = async () => {
    const selectedAddress = document.querySelector<HTMLInputElement>('select[name="address-method"]')?.value;
    if (!selectedAddress || !selectedPaymentMethod) {
      toast.error('Please select an address and payment method');
      return;
    }

    const orderData = {
      address: selectedAddress,
      paymentMethod: selectedPaymentMethod,
      selectedMethod,
      deliveryCost,
      totalDiscount,
      totalWithShipping,
      items,
    };

    try {
      const response = await fetch('/api/order/postorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error('Order submission failed');
      const { ref } = await response.json();
      sendMail(ref);
      handleOrderSummary(ref);
      toast.success('Order submitted successfully!');
      dispatch(clearCart());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <div className="bg-gray-100 rounded-md p-4 w-[30%]">
      <div className="flex border border-[#15335E] rounded-md overflow-hidden">
        <input
          type="email"
          placeholder="Promo code"
          className="w-full px-4 py-2 text-sm text-gray-600 bg-white outline-none"
        />
        <button className="bg-primary text-white px-4 py-2 text-sm hover:bg-[#15335E]">Apply</button>
      </div>

      <ul className="text-gray-800 mt-8 space-y-4">
        <li className="flex justify-between text-base">
          Discount <span className="font-bold">{totalDiscount.toFixed(2)} TND</span>
        </li>
        <li className="flex justify-between text-base">
          Shipping <span className="font-bold">{deliveryCost.toFixed(2)} TND</span>
        </li>
        <li className="flex justify-between text-base font-bold">
          Total <span>{totalWithShipping.toFixed(2)} TND</span>
        </li>
      </ul>

      {/* Buttons based on current step */}
      <div className="mt-8 space-y-2">
        {currentStep === 'cart' && (
          <>
            <button
              onClick={() => onCheckout(totalWithShipping, totalDiscount, items)}
              className={`w-full py-2 px-4 text-sm font-semibold bg-primary text-white rounded-md hover:bg-[#15335E] ${
                items.length ? '' : 'opacity-50 cursor-not-allowed'
              }`}
              disabled={!items.length}
            >
              Checkout
            </button>
            <Link href="/">
              <button className="w-full py-2 mt-2 text-sm font-semibold border border-gray-300 rounded-md">
                Continue Shopping
              </button>
            </Link>
          </>
        )}

        {currentStep === 'checkout' && (
          <>
            {selectedPaymentMethod !== 'paypal' && (
              <button
                onClick={handleOrderSubmit}
                className="w-full py-2 px-4 text-sm font-semibold bg-primary text-white rounded-md hover:bg-[#15335E]"
              >
                Proceed to Payment
              </button>
            )}
            {selectedPaymentMethod === 'paypal' && (
              <PaypalButton amount={totalWithShipping.toFixed(2)} onSuccess={handleOrderSubmit} />
            )}
            <button
              onClick={backcarte}
              className="w-full py-2 mt-2 text-sm font-semibold bg-blue-500 text-white rounded-md hover:bg-[#15335E]"
            >
              Back
            </button>
            <Link href="/">
              <button className="w-full py-2 mt-2 text-sm font-semibold border border-gray-300 rounded-md hover:bg-gray-200">
                Cancel
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSummary;
