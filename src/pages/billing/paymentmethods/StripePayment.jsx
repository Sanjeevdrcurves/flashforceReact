import React from "react";
import ReactDOM from "react-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import  StripeCheckoutForm from './StripeCheckoutForm';

// npm install @stripe/react-stripe-js @stripe/stripe-js

//this should be on global level to avoid creation of multiple instances.
const stripePromise = loadStripe("pk_test_ZM2EnMvapOsHZil619Ql4Ub200NbgVqwLt");

const StripePayment = () => (
  <Elements stripe={stripePromise}>
    {/* Your App Components */}
    <StripeCheckoutForm />
  </Elements>
);

export default StripePayment;

