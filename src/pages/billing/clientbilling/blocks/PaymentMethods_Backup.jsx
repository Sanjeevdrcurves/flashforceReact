import React, { useEffect, useState } from 'react';
import { KeenIcon } from '@/components';
import { toAbsoluteUrl } from '@/utils';
import axios from 'axios';
import CardDetails from './CardDetails'; // Import the CardDetails component

import { useSelector } from 'react-redux';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const PaymentMethods = () => {
  const {userId, companyId} = useSelector(state => state.AuthReducerKey);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility
  const [currentCard, setCurrentCard] = useState(null); // To track the card being edited
  //const companyId = 1;

  // Fetch payment methods on component mount
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get(`${API_URL}/CardDetails/GetAllCardDetailsByCompanyId/${companyId}`);
        const data = response.data;

        const formattedItems = data.map(item => {
          let logo = 'visa.svg'; // Assuming a default logo for all items
          return {
            logo,
            title: item.cardHolderName,
            email: 'CreditCard', // item.paymentTypeUsed,
            label: 'CreditCard', // item.paymentTypeUsed === 'CreditCard',
            cardId: item.cardID, // Assuming the cardId is available
            cardNumber: item.cardNumber,
            expiryDate: new Date(item.expiryDate), // Assuming the expiryDate is available
            cvv: item.cvv, // Assuming the CVV is available
          };
        });

        setPaymentMethods(formattedItems);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      }
    };

    fetchPaymentMethods();
  }, [showModal]);

  // Handle Delete
  const handleDelete = async (cardId) => {
    try {
      await axios.delete(`${API_URL}/CardDetails/DeleteCardDetails/${cardId}`);
      setPaymentMethods(prevMethods => prevMethods.filter(item => item.cardId !== cardId));
    } catch (error) {
      console.error('Error deleting payment method:', error);
    }
  };

  // Handle Edit
  const handleEdit = (cardId) => {
    const cardToEdit = paymentMethods.find(item => item.cardId === cardId);
    setCurrentCard(cardToEdit);
    setShowModal(true); // Show the modal for editing
  };

  const renderItem = (item, index) => (
    <div
      key={index}
      className="flex items-center justify-between border border-gray-200 rounded-xl gap-2 px-4 py-4 bg-secondary-clarity"
    >
      <div className="flex items-center gap-3.5">
        <img
          src={toAbsoluteUrl(`/media/brand-logos/${item.logo}`)}
          className="w-10 shrink-0"
          alt={item.logo}
        />
        <div className="flex flex-col">
          <a
            href="#"
            className="text-sm font-medium text-gray-900 hover:text-primary-active mb-px"
          >
            {item.title}
          </a>
          <span className="text-2sm text-gray-700">{item.email}</span>
        </div>
      </div>
      <div className="flex items-center gap-5">
        {item.label && (
          <span className="badge badge-sm badge-success badge-outline">Primary</span>
        )}
        <div className="flex gap-0.5">
          <div
            className="btn btn-sm btn-icon btn-clear btn-light"
            onClick={() => handleEdit(item.cardId)} // Edit button click
          >
            <KeenIcon icon="notepad-edit" />
          </div>
          <div
            className="btn btn-sm btn-icon btn-clear btn-light"
            onClick={() => handleDelete(item.cardId)} // Delete button click
          >
            <KeenIcon icon="trash" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="card grow">
      <div className="card-header">
        <h3 className="card-title">Payment Methods</h3>

        <button
          className="btn btn-light btn-sm"
          onClick={() => {
            setCurrentCard(null); // Clear any existing card details
            setShowModal(true); // Show the modal for adding a new card
          }}
        >
          <KeenIcon icon="plus-squared" />
          Add New
        </button>
      </div>

      <div className="card-body lg:pb-7.5">
        <div className="grid gap-5">
          {paymentMethods.length > 0 ? (
            paymentMethods.map((item, index) => renderItem(item, index))
          ) : (
            <p>No payment methods available.</p>
          )}
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{currentCard ? 'Edit Card' : 'Add New Card'}</h2>
              <button
                className="btn btn-sm btn-icon"
                onClick={() => setShowModal(false)} // Close the modal
              >
                <KeenIcon icon="close" />
              </button>
            </div>
            <div className="mt-4">
              <CardDetails
                onClose={() => setShowModal(false)}
                card={currentCard} // Pass currentCard to CardDetails for editing
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { PaymentMethods };
