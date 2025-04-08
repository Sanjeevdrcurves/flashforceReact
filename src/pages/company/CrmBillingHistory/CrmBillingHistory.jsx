import React, { Fragment } from "react";
import { PageNavbar } from "@/pages/account";
import { KeenIcon } from "@/components";
import { Toolbar, ToolbarHeading,ToolbarActions } from "@/partials/toolbar";
import {    AddOnShowcase, CrmBillingTabel } from "./blocks";
import { PaymentMethods } from "./blocks/PaymentMetod";

const CrmBillingHistory = () => {

  return (
    <Fragment>
      <PageNavbar />
      <div className="container mx-auto px-4 py-6">
        <Toolbar>
          <ToolbarHeading>
            <h1 className="text-xl font-medium text-gray-900">
             CRM Feature Billing Marketplace
            </h1>
            <p className="text-sm text-gray-700">
             Enhance Workflow with Advance Integrations
            </p>
          </ToolbarHeading>
        
        </Toolbar>
  <CrmBillingTabel/>
  <PaymentMethods/>
  <AddOnShowcase/>

     </div>
    </Fragment>
  );
};

export default CrmBillingHistory;