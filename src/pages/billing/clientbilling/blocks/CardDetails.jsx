import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const CardDetails = ({ onClose, card }) => {
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(true);
  const {userId, companyId} = useSelector(state => state.AuthReducerKey);
  //const companyId = 1;

  // Populate fields if card data exists
  useEffect(() => {
    if (card) {
      setCardName(card.label || '');
      setCardNumber(card.cardNumber || '');
      setCvv(card.cvv || '');

      if (card.expiryDate) {
        const date = new Date(card.expiryDate);
        setExpiryMonth(date.getMonth() + 1);
        setExpiryYear(date.getFullYear());
      }
    }
  }, [card]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cardName || !cardNumber || !expiryMonth || !expiryYear || !cvv) {
      alert('Please fill in all required fields.');
      return;
    }

    const expiryDate = new Date(
      `${expiryYear}-${String(expiryMonth).padStart(2, '0')}-01`
    );

    const payload = {
      companyID: companyId,
      cardHolderName: cardName,
      cardNumber: cardNumber,
      expiryDate: `${expiryDate.getFullYear()}-${String(expiryDate.getMonth() + 1).padStart(2, '0')}-01`,
      cvv: cvv,
      createdBy:  String(userId),
      cardID:card?card?.cardId:0
    };

    try {
      const url = card
        ? `${API_URL}/CardDetails/UpdateCardDetail` // Update endpoint if card exists
        : `${API_URL}/CardDetails/InsertCardDetails`; // Insert endpoint
      const response = !card? await axios.post(url, payload):await axios.put(url, payload);

      if (response.status === 200) {
        alert(`Card details ${card ? 'updated' : 'saved'} successfully!`);
        onClose();
      } else {
        alert(`Failed to ${card ? 'update' : 'save'} card details.`);
      }
    } catch (error) {
      console.error('Error saving card details:', error);
      alert('There was an error saving the card details. Please try again.');
    }
  };

  return (
    <form id="kt_modal_new_card_form" onSubmit={handleSubmit}>
      {/* Card Name */}
      <div className="d-flex flex-column mb-7">
        <label className="fs-6 fw-semibold form-label mb-2">
          <span className="required">Name On Card</span>
        </label>
        <input
          type="text"
          className="form-control form-control-solid"
          placeholder="Name On Card"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
        />
      </div>

      {/* Card Number */}
      <div className="d-flex flex-column mb-7">
        <label className="required fs-6 fw-semibold form-label mb-2">Card Number</label>
        <input
          type="text"
          className="form-control form-control-solid"
          placeholder="Enter card number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
      </div>

      {/* Expiration Date and CVV */}
      <div className="row mb-10">
        <div className="col-md-8">
          <label className="required fs-6 fw-semibold form-label mb-2">Expiration Date</label>
          <div className="row">
            <div className="col-6">
              <select
                className="form-select form-select-solid"
                value={expiryMonth}
                onChange={(e) => setExpiryMonth(e.target.value)}
              >
                <option value="">Month</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            <div className="col-6">
              <select
                className="form-select form-select-solid"
                value={expiryYear}
                onChange={(e) => setExpiryYear(e.target.value)}
              >
                <option value="">Year</option>
                {[...Array(11)].map((_, i) => (
                  <option key={i} value={2024 + i}>{2024 + i}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <label className="required fs-6 fw-semibold form-label mb-2">CVV</label>
          <input
            type="text"
            className="form-control form-control-solid"
            placeholder="CVV"
            maxLength={4}
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="text-center pt-15">
        <button type="button" className="btn btn-light me-3" onClick={onClose}>
          Close
        </button>
        <button type="submit" className="btn btn-primary">
          <span className="indicator-label">
            {card ? 'Update' : 'Submit'}
          </span>
        </button>
      </div>
    </form>
  );
};

export default CardDetails;
