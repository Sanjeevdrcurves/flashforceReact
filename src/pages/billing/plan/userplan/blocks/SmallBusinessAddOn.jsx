import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { KeenIcon } from '@/components';
import { useNavigate } from 'react-router';
import DOMPurify from 'dompurify';
import './PlanTable.css';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const SmallBusinessAddOn = ({ planTypeId, fetchFlag, editPlanHandler }) => {
  const { userId, companyId, fullName, email } = useSelector((state) => state.AuthReducerKey);
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
        `${API_URL}/Feature/GetPlanFeatureDetailByTypeAndUser?planTypeId=${planTypeId}&companyId=${companyId}`
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
          var regularPrice = plan.MonthlyAmount-plan.AmountPaid;
          var annualPrice = plan.YearlyAmount-plan.AmountPaid;
          if(regularPrice && regularPrice<=0)
            regularPrice = 0;
          if(annualPrice && annualPrice<=0)
            annualPrice = 0;
          const key = `plan${index + 1}`;
          transformedPlans.info[key] = {
            title: plan.PlanName,
            description: plan.Description,
            planDetail: plan.PlanDetail,
            planId: plan.MasterPlanId,
            selectedPlanId: plan.SelectedMasterId,
           // paidAmount: plan.AmountPaid
            price: {
              regular: regularPrice,
              annual: annualPrice,
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
              'SelectedMasterId','AmountPaid',
            ].includes(key)
        );

        featureKeys.forEach((feature) => {
          const featureEntry = { title: feature, plans: {} };
          rawPlans.forEach((plan, index) => {
            const key = `plan${index + 1}`;
            featureEntry.plans[key] =
                            plan.hasOwnProperty(feature) && plan[feature] !== null && plan[feature] !== ''
                            ? (plan[feature] === 'Free add on' || plan[feature] === 'Paid add on'
                                ? plan[feature]
                                : (!isNaN(plan[feature]) ? Number(plan[feature]) : !!plan[feature]))
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
    debugger;
    //var price = planDetails.price.annual;
    var price = isAnnual?planDetails.price.annual : planDetails.price.regular;
    if(price<=0)
      price = 100;
    var productDetails = {
      planId: planDetails.planId,
      planName: planDetails.title,
      planPrice: price,
      planSub: isAnnual?'year':'month',
      chargeType: "CHANGE_PLAN",
      selectedAddOns: null
    }
     navigate('/auth/classic/signuppayment', {  
      state: { userId: userId, fullName: fullName, email: email, companyId: companyId, productDetails}});
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

 

  const renderPlanInfo = (info) => {//debugger
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
                  {isAnnual ? (info?.price?.annual>0?`$${info?.price?.annual}`:`$100`) : (info?.price?.regular>0? `$${info?.price?.regular}`:`$100`)}
                </div>
                <div className="text-gray-700 text-2xs">
                  {!isAnnual ? (info?.price?.annual>0?'per month':'per month') : (info?.price?.annual>0?'per year':'per year')}
                </div>
              </div>
            )}
          </div>

          <div className="text-gray-700 text-2sm pb-2">
            <HtmlContent content={info?.planDetail} />
          </div>
          {info?.selectedPlanId === info?.planId ? (
  <div>
  <button   
    className="btn btn-primary btn-sm text-center flex justify-center w-full" disabled >
  Current Plan  </button>
</div>
) : (userId!=170 && //super admin user drj@drcurves cannot change plan. it will corrupt hierarchy. 
  <div>
    <button
      onClick={() => selectPlanHandler(info)}
      className="btn btn-primary btn-sm text-center flex justify-center w-full"
    >
      Change Plan
    </button>
  </div>
)}

        </div>
      </div>
    );
  };

  const renderFeatureDetail = (detail, onChangeHandler) => {
   
    if (typeof detail === 'boolean') {
      if(detail=== true){
      return (
         <div className="text-gray-800 text-2sm">✔️</div>
        
        
      );
    }}
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

      
    </div>
  );
};

export { SmallBusinessAddOn };
