import React from 'react';
import {  PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { OnApproveData } from '@paypal/paypal-js';
import { toast } from 'react-toastify';

interface PaypalButtonProps {
  amount: string;
  onSuccess: (details: any) => void;
}

const PaypalButton: React.FC<PaypalButtonProps> = ({ amount, onSuccess }) => {
  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '',
        currency: 'USD',
      }}
    >
      <PayPalButtons
        
        createOrder={async (data: any, actions: any) => {
          try {
            const response = await fetch('/api/paypal/create-order', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ amount }),
            });

            if (!response.ok) {
              throw new Error('Failed to create order');
            }

            const order = await response.json();
            return order.id; // Pass the order ID to PayPal
          } catch (error) {
            console.error('Error creating PayPal order:', error);
            return Promise.reject('Order creation failed');
          }
        }}
    
        onApprove={async (data, actions) => {
          try {
            const details = await actions.order?.capture();
            if (details) {
              onSuccess(details); // Trigger success logic
              
              toast.success('Payment successful!');
            }
          } catch (error) {
            console.error('Error capturing order:', error);
            toast.error('Payment failed. Please try again.');
          }
        }}
        onError={(err: any) => {
          console.error('PayPal Error:', err);
        }}
        forceReRender={[amount]} // Re-render when amount or address changes
         // Ensure loading spinner is hidden after PayPal button initialization
    
      />
    </PayPalScriptProvider>
  );
};

export default PaypalButton;
