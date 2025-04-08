// src/pages/billing/plan/createplan/CreatePlan.jsx
import React from 'react';
import { Fragment } from 'react';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { PageNavbar } from '@/pages/account';
import { Summary } from './blocks';
const CreatePlan = () => {
  return (
      <Fragment>     
      <PageNavbar />  
       <div className="container-fixed" id='createPlan'>
      
       <Toolbar>
            <ToolbarHeading>
              <h1 className="text-xl font-medium leading-none text-gray-900">Create New Plan</h1>
              <div class="flex items-center gap-2 text-sm font-normal text-gray-700"><div class="flex items-center gap-2 text-sm font-medium"><span class="text-gray-800 font-medium">Innovative strategy for effective execution</span></div></div>
            </ToolbarHeading>
          </Toolbar>
          </div>
          <Summary />
      </Fragment>
  );
};

export default CreatePlan;
