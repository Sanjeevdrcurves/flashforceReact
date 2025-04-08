import React, { Fragment } from "react";
import { PageNavbar } from "@/pages/account";
import { KeenIcon } from "@/components";
import { Toolbar, ToolbarHeading } from "@/partials/toolbar";
import { GeneralSettings, NotificationSetting, PolicyManagement, UserManagement } from "./blocks";

const DataPreventionSetting = () => {

  return (
    <Fragment>
      <PageNavbar />
      <div className="container mx-auto px-4 py-6">
        <Toolbar>
          <ToolbarHeading>
            <h1 className="text-xl font-medium text-gray-900">
              Data Loss & Prevention Setting Module
            </h1>
            <p className="text-sm text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </ToolbarHeading>
        </Toolbar>

        <GeneralSettings/>
        <PolicyManagement/>
        <UserManagement/>
        <NotificationSetting/>
      </div>

    </Fragment>
  );
};

export default DataPreventionSetting;