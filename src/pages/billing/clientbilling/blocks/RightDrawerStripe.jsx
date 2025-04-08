import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Elements, CardElement, useStripe, useElements, PaymentElement  } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useSelector } from 'react-redux';
import "./StripeCheckoutForm.css"; // Import the CSS file for styling
import { toast } from 'sonner';
import './RightDrawer.css'; // Ensure your CSS is properly linked

const stripePromise = loadStripe(import.meta.env.VITE_FLASHFORCE_STRIPE_PUBLISH_KEY);

const AddPaymentMethod = ({closeDrawer, onItemSaved}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {userId, fullName, email}=useSelector(state=>state.AuthReducerKey);
  const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
  const stripe = useStripe();
  const elements = useElements();
  //const [clientSecret, setClientSecret] = useState("");
  //const [customerId, setCustomerId] = useState("");

  // const handleAddPaymentMethod = async (e) => {
  //   e.preventDefault();
    
  //   if (!stripe || !elements) return;
  //   setLoading(true);
  //   const cardElement = elements.getElement(CardElement);
  //   const { paymentMethod, error } = await stripe.createPaymentMethod({
  //     type: 'card',
  //     card: cardElement,
  //     billing_details: {
  //       name: fullName,
  //       email: email,
  //     },
  //   });

  //   if (error) {
  //     setLoading(false);
  //     debugger;
  //     console.error(error);
  //     return;
  //   }

  //   try {
  //     const result = await addPaymentMethod(paymentMethod.id, userId);
      
  //     if(result.customerId){
  //       //await chargeCustomer(Math.round(chargingAmount * 100), result.customerId, paymentMethod.id);
  //       await chargeCustomer(Math.round(1 * 100), result.customerId, paymentMethod.id);
  //       navigate("/auth/welcome-message");
  //     }
  //     //await chargeCustomer(5000, customerId, paymentMethodId); // $50.00 charge
  //     console.log('API Response:', result);
  //     setLoading(false);
  //   } catch (error) {
  //     debugger;
  //     setLoading(false);
  //     console.error('Failed to add payment method.');
  //     console.error('Error charging customer:', error.response?.data || error.message);
  //     toast.error('Error charging customer:'+ error.response?.data.error || error.message);
  //   }
  // };

  const handleAddPaymentMethod = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;
    setLoading(true);

    
    try {
      const result = await FutureStripeCreateSetupIntent(userId);
      debugger;
      //setClientSecret(result.clientSecret);
      //setCustomerId(result.customerId);

      const resultCS = await stripe.confirmCardSetup(result.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });
      debugger;
      if (resultCS.error) {
        console.error('Failed to setup card', resultCS.error.message);
        toast.error('Failed to setup card. Invalid card number.');
        setLoading(false);
      } else {
        // Send customerId & paymentMethodId to backend for future use
        const resultPM = await FutureStripeSavePaymentMethod(result.customerId, resultCS.setupIntent.payment_method);
        debugger;
        if(resultPM.success){
          //console.log('FutureStripeSavePaymentMethod Response:', resultPM);
          
          
          toast.success(resultPM.message);
          onItemSaved();
          setTimeout(function(){ 
            setLoading(false);
            closeDrawer(); 
          }, 2000);
        }
        else{
          toast.warning(resultPM.message);
          setTimeout(function(){ 
            setLoading(false);
            closeDrawer(); 
          }, 2000);
        }
      }
    } catch (error) {
      debugger;
      setLoading(false);
      console.error('Failed to add payment method:', error);
      toast.error('Failed to add payment method. Invalid card number.');
    }
  };

  const FutureStripeCreateSetupIntent = async (userId) => {
    try {
      const response = await axios.post(`${API_URL}/payment/FutureStripeCreateSetupIntent`, {
        userId,
        fullName,
        email
      });
  
      console.log('Setup Intent successful:', response.data);
      return response.data; // Contains the attached PaymentMethodId
    } catch (error) {
      console.error('Setup Intent error:', error.response?.data || error.message);
      throw error;
    }
  };
  const FutureStripeSavePaymentMethod = async (customerId, payment_method) => {
    try {
      const response = await axios.post(`${API_URL}/payment/FutureStripeSavePaymentMethod`, {
        customerId: customerId,
        paymentMethodId: payment_method, //result.setupIntent.payment_method,
        userId,
        fullName
      });
  
      console.log('Payment Method Added Successfully:', response.data);
      return response.data; // Contains the attached PaymentMethodId
    } catch (error) {
      console.error('Payment Method error:', error.response?.data || error.message);
      throw error;
    }
  };

  // const addPaymentMethod = async (paymentMethodId, userId) => {
  //   try {
  //     const response = await axios.post(`${API_URL}/payment/stripe-add-payment-method`, {
  //       paymentMethodId,
  //       userId,
  //       fullName,
  //       email
  //     });
  
  //     console.log('Payment method added successfully:', response.data);
  //     return response.data; // Contains the attached PaymentMethodId
  //   } catch (error) {
  //     console.error('Error adding payment method:', error.response?.data || error.message);
  //     throw error;
  //   }
  // };

  const chargeCustomer = async (amount, chargingAmount, customerId, paymentMethodId, productId) => {
    try {
      const response = await axios.post(`${API_URL}/payment/FutureStripeChargeCustomer`, {
        amount,
        chargingAmount, //plan price
        customerId,
        paymentMethodId,
        userId,
        productId //Plan id
      });
  
      console.log('Charge successful:', response.data);
      return response.data; // Contains payment intent or success info
    } catch (error) {
      console.error('Error charging customer:', error.response?.data || error.message);
      throw error;
    }
  };
  
  return (

    <div className="stripe-checkout-container">
          <h2 className="stripe-checkout-title">Complete Your Payment</h2>
          <form className="stripe-checkout-form" onSubmit={handleAddPaymentMethod}>
            <label className="stripe-form-label">Card Details</label>
            <div className="stripe-card-input">
              <CardElement options={{ hidePostalCode: true }} />
            </div>
            <button className="stripe-submit-button" type="submit" disabled={!stripe || loading } >
              {/* Pay ${chargingAmount} */}
              {loading ? 'Please wait...' : 'Add Payment Method'}
            </button>
          </form>
          
        </div>
  );
};


const RightDrawerStripe = ({ isDrawerOpen, onClose, onItemSaved }) => {
  
  return (
    <div className={`right-drawer ${isDrawerOpen ? 'open' : ''}`}>
      {/* Drawer Header */}
      <div className="drawer-header">
      <label className="form-label text-gray-900">Add Stripe Payment Method</label>
        <button className="btn-close" onClick={onClose}>
          &times;
        </button>
      </div>

      {/* Drawer Body */}
      <div className="drawer-body">
        <Elements stripe={stripePromise} >
            <AddPaymentMethod closeDrawer={onClose} onItemSaved={onItemSaved}/>
          </Elements>
      </div>
      
    </div>
  );
};

export { RightDrawerStripe };
