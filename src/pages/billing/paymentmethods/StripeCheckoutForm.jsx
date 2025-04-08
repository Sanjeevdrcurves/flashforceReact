import React from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
//import "./StripeCheckoutForm.css"; // Import the CSS file for styling

const StripeCheckoutForm = () => {
    const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    try {
      // Call your backend to create a Checkout Session
      const response = await axios.post(`${API_URL}/payment/create-checkout-session`, {
        productName: "Sample Product",
        amount: 2000, // Amount in cents
      });

      const { sessionId } = response.data;

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error("Stripe Checkout Error:", error);
      }
    } catch (error) {
      console.error("Axios Request Error:", error);
    }
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Complete Your Payment</h2>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <label className="form-label">Card Details</label>
        <div className="card-input">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
        <button className="submit-button" type="submit" disabled={!stripe}>
          Pay $20.00
        </button>
      </form>
    </div>
  );
};

export default StripeCheckoutForm;