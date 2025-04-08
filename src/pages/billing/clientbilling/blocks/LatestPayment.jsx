import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { KeenIcon } from '@/components';
import { toAbsoluteUrl } from '@/utils';
import { useSelector } from 'react-redux';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const LatestPayment = () => {
  
  const {userId, companyId} = useSelector(state => state.AuthReducerKey);
  const [payments, setPayments] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  //const companyId=1;
  useEffect(() => {
    // Fetch payment data from API
    axios
      .get(`${API_URL}/Payment/GetAllPaymentsByCompanyId/${companyId}`)
      .then((response) => {
        setPayments(response.data);
        if (response.data && response.data.length != 0) {
          fetchProducts(response.data[0].invoiceId);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching payment data:', error);
        setLoading(false);
      });
  }, []);

  const fetchProducts = async (invoiceId) => {
    try {
        const response = await axios.get(`${API_URL}/Billing/GetProductsByInvoiceId`, {
            params: { invoiceId }
        });

        setProducts(response.data);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
  };

  // Handle if there are no payments
  const renderItem = (payment, index) => {
    return (
      <tr key={index}>
        <td className="text-sm text-gray-600 min-w-36 pb-5 pe-6">{payment.status}</td>
        <td className="flex items-center gap-2.5 text-sm text-gray-800">
          {payment.logo && (
            <img
              src={toAbsoluteUrl(
                payment.info ==='PayPal'
                  ? '/media/brand-logos/paypal.svg'
                  : payment.info === 'CreditCard'
                  ? '/media/brand-logos/visa.svg'
                  : '/media/brand-logos/ideal.svg'
              )}
              className="w-10 shrink-0"
              alt={payment.info}
            />
          )}

          {payment.info}
        </td>
      </tr>
    );
  };

  // If loading data or no payments available
  if (loading) {
    return <div>Loading...</div>;
  }

  if (payments.length === 0) {
    return <div>No payments found</div>;
  }

  // Display the latest payment data
  const latestPayment = payments[0]; // Assuming the latest payment is the first one in the list

  const productNames = products.map(product => product.productName || "Unknown") // Default to "Unknown"
    .join(", ");

  const tables = [
    {
      status: 'Products',
      info: `${productNames}`, // Plan ID or a more readable plan name can be displayed
    },
    {
      status: 'Payment Date',
      info:new Date(latestPayment.paymentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), // Format as "16 Dec 2024"
    },
    {
      status: 'Card used to pay:',
      logo: true,
      info: latestPayment.paymentTypeUsed,
    },
    {
      status: 'Total Payment:',
      info: `$${latestPayment.paymentAmount.toFixed(2)}`,
    },
  ];

  return (
    <div className="card grow">
      <div className="card-header">
        <h3 className="card-title">Latest Payment</h3>

        <button className="btn btn-light btn-sm">
          <KeenIcon icon="exit-down" />
          Download PDF
        </button>
      </div>

      <div className="card-body pt-4 pb-3">
        <table className="table-auto">
          <tbody>
            {tables.map((table, index) => renderItem(table, index))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { LatestPayment };
