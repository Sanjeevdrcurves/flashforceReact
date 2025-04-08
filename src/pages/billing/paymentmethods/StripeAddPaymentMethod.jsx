import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Elements, CardElement, useStripe, useElements, PaymentElement  } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useSelector } from 'react-redux';
import "./StripeCheckoutForm.css"; // Import the CSS file for styling
// import { toast } from 'sonner';
import { ToastContainer, toast } from 'react-toastify';

const stripePromise = loadStripe(import.meta.env.VITE_FLASHFORCE_STRIPE_PUBLISH_KEY);

const AddPaymentMethod = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {userId, fullName, email, chargingAmount}=useSelector(state=>state.AuthReducerKey);
  const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
  const stripe = useStripe();
  const elements = useElements();

  const handleAddPaymentMethod = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;
    setLoading(true);
    const cardElement = elements.getElement(CardElement);
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: fullName,
        email: email,
      },
    });

    if (error) {
      setLoading(false);
      debugger;
      console.error(error);
      return;
    }

    // try {
    //   const response = await axios.post('/api/payment-method', {
    //     paymentMethodId: paymentMethod.id,
    //   });
    //   console.log('Payment method saved:', response.data);
    // } catch (error) {
    //   console.error('Error saving payment method:', error);
    // }

    try {
      const result = await addPaymentMethod(paymentMethod.id, userId);
      
      if(result.customerId){
        //await chargeCustomer(Math.round(chargingAmount * 100), result.customerId, paymentMethod.id);
        await chargeCustomer(Math.round(1 * 100), result.customerId, paymentMethod.id);
        navigate("/auth/welcome-message");
      }
      //await chargeCustomer(5000, customerId, paymentMethodId); // $50.00 charge
      console.log('API Response:', result);
      setLoading(false);
    } catch (error) {
      debugger;
      setLoading(false);
      console.error('Failed to add payment method.');
      console.error('Error charging customer:', error.response?.data || error.message);
      toast.error('Error charging customer:'+ error.response?.data.error || error.message);
    }
  };

  const addPaymentMethod = async (paymentMethodId, userId) => {
    try {
      const response = await axios.post(`${API_URL}/payment/stripe-add-payment-method`, {
        paymentMethodId,
        userId,
        fullName,
        email
      });
  
      console.log('Payment method added successfully:', response.data);
      return response.data; // Contains the attached PaymentMethodId
    } catch (error) {
      console.error('Error adding payment method:', error.response?.data || error.message);
      throw error;
    }
  };
  
  // Usage example:
  // const handleAddPaymentMethod = async () => {
  //   const paymentMethodId = 'pm_test_123'; // Replace with actual PaymentMethodId from Stripe.js
  //   const customerId = 'cus_test_456'; // Replace with actual CustomerId from your system
  //   try {
  //     const result = await addPaymentMethod(paymentMethodId, customerId);
  //     console.log('API Response:', result);
  //   } catch (error) {
  //     console.error('Failed to add payment method.');
  //   }
  // };

  const chargeCustomer = async (amount, customerId, paymentMethodId) => {
    try {
      const response = await axios.post(`${API_URL}/payment/stripe-charge`, {
        amount,
        customerId,
        paymentMethodId,
      });
  
      console.log('Charge successful:', response.data);
      return response.data; // Contains payment intent or success info
    } catch (error) {
      console.error('Error charging customer:', error.response?.data || error.message);
      throw error;
    }
  };
  
  // Usage example:
  const handleChargeCustomer = async () => {
    const amount = 5000; // Amount in cents (e.g., $50.00)
    const customerId = 'cus_test_456'; // Replace with actual CustomerId
    const paymentMethodId = 'pm_test_123'; // Replace with actual PaymentMethodId
    try {
      const result = await chargeCustomer(amount, customerId, paymentMethodId);
      console.log('API Response:', result);
    } catch (error) {
      console.error('Failed to charge customer.');
    }
  };

  return (
    // <form onSubmit={handleAddPaymentMethod}>
    //   <CardElement /> 
    //   {/* <PaymentElement  /> */}
    //   <button type="submit" disabled={!stripe}>Add Payment Method</button>
    // </form>

    <div className="stripe-checkout-container">
          <h2 className="stripe-checkout-title">Complete Your Payment</h2>
          <form className="stripe-checkout-form" onSubmit={handleAddPaymentMethod}>
            <label className="stripe-form-label">Card Details</label>
            <div className="stripe-card-input">
              {/* <PaymentElement />  */}
              {/* <CardElement  />  */}
              <CardElement options={{ hidePostalCode: true }} />
            </div>
            {/* <button className="submit-button" type="submit" disabled={!stripe}>
              Add Payment Method
            </button> */}
            <button className="stripe-submit-button" type="submit" disabled={!stripe || loading } >
              {/* Pay ${chargingAmount} */}
              {loading ? 'Please wait...' : 'Pay $'+chargingAmount}
            </button>
          </form>
          <ToastContainer position="top-right"
                          autoClose={3000}
                          theme="dark"/>
        </div>
  );
};

const StripeAddPaymentMethod = () => (
  // <Elements stripe={stripePromise} options={{ mode: 'payment', amount:2000, currency: 'usd' }}>
  //   <AddPaymentMethod />
  // </Elements>
  <Elements stripe={stripePromise} >
    <AddPaymentMethod />
  </Elements>
);

export default StripeAddPaymentMethod;