import React, { Fragment, useEffect, useState } from "react";
import { PageNavbar } from "@/pages/account";
import { KeenIcon } from "@/components";
import { Toolbar, ToolbarHeading,ToolbarActions } from "@/partials/toolbar";
import { Link } from "react-router-dom";
import { CustomTabel } from "./block/CustomTabel";
import { SidePopover } from "../../../components/SidePopover/sidepopover";
import AddCustomFiled from "./block/AddCustomField";

const CustomReport = () => {
 const[showAddfileds,setshowAddfileds]=useState(false);
  return (
    <Fragment>
      <div className="container mx-auto px-4 py-6">
        <Toolbar>
          <ToolbarHeading>
            <h1 className="text-xl font-medium text-gray-900">
             Manage Custom Fields
            </h1>
            <p className="text-sm text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </ToolbarHeading>
          <ToolbarActions>
                    <Link to={'/account/home/get-started'} className="btn btn-sm btn-light">
                      <KeenIcon icon="exit-down" />
                     Import CSV
                    </Link>
                    {/* <Link onClick={()=>{setshowAddfileds(true)}} className="btn btn-sm btn-light">
                      <KeenIcon icon="exit-down" />
                      Add Fields
                    </Link> */}
                   
                  </ToolbarActions>
        </Toolbar>

<CustomTabel/>    
      </div>
      <SidePopover isDrawerOpen={showAddfileds} title={'Add Fields'} onClose={()=>{setshowAddfileds(false)}}>
    <AddCustomFiled/>
      </SidePopover>
    </Fragment>
  );
};

export default CustomReport;
