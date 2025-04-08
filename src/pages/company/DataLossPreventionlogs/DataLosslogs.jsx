import React, { Fragment } from "react";
import { PageNavbar } from "@/pages/account";
import { KeenIcon } from "@/components";
import { Toolbar, ToolbarHeading } from "@/partials/toolbar";
import { CommonHexagonBadge } from '@/partials/common';
import { SecurityLog } from "./blocks";

const DataLossLogs = () => {
  const cardData = [
    {
      icon: "dollar",
      value: "$1000",
      description: "Critical Alerts",
    },
    {
      icon: "cheque",
      value: "$1000",
      description: "Medium Alerts",
    },
    {
      icon: "people",
      value: "$1000",
      description: "High Alerts",
    },
    {
      icon: "people",
      value: "$1000",
      description: "Low Alerts",
    },
  ];
  return (
    <Fragment>
      <PageNavbar />
      <div className="container mx-auto px-4 py-6">
        <Toolbar>
          <ToolbarHeading>
            <h1 className="text-xl font-medium text-gray-900">
              Data Loss & Prevention Module
            </h1>
            <p className="text-sm text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </ToolbarHeading>
        </Toolbar>
    
<SecurityLog/>
      </div>
    </Fragment>
  );
};

export default DataLossLogs;
