import React from "react";
import PricingCard from "./PriceCard";

const Pricing =({ plans,plansfeatures }) => {

    
    Object.keys(plans || {}).map((res)=>{
console.log("plans are: "+res);

    })
    
  
    
  return (
    <section className="relative z-10 overflow-hidden bg-white pb-12  dark:bg-dark lg:pb-[90px] lg:pt-[10px]">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto mb-[60px] max-w-[510px] text-center">
              <span className="mb-2 block text-lg font-semibold text-primary">
                Pricing Table
              </span>
               
            </div>
          </div>
        </div>

        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="-mx-4 flex flex-wrap">
            {
                Object.keys(plans || {}).map((res)=>(
                  <PricingCard
                  key={res}
                  plandata={plans}
                  planfeaturedata={plansfeatures}
                  type={plans?.[res]?.title}
                  price={plans?.[res]?.yearlyAmount>0?plans?.[res]?.yearlyAmount:'Free'} 
                  subscription="year"
                  description={plans?.[res]?.description}
                  buttonText="start now"
                  popuptext="See all features"
                  planId={plans?.[res]?.planId}
                >
                  <List>Total Seats : {plans?.[res].totalSeats>0?plans?.[res].totalSeats:'Unlimited'}</List>
                  <List>FreeTrailPeriod : {plans?.[res].freeTrailPeriod>0?plans?.[res].freeTrailPeriod:'15'} </List>
                  <List>Contacts :  {plans?.[res].contacts>0?plans?.[res].contacts:'0'}</List>
                  <List>FreeTrailPeriod :  {plans?.[res].freeTrailPeriod>0?plans?.[res].freeTrailPeriod:'0'}</List>
                 
                </PricingCard>
                )
             
                  
                )
            }
           
            {/* <PricingCard
              type="Business"
              price="$199"
              subscription="year"
              description="Perfect for using in a personal website or a client project."
              buttonText="Choose Business"
              active
            >
              <List>5 User</List>
              <List>All UI components</List>
              <List>Lifetime access</List>
              <List>Free updates</List>
              <List>Use on31 (Three) project</List>
              <List>4 Months support</List>
            </PricingCard>
            <PricingCard
              type="Professional"
              price="$256"
              subscription="year"
              description="Perfect for using in a personal website or a client project."
              buttonText="Choose Professional"
            >
              <List>Unlimited User</List>
              <List>All UI components</List>
              <List>Lifetime access</List>
              <List>Free updates</List>
              <List>Unlimited project</List>
              <List>12 Months support</List>
            </PricingCard> */}
            
          </div>
        </div>
      </div>




      
    </section>



  );
};
const List = ({ children }) => {
  return (
    <p className="text-base text-body-color dark:text-dark-6">{children}</p>
  );
};


export default Pricing;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         