import React, { Fragment, useEffect, useState } from "react";
import { PageNavbar } from "@/pages/account";
import { KeenIcon } from "@/components";
import { Toolbar, ToolbarHeading } from "@/partials/toolbar";
import { CommonHexagonBadge } from "@/partials/common";
import { SecurityLog } from "./blocks";
import axios from "axios"; // You can use axios for API calls
import { useSelector } from 'react-redux';


const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
const DataLossModule = () => {
  
      const {userId, companyId} = useSelector(state => state.AuthReducerKey);
  const [cardData, setCardData] = useState([
    { icon: "dollar", value: "$0", description: "Critical Alerts" },
    { icon: "cheque", value: "$0", description: "Medium Alerts" },
    { icon: "people", value: "$0", description: "High Alerts" },
    { icon: "people", value: "$0", description: "Low Alerts" },
  ]);

  useEffect(() => {
    // Fetch the data from the API
    axios
      .get(`${API_URL}/PolicyAssignment/GetDataLossPreventionLogsByCompanyId/${companyId}`)
      .then((response) => {
        const { criticalAlerts, mediumAlerts, highAlerts, lowAlerts } = response.data[0];

        // Set the data for the cards
        setCardData([
          { icon: "people", value: `${criticalAlerts}`, description: "Critical Alerts" },
          { icon: "people", value: `${mediumAlerts}`, description: "Medium Alerts" },
          { icon: "people", value: `${highAlerts}`, description: "High Alerts" },
          { icon: "people", value: `${lowAlerts}`, description: "Low Alerts" },
        ]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // The empty array ensures the effect runs only once when the component mounts

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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 lg:gap-2">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-1.5 rounded-md px-2.5 py-2 shrink-0 min-w-24 max-w-auto"
            >
              <div className="card rounded-xl">
                <div className="flex items-center justify-between grow gap-5 p-5 rtl:bg-[center_left_-8rem] bg-[center_right_-8rem] bg-no-repeat bg-[length:700px] upgrade-bg">
                  <div className="flex items-center gap-4">
                    <CommonHexagonBadge
                      stroke="stroke-primary-clarity"
                      fill="fill-primary-light"
                      size="size-[50px]"
                      badge={
                        <KeenIcon icon={card.icon} className="text-1.5xl text-primary" />
                      }
                    />
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2.5">
                        <a
                          href="#"
                          className="text-base font-medium text-gray-900 hover:text-primary-active"
                        >
                          <h2>{card.value}</h2>
                        </a>
                      </div>
                      <div className="text-2sm text-gray-700">
                        <b>{card.description}</b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <SecurityLog />
      </div>
    </Fragment>
  );
};

export default DataLossModule;
