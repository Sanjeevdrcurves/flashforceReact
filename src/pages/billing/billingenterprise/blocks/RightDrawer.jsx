import React from 'react';
import './RightDrawer.css'; // Ensure your CSS is correctly linked
import { InvoiceDetails } from './InvoiceDetails';

const RightDrawer = ({ isDrawerOpen, onClose, invoiceId }) => {
  return (
    <div className={`right-drawer ${isDrawerOpen ? 'open' : ''}`}>
      <div className="drawer-header">
        <h4>Invoice Adjustment Panel</h4>
        <button className="btn btn-light" onClick={onClose}>
          &times;
        </button>
      </div>
      <div className="drawer-body">
        <p>Selected Invoice ID: {invoiceId}</p>
        <InvoiceDetails invoiceId={invoiceId}/>
      </div>
    </div>
  );
};

export { RightDrawer };
