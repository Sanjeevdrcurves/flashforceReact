import { useEffect, useState } from 'react';
import axios from 'axios';
import { toAbsoluteUrl } from '@/utils';
import { useSelector } from 'react-redux';
import { CommonAvatars } from '@/partials/common';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const CompanyProfile = () => {
  const [planData, setPlanData] = useState(null);
  const [statistics, setStatistics] = useState([]);
  const [planType, setPlanType] = useState('');
  const [usedSeats, setUsedSeats] = useState(0);
  const [totalSeats, setTotalSeats] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const { companyId } = useSelector((state) => state.AuthReducerKey);

  const group = [
    { filename: '300-4.png', variant: 'size-6' },
    { filename: '300-1.png', variant: 'size-6' },
    { filename: '300-2.png', variant: 'size-6' },
    { fallback: '+16', variant: 'text-primary-inverse size-6 ring-success-light bg-success' },
  ];

  useEffect(() => {
    axios
      .get(`${API_URL}/Company/GetCompanyPlanDetails/${companyId}`)
      .then((response) => {
        console.log('API Response:', response.data);
        if (response.data) {
          const plan = response.data;
          setPlanData(plan);

          // Determine plan type
          const start = new Date(plan.planStartDate);
          const end = new Date(plan.planEndDate);
          const differenceInTime = end - start;
          const differenceInYears = differenceInTime / (1000 * 60 * 60 * 24 * 365);

          setPlanType(differenceInYears >= 1 ? 'Yearly Plan' : 'Monthly Plan');

          // Calculate seats and percentage
          const total = 
            (plan.contactCount || 0) + 
            (plan.userCount || 0) + 
            (plan.locationCount || 0) + 
            (plan.linkedAccountCount || 0);
          const used = 
            (plan.contactUsed || 0) + 
            (plan.userUsed || 0) + 
            (plan.locationUsed || 0) + 
            (plan.linkedAccountUsed || 0);
          const percent = total ? (used / total) * 100 : 0;

          setTotalSeats(total);
          setUsedSeats(used);
          setPercentage(percent);

          // Build statistics
          const stats = [
            { total: `${plan.contactUsed || 0} / ${plan.contactCount || 0}`, description: 'Contacts' },
            { total: `${plan.userUsed || 0} / ${plan.userCount || 0}`, description: 'Users' },
            { total: `${plan.locationUsed || 0} / ${plan.locationCount || 0}`, description: 'Locations' },
            { total: `${plan.linkedAccountUsed || 0} / ${plan.linkedAccountCount || 0}`, description: 'Linked Accounts' },
            {
              total: (() => {
                const rawDate = plan.planEndDate?.trim();
                const parsedDate = new Date(rawDate);
                if (isNaN(parsedDate)) {
                  console.error('Invalid Date:', rawDate);
                  return 'Invalid Date';
                }
                return parsedDate.toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                });
              })(),
              description: 'Next Billing Date',
            },
          ];

          setStatistics(stats);
        } else {
          console.warn('No data returned from the API.');
          setPlanData(null);
        }
      })
      .catch((error) => {
        console.error('Error fetching plan data:', error);
        setPlanData(null);
      });
  }, [companyId]);

  const fetchFeatureDetailById = async (id) => {
      try {
        const response = await axios.get(`${API_URL}/MasterPlan/GetFeatureById/${id}`);
        const features = (response.data || []).map((item) => ({
          ...item,
          // Convert boolean to 1 or 0 for easier toggling
          isAddOnFree: item.isAddOnFree ? 1 : 0,
        }));
        //setFeatureData(features);
        if(features && features.length){
          var plan={
            planStartDate: '',
            planEndDate: '',
            contactCount: '',
            userCount: '',
            locationCount: '',
            linkedAccountCount: '',
            contactUsed: '',
            userUsed: '',
            locationUsed: '',
            linkedAccountUsed: '',
            planName: '',
            description: ''

          }
          features.map((item, index) => {
            // var plan={
            //   planStartDate: aaaa,
            //   planEndDate: aaaa,
            //   contactCount: aaaa,
            //   userCount: aaaa,
            //   locationCount: aaaa,
            //   linkedAccountCount: aaaa,
            //   contactUsed: aaaa,
            //   userUsed: aaaa,
            //   locationUsed: aaaa,
            //   linkedAccountUsed: aaaa,
            //   planName: aaaa,
            //   description: aaaa

            // }
          });
        }
        
      } catch (error) {
        console.error('Error fetching MasterPlan features by ID:', error);
      }
    };

  if (!planData) {
    return <div>No plans available for this company or data is still loading.</div>;
  }

  const renderItem = (statistic, index) => (
    <div
      key={index}
      className="flex flex-col gap-1.5 px-2.75 py-2.25 border border-dashed border-gray-400 rounded-md"
    >
      <span className="text-gray-900 text-sm leading-none font-medium">{statistic.total}</span>
      <span className="text-gray-700 text-xs">{statistic.description}</span>
    </div>
  );

  return (
    <div className="card">
      <div className="card-body lg:py-7.5">
        <div className="flex flex-wrap gap-7.5">
          <div className="flex flex-col gap-3 items-center justify-center size-[140px] rounded-xl ring-1 ring-gray-200 bg-secondary-clarity">
            <img
              src={toAbsoluteUrl('/media/brand-logos/cloud-one.svg')}
              className="size-[70px]"
              alt="Company Logo"
            />
            <span className="text-sm font-semibold text-gray-900">{planData.planName}</span>
          </div>
          <div className="flex flex-col gap-5 lg:gap-7.5 grow">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl font-semibold text-gray-900">{planData.planName}</h2>
                  <span className="badge badge-sm badge-success badge-outline">{planType}</span>
                </div>
                <p className="text-2sm text-gray-700">{planData.description || 'No description available.'}</p>
              </div>
              <div className="flex items-center gap-2.5">
                <a href="#" className="btn btn-sm btn-light">
                  Cancel Plan
                </a>
                <a href="#" className="btn btn-sm btn-primary">
                  Upgrade Plan
                </a>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-3 lg:gap-5">
              {statistics.map((statistic, index) => renderItem(statistic, index))}
            </div>

            <div className="flex flex-wrap gap-6 lg:gap-12">
              <div className="flex flex-col gap-3.5 grow">
                <div className="text-2sm text-gray-600">
                  Seats:&nbsp;
                  <span className="text-2sm font-medium text-gray-900">{usedSeats} of {totalSeats} used</span>
                </div>
                <div className="progress progress-primary max-w-2xl w-full">
                  <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
                </div>
              </div>
              <div className="flex flex-col gap-2.5 lg:min-w-24 shrink-0 -mt-3 max-w-auto">
                <div className="text-2sm font-medium text-gray-600">
                  Seats:&nbsp;
                  <span className="text-2sm font-semibold text-gray-800">{usedSeats} of {totalSeats} used</span>
                </div>
                <div>
                  <CommonAvatars group={group} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CompanyProfile };
