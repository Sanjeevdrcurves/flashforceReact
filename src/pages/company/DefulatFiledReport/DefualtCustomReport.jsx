import React, { Fragment, useEffect, useState } from "react";
import { PageNavbar } from "@/pages/account";
import { KeenIcon } from "@/components";
import { Toolbar, ToolbarHeading,ToolbarActions } from "@/partials/toolbar";
import { Link } from "react-router-dom";
import { SidePopover } from "../../../components/SidePopover/sidepopover";
import CustomFormManager from "../CustomFileds/AddObject";
import AddObjectType from "./AddobjectType";
import DefaultObjectTable from "./DefualtObjectTable";
import CustomReportTable from "./customReportTable";


const DefaultCustomReport = () => {
 const[showAddfileds,setshowAddfileds]=useState(false);
 const[showobjectType,setshowobjectType]=useState(false)
  return (
    <Fragment>
      <div className="container mx-auto px-4 py-6">
        <Toolbar>
          <ToolbarHeading>
            <h1 className="text-xl font-medium text-gray-900">
             Manage Custom Fields of Object and Object types
            </h1>
            <p className="text-sm text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </ToolbarHeading>
          <ToolbarActions>
                   
                    {/* <Link onClick={()=>{setshowAddfileds(true)}} className="btn btn-sm btn-light">
                      <KeenIcon icon="exit-down" />
                      Add object
                    </Link> */}
                   
                   
                  </ToolbarActions>
        </Toolbar>

<CustomReportTable />  

      </div>
        <SidePopover isDrawerOpen={showAddfileds} title={'Add Fields'} onClose={() => setshowAddfileds(false)}>
              <CustomFormManager />
            </SidePopover>
    
      
    </Fragment>
  );
};

export default DefaultCustomReport;
