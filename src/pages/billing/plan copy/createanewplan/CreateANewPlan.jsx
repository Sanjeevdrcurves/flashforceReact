// src/pages/billing/plan/createanewplan/CreateANewPlan.jsx
import React, { useState } from 'react';
import { Fragment } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toolbar, ToolbarActions, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { PageNavbar } from '@/pages/account';
import { PermissionsToggle,PlanDetails,MedicalPlans } from './blocks';


const CreateANewPlan = () => {


  return (
    <Fragment>     
      <PageNavbar />  
       <div className="container-fixed" id='createnewplan'>
      
        <Toolbar>
            <ToolbarHeading>
               <h1 className="text-xl font-medium leading-none text-gray-900">Create A New Plans</h1>
              <div class="flex items-center gap-2 text-sm font-normal text-gray-700"><div class="flex items-center gap-2 text-sm font-medium"><span class="text-gray-800 font-medium">Innovative strategy for effective execution</span></div></div>
            </ToolbarHeading>
            <ToolbarActions>
              
              </ToolbarActions>
          </Toolbar>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-7.5">
      <div className="col-span-1">
      <PlanDetails/>
</div>
      <div className="col-span-1">
        <div className="grid gap-5 lg:gap-7.5">
            <PermissionsToggle />
        </div>
      </div>

    </div>
    <div className="grid gap-5 lg:gap-7.5">
    <div className="scrollable-x-auto pt-3 -mt-3">

    <MedicalPlans/>
    </div>
    </div>
         </div>
      </Fragment>
  );
}

export default CreateANewPlan;
