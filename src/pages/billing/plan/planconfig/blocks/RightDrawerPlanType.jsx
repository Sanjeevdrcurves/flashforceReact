import React, { useState, useEffect } from 'react';
import './RightDrawer.css'; // Make sure to save your provided CSS in this file.
import { PermissionsToggle,PlanDetails } from '.';
import { PlanType } from './PlanType';

const RightDrawerPlanType = ({pCategories, selectedPCategory, handlePCategoryChange,
  pCategoriesTypes, selectedPCatType, handlePCatTypeChange,setUpdateMasterPlanId,
  selectedFeatures, handleFetchFlag, updateMasterPlanId, updateMasterPlan,setPFeatures,

  pFeatures, handlePFeatureToggleChange
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const[isClear,setisClear]=useState(false)

  const openDrawer = () => {
    //setIsDrawerOpen(!isDrawerOpen);
    setIsDrawerOpen(true);
    setUpdateMasterPlanId(0);
    setisClear(true);
  };

  const closeDrawer = () => {
    //updateMasterPlanId = null;
    setIsDrawerOpen(false);
    // setisClear(true);
  };

  useEffect(() => {
    if(updateMasterPlanId)
    {
      setIsDrawerOpen(true);
    }
  }, [updateMasterPlanId]);

  return (
    <div>
      {/* Button to Toggle Drawer */}
      <button className="btn btn-primary" onClick={openDrawer}>
        {'Create Category Type' }
      </button>

      {/* Drawer */}
      <div className={`plan-right-drawer ${isDrawerOpen ? 'open' : ''}`}>
        <div className="plan-drawer-header">
          <h4><b>Plan Category</b></h4>
          <button className="btn btn-light" onClick={closeDrawer}>
            &times;
          </button>
        </div>
        <div className="plan-drawer-body">
          {/* <CreateBackupItems/> */}
          
          <div className="grid grid-cols-1 xl:grid-cols-1 gap-5 lg:gap-7.5">
            <div className="col-span-1">
              <PlanType isDrawerOpen={isDrawerOpen}  />
            </div>
            {/* <div className="col-span-1">
              <div className="grid gap-5 lg:gap-7.5"> 
                  <PermissionsToggle isClear={isClear} setPFeatures={setPFeatures} selectedFeatures={selectedFeatures} features={pFeatures} featureToggleChangeHandler={(e) => handlePFeatureToggleChange(e)}/>
              </div>
            </div> */}
          </div>
        </div>
        {/* <div className="drawer-footer">
          <div class="flex justify-end"><button class="btn btn-primary">Create Plan</button></div>
        </div> */}

      </div>
    </div>
  );
};
export { RightDrawerPlanType };

