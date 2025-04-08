import React, { Fragment } from "react";
import { PageNavbar } from "@/pages/account";
import { KeenIcon } from "@/components";
import { Toolbar, ToolbarHeading,ToolbarActions } from "@/partials/toolbar";
import { InfoCards } from "./blocks/InfoCards";
const CrmMarketPlace = () => {

  return (
    <Fragment>
      <PageNavbar />
      <div className="container mx-auto px-4 py-6">
        <Toolbar>
          <ToolbarHeading>
            <h1 className="text-xl font-medium text-gray-900">
             CRM Feature Marketplace
            </h1>
            <p className="text-sm text-gray-700">
             Enhance Workflow with Advance Integrations
            </p>
          </ToolbarHeading>
          <ToolbarActions>
              
              <a href="configureaddonsetting" className="btn btn-sm btn-primary">
                Create Adds on
              </a>
            </ToolbarActions>
        </Toolbar>

<InfoCards/>

      </div>
    </Fragment>
  );
};

export default CrmMarketPlace;