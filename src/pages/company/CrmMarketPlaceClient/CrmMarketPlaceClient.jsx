import React, { Fragment } from "react";
import { PageNavbar } from "@/pages/account";
import { KeenIcon } from "@/components";
import { Toolbar, ToolbarHeading,ToolbarActions } from "@/partials/toolbar";
import { InfoCardsClient } from "./blocks/InfoCardsClient";
import { toast } from 'sonner';
const CrmMarketPlaceClient = () => {

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
              
              
            </ToolbarActions>
        </Toolbar>

<InfoCardsClient toast={toast}/>

      </div>
    </Fragment>
  );
};

export default CrmMarketPlaceClient;