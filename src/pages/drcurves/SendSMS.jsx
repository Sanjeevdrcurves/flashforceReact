import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
import axios from 'axios';

function SendSMS() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSendSMS = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/twilio/send-sms`, {
        to: phoneNumber,
        message: message
      });

      if (response.data.success) {
        setStatus(`SMS sent! SID: ${response.data.messageSid}`);
      } else {
        setStatus(`Failed to send SMS: ${response.data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('An error occurred while sending the SMS.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>Send SMS via Twilio</h2>
      <form onSubmit={handleSendSMS}>
        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter Phone no."
            required
          />
        </div>
        <div>
          <label>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"  type="submit">Send SMS</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}

export default SendSMS;
