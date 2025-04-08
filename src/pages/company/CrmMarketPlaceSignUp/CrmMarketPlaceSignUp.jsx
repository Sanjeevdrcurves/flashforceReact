import React, { Fragment } from "react";
import { useState, useEffect } from 'react';
import { InfoCardsSignUp } from "./blocks/InfoCardsSignUp";
import { Link, useLocation, useNavigate } from 'react-router-dom';
const CrmMarketPlaceSignUp = () => {
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { planId, planName, planPrice, planSub, isAnnual } = location.state || {};
  useEffect(() => {
    if(!planId || parseInt(planId)==0){
      navigate('/billing/plan/organizationalplans', { replace: false });
    }
  }, []);

  var productDetails = {
    planId: planId,
    planName: planName,
    planPrice: planPrice,
    planSub: planSub,
    chargeType: "NEW_USER",
    selectedAddOns: selectedAddOns
  }
  return (
    <Fragment>
      <div className="container mx-auto px-4 py-6">
        
        <InfoCardsSignUp selectedAddOns={selectedAddOns} setSelectedAddOns={ setSelectedAddOns}/>
        <div className="text-center mt-5">
          {/* <a onClick={()=>{navigate('/billing/plan/SignUp',{ state: { planId, planName, planPrice, planSub, isAnnual, productDetails } })}}
            className="btn btn-primary">
              <i className="ki-duotone ki-double-right fs-1"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span></i>
            Proceed
          </a> */}
          <a onClick={()=>{navigate('/billing/plan/SignUp',{ state: {isAnnual, productDetails } })}}
            className="btn btn-primary">
              <i className="ki-duotone ki-double-right fs-1"><span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span></i>
            Proceed
          </a>
        </div>
        

      </div>
    </Fragment>
  );
};

export default CrmMarketPlaceSignUp;