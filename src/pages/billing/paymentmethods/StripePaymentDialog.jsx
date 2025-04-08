import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { Elements, CardElement, useStripe, useElements, PaymentElement  } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useSelector } from 'react-redux';
import "./StripeCheckoutForm.css"; // Import the CSS file for styling
// import { toast } from 'sonner';
import { ToastContainer, toast } from 'react-toastify';
import { sendNotification } from '@/utils/notificationapi';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const stripePromise = loadStripe(import.meta.env.VITE_FLASHFORCE_STRIPE_PUBLISH_KEY);

const AddPaymentMethod = ({productDetails, setPaymentInfo}) => {
  const {userId, fullName, companyId, email}=useSelector(state=>state.AuthReducerKey);
  const [loading, setLoading] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
//const {userId, fullName, email, productDetails.planPrice}=useSelector(state=>state.AuthReducerKey);
  //const {userId, fullName, email, companyId} = location.state || {};

  const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
  const stripe = useStripe();
  const elements = useElements();
  //debugger;
  var isAnnual = true;
  //var products = [{"ProductId":1, "ProductType":"Plan", "Quantity":1, "UnitPrice":1000, "SubType":"Yearly"}, {"ProductId":3, "ProductType":"AddOn", "Quantity":1, "UnitPrice":12, "SubType":"Monthly"}];
  var products = [];
  var totalChargingAmount = parseFloat('0');
  if(productDetails.planId){
    isAnnual = productDetails?.planSub=='Yearly'?true:false;
    products = [{ProductId: productDetails.planId, ProductType: "Plan", Quantity: 1, UnitPrice: productDetails.planPrice}];
    totalChargingAmount = parseFloat(productDetails.planPrice);
  }
  
  var addons = productDetails.selectedAddOns; //id, name, price, subType
  if(productDetails && addons && addons.length){
    addons.map((item, index) => {
      addons[index].key = item.id;  //required for rendering
      products.push({ProductId: item.id, ProductType: "AddOn", Quantity: 1, UnitPrice: item.price, SubType: item.subType});
      if(item.price)
        totalChargingAmount = totalChargingAmount + parseFloat(item.price);
    });
  }
  totalChargingAmount = totalChargingAmount.toFixed(2);

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
        //await chargeCustomer(Math.round(totalChargingAmount * 100), result.customerId, paymentMethod.id);
        const data = await chargeCustomer(Math.round(1 * 100), result.customerId, paymentMethod.id);
        debugger;
        if(data.success){
          setPaymentDone(true);
          setPaymentInfo(data);
          await sendNotification(
            userId,
            42, // Assuming 21 is the notification setting ID for the update
            'Payment success notification',
            'Payment Successful',
            '4',
           String(totalChargingAmount)
          );
          await sendNotification(
            userId,
            63, // Assuming 63 is the notification setting ID 
            'Payment success notification',
            'Payment Successful',
            '46',
           String(totalChargingAmount)
          );
          
        }
        else{
          alert("Verification failed");
        }
        
        
      }
      //await chargeCustomer(5000, customerId, paymentMethodId); // $50.00 charge
      console.log('API Response:', result);
      setLoading(false);
    } catch (error) {
      debugger;
      setLoading(false);
      console.error('Failed to add payment method.');
      console.error('Error charging customer:', error.response?.data || error.message);
      toast.error('Error charging customer. Please try again later.');
        // Send Notification for payment failure
        await sendNotification(
          userId,
          42, // Assuming 21 is the notification setting ID for the update
          'Payment failure notification',
          'Payment Failure ',
          '5',
         String(totalChargingAmount)
        );
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
      var chargingAmount = totalChargingAmount;
      var productId = productDetails.planId;
      debugger;
      const response = await axios.post(`${API_URL}/payment/stripe-onboarding-charge`, {
        amount,
        products:JSON.stringify(products),
        chargingAmount,
        customerId,
        paymentMethodId,
        userId,
        productId,
        chargeType: productDetails.chargeType,
        companyId,
        isAnnual
      });
  
      console.log('Charge successful:', response.data);
      return response.data; // Contains payment intent or success info
    } catch (error) {
      console.error('Error charging customer:', error.response?.data || error.message);
      throw error;
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
          <div className="flex flex-col pb-5">
            {productDetails.planId && <div className='flex justify-between gap-5'>
              <span className="font-bold text-xs text-gray-800">{productDetails.planName}</span>
              <span className="text-xs text-gray-600">${parseFloat(productDetails.planPrice).toFixed(2)}/{productDetails.planSub}</span>
            </div>}
            {addons && (<div className='flex justify-between gap-5'>
              <span className="font-bold text-xs text-gray-800">Add On Details:</span>
            </div>)}
            
            {addons && addons.map((item, index) => (
              <div className='flex justify-between gap-5 ps-1'>
                <span className="text-xs text-gray-800">- {item.name}</span>
                <span className="text-xs text-gray-600">${parseFloat(item.price).toFixed(2)}</span>
              </div>
              
            ))}
            
            {/* Divider */}
            <hr className="my-2 border-dark" />
            <div className='flex justify-between gap-5'>
              <span className="font-bold text-xs text-gray-800">Total</span>
              <span className="text-xs text-gray-600">${totalChargingAmount}</span>
            </div>
            <hr className="my-2 border-dark" />         
          </div>
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
            <button className="stripe-submit-button" type="submit" disabled={!stripe || loading || paymentDone} >
              {/* Pay ${totalChargingAmount} */}
              {loading ? 'Please wait...' : (totalChargingAmount>0?'Pay $'+totalChargingAmount:'Add Card Information')}
            </button>
          </form>
          <ToastContainer position="top-right"
                          autoClose={3000}
                          theme="dark"/>
        </div>
  );
};

const StripePaymentDialog = ({ open, onOpenChange, productDetails, setPaymentInfo }) => {
  
  return (<Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="container-fixed max-w-[500px] flex flex-col p-5 overflow-hidden [&>button]:hidden">
      <DialogHeader className="">
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
        <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5">
          <div className="flex flex-col justify-center gap-2">
            <h1 className="text-xl font-semibold leading-none text-gray-900">Payment Details</h1>
            {/* <div className="flex items-center gap-2 text-sm font-normal text-gray-700">
              {selectedAddOn.name}
            </div> */}
          </div>
          <button className="btn btn-sm btn-light" onClick={onOpenChange}>
            Close
          </button>
        </div>
      </DialogHeader>
      <DialogBody className="scrollable-y" >
      <Elements stripe={stripePromise} >
          <AddPaymentMethod productDetails={productDetails} setPaymentInfo={setPaymentInfo}/>
          
        </Elements>
      </DialogBody>
    </DialogContent>
  </Dialog>
  );
};

export {StripePaymentDialog};