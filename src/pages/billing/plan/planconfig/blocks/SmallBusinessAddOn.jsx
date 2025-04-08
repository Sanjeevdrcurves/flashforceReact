import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { KeenIcon } from '@/components';
import { useNavigate } from 'react-router';
import DOMPurify from 'dompurify';
import './PlanTable.css';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const SmallBusinessAddOn = ({ planTypeId, fetchFlag, editPlanHandler }) => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [plans, setPlans] = useState(null);
  const navigate = useNavigate();

  const HtmlContent = ({ content }) => {
    if (!content) return null;
    const sanitizedContent = DOMPurify.sanitize(content);
    return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
  };

  useEffect(() => {
    fetchPlansAndFeatures();
  }, [planTypeId, fetchFlag]);

  const fetchPlansAndFeatures = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/Feature/GetPlanFeatureDetailByType?planTypeId=${planTypeId}`
      );

      debugger;
      const rawPlans = JSON.parse(response.data);

      const transformedPlans = {
        info: {},
        features: [],
      };

      if (rawPlans && rawPlans.length) {
        // Build plan info
        rawPlans.forEach((plan, index) => {
          const key = `plan${index + 1}`;
          transformedPlans.info[key] = {
            title: plan.PlanName,
            description: plan.Description,
            planDetail: plan.PlanDetail,
            planId: plan.MasterPlanId,
            price: {
              regular: `$${plan.MonthlyAmount}`,
              annual: `$${plan.YearlyAmount}`,
            },
            free: plan.MonthlyAmount <= 0,
            freePeriod: plan.FreeTrailPeriod,
            monthlyAmount: plan.MonthlyAmount,
            yearlyAmount: plan.YearlyAmount,
            isMostPopular: !!plan.IsMostPopular,
          };
        });

        // Build features
        const featureKeys = Object.keys(rawPlans[0]).filter(
          (key) =>
            ![
              'PlanName',
              'Description',
              'PlanDetail',
              'TotalSeats',
              'MonthlyAmount',
              'YearlyAmount',
              'FreeTrailPeriod',
              'MasterPlanId',
              'IsMostPopular',
            ].includes(key)
        );

        featureKeys.forEach((feature) => {
          const featureEntry = { title: feature, plans: {} };
          rawPlans.forEach((plan, index) => {
            const key = `plan${index + 1}`;
            featureEntry.plans[key] =
              plan.hasOwnProperty(feature) &&
              plan[feature] !== null &&
              plan[feature] !== ''
                ? true
                : false;
          });
          transformedPlans.features.push(featureEntry);
        });

        setPlans(transformedPlans);
      } else {
        setPlans(null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFeatureChange = (featureIndex, planKey, newValue) => {
    setPlans((prevPlans) => {
      const updatedFeatures = [...prevPlans.features];
      updatedFeatures[featureIndex].plans[planKey] = newValue;
      return { ...prevPlans, features: updatedFeatures };
    });
  };

  const selectPlanHandler = (planDetails) => {
    navigate('/billing/plan/SignUp', {
      state: { planId: planDetails.planId, isAnnual },
    });
  };

  const deletePlanHandler = (planDetails) => {
    if (confirm(`Are you sure you want to delete ${planDetails.title}?`)) {
      deleteMasterPlan(planDetails.planId);
    }
  };

  const deleteMasterPlan = async (masterPlanId) => {
    try {
      const response = await axios.delete(`${API_URL}/MasterPlan/Delete`, {
        headers: { Accept: '*/*' },
        params: { masterPlanId },
      });
      console.log('Delete Response:', response.data);
      fetchPlansAndFeatures();
    } catch (error) {
      console.error('Error deleting MasterPlan:', error);
    }
  };

  const getCheckedData = async () => {
    if (!plans || !plans.features) return;

    const checkedData = [];
    plans.features.forEach((feature) => {
      Object.keys(plans.info).forEach((planKey) => {
        const masterPlanId = plans.info[planKey].planId;
        const isChecked = feature.plans[planKey];
        checkedData.push({
          masterPlanId,
          featureTitle: feature.title,
          isChecked,
        });
      });
    });

    const payload = { features: checkedData };

    const response = await axios.post(
      `${API_URL}/MasterPlan/UpdatePlanFeatures`,
      payload
    );
    toast.success('Plans Updated Successfully!');
    console.log('Checked Data (with MasterPlanId):', response);
  };

  const renderPlanInfo = (info) => {
    return (
      <div>
        <div className="border rounded p-3 border-light-grey">
          {info.isMostPopular && (
            <div className="badge badge-sm badge-outline badge-success align-center">
              Most Popular Plan
            </div>
          )}

          <div className="flex items-center justify-between py-4 gap-2.5">
            <div className="flex flex-col justify-center gap-1.5">
              <span className="leading-none font-medium text-sm text-gray-900">
                {info?.title}
              </span>
            </div>
            <div className="flex">
              <button
                className="btn btn-sm btn-icon btn-clear btn-light"
                onClick={() => editPlanHandler(info)}
              >
                <KeenIcon icon="notepad-edit" />
              </button>
              <button
                className="btn btn-sm btn-icon btn-clear btn-light"
                onClick={() => deletePlanHandler(info)}
              >
                <KeenIcon icon="trash" />
              </button>
            </div>
          </div>

          <div className="text-gray-700 text-2sm">{info?.description}</div>

          <div className="py-4">
            {info?.free ? (
              <h4 className="text-2xl text-gray-900 font-semibold leading-none">
                Free
              </h4>
            ) : (
              <div className="flex items-end gap-1.5">
                <div className="text-2xl text-gray-900 font-semibold leading-none">
                  {isAnnual ? info?.price?.annual : info?.price?.regular}
                </div>
                <div className="text-gray-700 text-2xs">
                  {!isAnnual ? 'per month' : 'per year'}
                </div>
              </div>
            )}
          </div>

          <div className="text-gray-700 text-2sm">
            <HtmlContent content={info?.planDetail} />
          </div>

          <div>
            <button
              onClick={() => selectPlanHandler(info)}
              className="btn btn-primary btn-sm text-center flex justify-center w-full"
            >
              Start Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderFeatureDetail = (detail, onChangeHandler) => {
    if (typeof detail === 'boolean') {
      return (
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-primary"
          checked={detail}
          onChange={(e) => onChangeHandler(e.target.checked)}
        />
      );
    }
    return <div className="text-gray-800 text-2sm">{detail}</div>;
  };

  return (
    <div className="w-full">
      {/* 
        - Use your custom classes on the wrapper to enable horizontal scrolling.
        - “scrollable-x-auto” should be a CSS utility class that sets overflow-x: auto
          and potentially other styling if needed.
        - “card-table” can be your custom styling class for the table container.
      */}
      <div className="card-table scrollable-x-auto max-w-full">
        <table className="table table-fixed table-border-b table-border-e table-rounded card-rounded min-w-max">
          <thead>
            <tr>
              <th className="border-0"></th>
              {Object.keys(plans?.info || {}).map((key) => (
                <th key={key} className="border-0">
                  {renderPlanInfo(plans.info[key])}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plans?.features.map((feature, featureIndex) => (
              <tr key={featureIndex}>
                <td className="table-border-s !px-5 !py-3.5 whitespace-nowrap">
                  <div className="text-gray-900 text-2sm leading-none font-medium">
                    {feature.title}
                  </div>
                </td>
                {Object.keys(plans?.info || {}).map((planKey) => (
                  <td
                    key={`${featureIndex}-${planKey}`}
                    className="table-border-s !px-5 !py-3.5 whitespace-nowrap"
                  >
                    {renderFeatureDetail(
                      feature?.plans[planKey],
                      (newValue) =>
                        handleFeatureChange(featureIndex, planKey, newValue)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <button className="btn btn-primary" onClick={getCheckedData}>
          Update Plan
        </button>
      </div>
    </div>
  );
};

export { SmallBusinessAddOn };
