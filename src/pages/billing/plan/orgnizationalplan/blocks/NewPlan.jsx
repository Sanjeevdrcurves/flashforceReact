import React, { useState } from "react";
import PricingCard from "./PriceCard";

const Pricing = ({ plans, plansfeatures }) => {
  const [isYearly, setIsYearly] = useState(true); // Default to yearly

  const handleToggle = () => {
    setIsYearly(!isYearly);
  };

  return (
    <section className="relative z-10 overflow-hidden bg-white pb-12 dark:bg-dark lg:pb-[90px] lg:pt-[10px]">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto mb-[20px] max-w-[510px] text-center">
              <span className="mb-2 block text-lg font-semibold text-primary">
                Pricing Tables
              </span>

              {/* Toggle Switch for Monthly/Yearly */}
              <div className="flex justify-center items-center space-x-4">
                <span className={!isYearly ? "font-bold text-primary" : ""}>
                  Monthly
                </span>
                <button
                  onClick={handleToggle}
                  className="relative w-14 h-7 bg-gray-300 rounded-full p-1 flex items-center transition-all"
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                      isYearly ? "translate-x-7" : "translate-x-0"
                    }`}
                  ></div>
                </button>
                <span className={isYearly ? "font-bold text-primary" : ""}>
                  Yearly
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="-mx-4  flex-wrap justify-center">
          <div className="-mx-4 flex flex-wrap">
            {Object.keys(plans || {}).map((res) => (
              <PricingCard
                key={res}
                plandata={plans}
                planfeaturedata={plansfeatures}
                type={plans?.[res]?.title}
                price = {
                  isYearly
                    ? plans?.[res]?.yearlyAmount > 0
                      ? `${plans?.[res]?.yearlyAmount.toLocaleString()}`
                      : "Free"
                    : plans?.[res]?.monthlyAmount > 0
                    ? `${plans?.[res]?.monthlyAmount.toLocaleString()}`
                    : "Free"
                }                
                subscription={
                  isYearly
                    ? plans?.[res]?.yearlyAmount > 0
                      ? `Yearly`
                      : "Yearly: Free"
                    : plans?.[res]?.monthlyAmount > 0
                    ? `Monthly`
                      : "Monthly: Free"
                }
                description={plans?.[res]?.description}
                buttonText="Start Now"
                popuptext="See All Features"
                planId={plans?.[res]?.planId}
                isAnnual={isYearly}
              >
                <List>
                  Total Seats:{" "}
                  {plansfeatures?.[4]?.plans?.[res] > 999
                    ? "Unlimited"
                    : plansfeatures?.[4]?.plans?.[res]}
                </List>
                <List>
                  Free Trial Period:{" "}
                  {plans?.[res]?.freePeriod > 0
                    ? `${plans?.[res]?.freePeriod} days`
                    : "0 day"}
                </List>
                <List>
                  Contacts:{" "}
                  {plansfeatures?.[0]?.plans?.[res] > 999
                    ? "Unlimited"
                    : plansfeatures?.[0]?.plans?.[res]}
                </List>
              </PricingCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const List = ({ children }) => {
  return <p className="text-base text-body-color dark:text-dark-6">{children}</p>;
};

export default Pricing;
