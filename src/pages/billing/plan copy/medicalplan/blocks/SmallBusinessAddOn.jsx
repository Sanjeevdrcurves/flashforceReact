import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { KeenIcon } from '@/components';
import { useNavigate } from 'react-router';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const SmallBusinessAddOn = ({ planTypeId }) => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [plans, setPlans] = useState(null);
  const navigate = useNavigate();

  const handleToggleBilling = () => setIsAnnual(!isAnnual);

  useEffect(() => {
    const fetchPlansAndFeatures = async () => {
      try {
        const response = await axios.get(`${API_URL}/Feature/GetPlanFeatureDetail?planTypeId=${planTypeId}`);
        const rawPlans = JSON.parse(response.data);
        debugger;
        const transformedPlans = {
          info: {},
          features: [],
        };

        rawPlans.forEach((plan, index) => {
          const key = `plan${index + 1}`; // Generate dynamic keys like "plan1", "plan2"
          transformedPlans.info[key] = {
            title: plan.PlanName,
            description: plan.Description,
            planId: plan.MasterPlanId,
            price: {
              regular: `$${plan.MonthlyAmount}`,
              annual: `$${plan.YearlyAmount}`,
            },
            free: plan.MonthlyAmount <= 0,
          };
        });

        const featureKeys = Object.keys(rawPlans[0]).filter(
          (key) =>
            !["PlanName", "Description", "MonthlyAmount", "YearlyAmount", "FreeTrailPeriod","MasterPlanId"].includes(key)
        );

        featureKeys.forEach((feature) => {
          const featureEntry = {
            title: feature,
            plans: {},
          };
          rawPlans.forEach((plan, index) => {
            const key = `plan${index + 1}`;
            if (feature === "TotalSeats") {
              // Set the value specifically for the "TotalSeats" feature
              featureEntry.plans[key] = "Up to " + plan["TotalSeats"]  +" Users"|| 0; // Default to 0 if "TotalSeats" is not defined
            } else {
              // Default logic for other features
              featureEntry.plans[key] = plan.hasOwnProperty(feature) && plan[feature] ? true : false;
            }
            //featureEntry.plans[key] = plan.hasOwnProperty(feature) && plan[feature] ? true : false;
          });
          transformedPlans.features.push(featureEntry);
        });

        setPlans(transformedPlans);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPlansAndFeatures();
  }, [planTypeId]); // Added planTypeId as a dependency

  const selectPlanHandler = (planDetails) => { debugger;
    navigate("/billing/plan/SignUp", {
      state: { planId: planDetails.planId,  isAnnual },
    });
  };

  const renderPlanInfo = (info) => (
    <Fragment>
      <h3 className="text-lg text-gray-900 font-medium pb-2">{info?.title}</h3>
      <div className="text-gray-700 text-2sm">{info?.description}</div>
      <div className="py-4">
        {info?.free ? (
          <h4 className="text-2xl text-gray-900 font-semibold leading-none">Free</h4>
        ) : (
          <div className="flex items-end gap-1.5">
            <div className="text-2xl text-gray-900 font-semibold leading-none">
              {isAnnual ? info?.price?.annual : info?.price?.regular}
            </div>
            <div className="text-gray-700 text-2xs">{!isAnnual ? 'per month' : 'per year'}</div>
          </div>
        )}
      </div>
      <div>
        <button
          onClick={() => selectPlanHandler(info)}
          className={info?.free ? 'btn btn-light btn-sm flex justify-center w-full' : 'btn btn-primary btn-sm text-center flex justify-center w-full'}
        >
          {info?.free ? 'Switch to Team' : 'Start Now'}
        </button>
      </div>
    </Fragment>
  );

  const renderFeatureDetail = (detail) => { 
    if (typeof detail === 'boolean') {
      return detail ? <KeenIcon icon="check" className="text-success text-lg" /> : null;
    }
    return <div className="text-gray-800 text-2sm">{detail}</div>;
  };

  return (
    <div className="scrollable-x-auto pt-3 -mt-3">
      <table className="table table-fixed min-w-[1000px] table-border-b table-border-e table-rounded card-rounded">
        <thead>
          <tr>
            <th className="align-bottom !p-5 !pt-7.5 !pb-6">
              <label className="switch switch-sm">
                <input
                  className="order-1"
                  type="checkbox"
                  checked={isAnnual}
                  onChange={handleToggleBilling}
                />
                <div className="switch-label order-2">
                  <span className="text-gray-800 text-2sm font-semibold">Annual Billing</span>
                </div>
              </label>
            </th>
            {Object.keys(plans?.info || {}).map((key) => (
              <th key={key} className="!border-b-0 table-border-s table-border-t !p-5 !pt-7.5">
                {renderPlanInfo(plans.info[key])}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {plans?.features.map((feature, index) => (
            <tr key={index}>
              <td className="table-border-s !px-5 !py-3.5">
                <div className="text-gray-900 text-2sm leading-none font-medium">{feature.title}</div>
              </td>
              {Object.keys(plans?.info || {}).map((key) => (
                <td key={`${index}-${key}`} className="table-border-s !px-5 !py-3.5">
                  {renderFeatureDetail(feature?.plans[key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { SmallBusinessAddOn };
