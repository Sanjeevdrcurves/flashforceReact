import { useState, Fragment } from 'react';
import { KeenIcon } from '@/components';

const Plans = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const handleToggleBilling = () => {
    setIsAnnual(!isAnnual);
  };

  const plans = {
    info: {
      basic: {
        title: 'Basic',
        description: 'Essential features for startups individuals',
        free: true
      },
      pro: {
        title: 'Pro',
        description: 'Advanced tools for growing businesses',
        price: {
          regular: '$99',
          annual: '$79'
        }
      },
      premium: {
        title: 'Premium',
        description: 'Comprehensive suite for large-scale operations',
        price: {
          regular: '$199',
          annual: '$179'
        }
      },
      enterprise: {
        title: 'Enterprise',
        description: 'Tailored solutions for enterprise needs',
        price: {
          regular: '$1,299',
          annual: '$1,079'
        }
      }
    },
    features: [
      {
        title: 'User Accounts',
        plans: {
          basic: 'Up to 5',
          pro: 'Up to 20',
          premium: 'Up to 50',
          enterprise: 'Unlimited'
        }
      },
      {
        title: 'Data Storage',
        plans: {
          basic: '10 GB',
          pro: '50 GB',
          premium: '200 GB',
          enterprise: 'Custom'
        }
      },
      {
        title: 'CAPI Calls',
        plans: {
          basic: '1,000/month',
          pro: '10,000/month',
          premium: '50,000/month',
          enterprise: 'Unlimited'
        }
      },
      {
        title: 'Support',
        plans: {
          basic: 'Email',
          pro: 'Email + Chat',
          premium: 'Priority',
          enterprise: '24/7 Live Support'
        }
      },
      {
        title: 'Data Backup',
        plans: {
          basic: 'Weekly',
          pro: 'Daily',
          premium: 'Hourly',
          enterprise: 'Real-time'
        }
      },
      {
        title: 'Analytics Tools',
        plans: {
          basic: 'Basic',
          pro: 'Advanced',
          premium: 'Comprehensive',
          enterprise: 'Custom'
        }
      },
      {
        title: 'Integration Options',
        plans: {
          basic: 'Limited',
          pro: 'Standard',
          premium: 'Extended',
          enterprise: 'Full Suite'
        }
      },
      {
        title: 'Uptime Guarantee',
        plans: {
          basic: '99%',
          pro: '99.9%',
          premium: '99.99%',
          enterprise: '99.999%'
        }
      },
      {
        title: 'Custom Reports',
        plans: {
          basic: false,
          pro: true,
          premium: true,
          enterprise: true
        }
      },
      {
        title: 'Mobile Access',
        plans: {
          basic: false,
          pro: false,
          premium: true,
          enterprise: true
        }
      },
      {
        title: 'Custom Branding',
        plans: {
          basic: false,
          pro: false,
          premium: false,
          enterprise: true
        }
      }
    ]
  };

  const renderPlanInfo = (type, info) => (
    <Fragment>
      <h3 className="text-lg text-gray-900 font-medium pb-2 justify-center">{info.title}</h3>
    </Fragment>
  );

  const renderFeatureDetail = (detail) => {
    if (typeof detail === 'boolean') {
      return detail ? <KeenIcon icon="check" className="text-success text-lg" /> : null;
    }
    return <div className="text-gray-800 text-2sm">{detail}</div>;
  };

  const renderItem = (feature, index) => {
    return (
      <tr key={index}>
        <td className="table-border-s !px-5 !py-3.5">
          <div className="text-gray-900 text-2sm leading-none font-medium">{feature.title}</div>
        </td>
        <td className="table-border-s !px-5 !py-3.5">
          <div className="text-gray-800 text-2sm">{renderFeatureDetail(feature.plans.basic)}</div>
        </td>
        <td className="table-border-s !px-5 !py-3.5">{renderFeatureDetail(feature.plans.pro)}</td>
        <td className="table-border-s !px-5 !py-3.5">
          {renderFeatureDetail(feature.plans.premium)}
        </td>
        <td className="table-border-s !px-5 !py-3.5">
          {renderFeatureDetail(feature.plans.enterprise)}
        </td>
      </tr>
    );
  };

  return (
    <div className="mt-1" id="medicalPlans">
      <div className="scrollable-x-auto pt-3 -mt-3">
        <table className="table table-fixed min-w-[1000px] table-border-b table-border-e table-rounded card-rounded">
          <thead>
            <tr>
              <th className="!border-b-0 align-bottom w-1/4 p-3">Plan</th>
              <th className="!border-b-0 align-bottom w-1/4 p-3">Basic</th>
              <th className="!border-b-0 align-bottom w-1/4 p-3">Pro</th>
              <th className="!border-b-0 align-bottom w-1/4 p-3">Premium</th>
              <th className="!border-b-0 align-bottom w-1/4 p-3">Enterprise</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="!border-b-0 align-bottom"></td>
              <td className="!border-b-0 table-border-s table-border-t card-rounded-tl bg-light-active dark:bg-coal-100 !p-5 !pt-7.5 relative">
                {renderPlanInfo('basic', plans.info.basic)}
              </td>
              <td className="!border-b-0 table-border-s table-border-t !p-5 !pt-7.5">
                {renderPlanInfo('pro', plans.info.pro)}
              </td>
              <td className="!border-b-0 table-border-s table-border-t !p-5 !pt-7.5">
                {renderPlanInfo('premium', plans.info.premium)}
              </td>
              <td className="!border-b-0 table-border-s table-border-t card-rounded-tr !p-5 !pt-7.5">
                {renderPlanInfo('enterprise', plans.info.enterprise)}
              </td>
            </tr>
            <tr>
              <td className="!border-b-0 align-bottom" colSpan="5">
                {/* Accordion Trigger */}
                <button
                  className="text-blue-500 font-semibold flex items-center"
                  onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                >
                  <span className="ml-2 text-lg mr-2">
                    {isAccordionOpen ? '-' : '+'}
                  </span>
                  <span>Accordion</span>
                </button>
                {/* Accordion content */}
                {isAccordionOpen && (
                  <div className="mt-4 border-gray-300 rounded bg-gray-100">
                    <table className="table table-fixed min-w-[1000px] table-border-b table-border-e table-rounded card-rounded">
                      <tbody>
                        {plans.features.map((feature, index) => renderItem(feature, index))}
                      </tbody>
                    </table>
                  </div>
                )}
              </td>
            </tr>
            {plans.features.map((feature, index) => renderItem(feature, index))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export  default Plans;             
