import { KeenIcon } from '@/components';
import { CommonHexagonBadge } from '@/partials/common';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const NextPayment = () => {
  
  const {userId, companyId} = useSelector(state => state.AuthReducerKey);
  const [isDue, setIsDue] = useState(false);
  const [nextPaymentDate, setNextPaymentDate] = useState('');
  const [loading, setLoading] = useState(true);
  //const companyId=1;
  useEffect(() => {
    // Fetch payment data from API
    axios
      .get(`${API_URL}/Billing/GetAllInvoicesByUserCompany/${userId}`)
      .then((response) => {
        const invoices = response.data;
        debugger;
        if (invoices.length > 0) {
          // // Get the most recent payment date
          // const latestPayment = invoices[0];
          // const planEndDate = new Date(latestPayment.planEndDate);

          // // Calculate the next payment date (1 month later)
          // planEndDate.setMonth(planEndDate.getMonth() + 1);

          var latest = response.data[0];
          if(latest.status=='Unpaid'||latest.status=='Overdue'){
            const planEndDate = new Date(latest.dueDate);
            // Format the date to "DD MMM, YYYY"
            const formattedNextPaymentDate = planEndDate.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });
            setIsDue(true);
            setNextPaymentDate(formattedNextPaymentDate);
          }
          else {
            setNextPaymentDate('No upcoming payment date');
          }

          
        } else {
          setNextPaymentDate('No upcoming payment date');
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching payment data:', error);
        setLoading(false);
      });
  }, []);

  // If loading data
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="card grow">
      <div className="card-header">
        <h3 className="card-title">Next Payment</h3>
      </div>

      <div className="card-body lg:7.5">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between flex-wrap border border-gray-200 rounded-xl gap-2 px-4 py-4 bg-secondary-clarity">
            <div className="flex items-center gap-3.5">
              <CommonHexagonBadge
                stroke="stroke-brand-clarity"
                fill="fill-brand-light"
                size="size-[50px]"
                badge={<KeenIcon icon="calendar" className="text-xl text-brand" />}
              />

              <div className="flex flex-col">
                <a href="#" className="text-sm font-medium hover:text-primary text-gray-900">
                  {nextPaymentDate}
                </a>
                {isDue && (<p className="text-2sm text-gray-700">Due date</p>)}
              </div>
            </div>

            <button className="btn btn-sm btn-icon btn-outline btn-success rounded-full">
              <KeenIcon icon="check" />
            </button>
          </div>
          <div className="place-self-end lg:pb-2.5">
            {/* <a href="#" className="btn btn-sm btn-primary">
              Manage Payment
            </a> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export { NextPayment };
