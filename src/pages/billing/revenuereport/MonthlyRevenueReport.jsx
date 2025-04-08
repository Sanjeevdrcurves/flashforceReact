import React, { useState, useEffect } from 'react';
import { Fragment } from 'react';
import { PageNavbar } from '@/pages/account';
import { Users } from './blocks/users';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { Summary } from './blocks';
import { GenerateReport } from './blocks';
const MonthlyRevenueReport = () => {
  
    return (
         <Fragment>
    <PageNavbar />   
    <div className="container-fixed" id='MonthlyRevenueReport'>
      
       <Toolbar>
            <ToolbarHeading>
              <h1 className="text-xl font-medium leading-none text-gray-900">Monthly Revenue Report</h1>
              <div class="flex items-center gap-2 text-sm font-normal text-gray-700"><div class="flex items-center gap-2 text-sm font-medium"><span class="text-gray-800 font-medium">Advanced Billing Solutions for Large Businesses</span></div></div>
            </ToolbarHeading>
          </Toolbar>
<div>
<GenerateReport /> </div>

<div><Summary /></div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-7.5 mt-5">
      <div className="col-span-1">
       <Users />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-7.5">
       2
      </div>
      </div>

</div>

    </Fragment>
    );
};

export default MonthlyRevenueReport;
