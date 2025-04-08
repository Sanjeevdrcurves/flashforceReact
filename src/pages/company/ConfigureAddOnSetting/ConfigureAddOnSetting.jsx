import React, { Fragment } from "react";
import { PageNavbar } from "@/pages/account";
import { KeenIcon } from "@/components";
import { Toolbar, ToolbarHeading,ToolbarActions } from "@/partials/toolbar";
import ConfigureaddonForm from "./blocks/configureaddonForm";

const ConfigureAddOnSetting = () => {

  return (
    <Fragment>
      <PageNavbar />
      <div className="container mx-auto px-4 py-6">
        <Toolbar>
          <ToolbarHeading>
            <h1 className="text-xl font-medium text-gray-900">
             Configure Add-On Settings Creations
            </h1>
            <p className="text-sm text-gray-700">
             Enhance Workflow with Advance Integrations
            </p>
          </ToolbarHeading>
         
        </Toolbar>
<ConfigureaddonForm/>
      </div>
    </Fragment>
  );
};

export default ConfigureAddOnSetting;