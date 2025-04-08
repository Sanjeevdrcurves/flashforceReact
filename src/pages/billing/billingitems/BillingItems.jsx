import React, { useState, useEffect } from 'react';
import { Fragment } from 'react';
import { PageNavbar } from '@/pages/account';
import { Toolbar, ToolbarActions, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { InvoiceItems } from './blocks';


const BillingItems = () => {
  return (
  <Fragment>
    <PageNavbar />
     <div className="container-fixed">
      
       {/* <Toolbar>
            <ToolbarHeading>
              <h1 className="text-xl font-medium leading-none text-gray-900">Billing Enterprise</h1>
               <div class="flex items-center gap-2 text-sm font-normal text-gray-700" id='BillingEnterprisePage'><div class="flex items-center gap-2 text-sm font-medium"><span class="text-gray-800 font-medium">Advanced Billing Solutions for Large Businesses</span></div></div>
            </ToolbarHeading>
              <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Order History
              </a>
            </ToolbarActions>
          </Toolbar> */}
   <div className="col-span-2">
        {/* <Upgrade /> */}
      </div>
     <div class="mt-8"> <Toolbar><ToolbarHeading>
              <h1 className="text-xl font-medium leading-none text-gray-900">Billing Product</h1>
               <div class="flex items-center gap-2 text-sm font-normal text-gray-700"><div class="flex items-center gap-2 text-sm font-medium"><span class="text-gray-800 font-medium">Central Hub for Personal Customization</span></div></div>
            </ToolbarHeading> </Toolbar></div>
    <div className="col-span-2">
     <InvoiceItems />

      <div className="col-span-1">
        <div className="grid gap-5 lg:gap-7.5">
         
        </div>
      </div>

    </div>
    <div className="mt-5">     </div>
 <div className="mt-5"></div>
    </div>
    </Fragment>
  );
};

export default BillingItems;
