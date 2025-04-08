import React, { useState, useEffect } from 'react';
import { Fragment } from 'react';
import { PageNavbar } from '@/pages/account';
import { Link } from 'react-router-dom';
import { AuthTwoFactor, AdvancedSettingsNotifications, AdvancedSettingsAppearance, PersonalInfo, BasicSettings, OtherNotifications, Channels} from './blocks';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import PersonalInformation from '../../drcurves/PersonalInformation';
const UserPreferencePage = () => {

  return (
    <Fragment>
    <PageNavbar />
     <div className="container-fixed" id='user_prefrences'>
      
       <Toolbar>
            <ToolbarHeading>
              <h1 className="text-xl font-medium leading-none text-gray-900">User Preferences Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">
              Effortless organization for streamlined operations.
            </p>
            </ToolbarHeading>
          </Toolbar>
   
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-7.5">
      <div className="col-span-1">
        <div className="grid gap-5 lg:gap-7.5">
      
          <PersonalInformation title="Personal Info" />

          <AdvancedSettingsNotifications />
        </div>
      </div>

      <div className="col-span-1">
        <div className="grid gap-5 lg:gap-7.5">
           <BasicSettings title="Basic Settings" />
 <OtherNotifications />
        </div>
      </div>

    </div>
    <div className="mt-5">     <AdvancedSettingsAppearance title="Theme" />  </div>
 <div className="mt-5"><AuthTwoFactor /></div>
    </div>
    </Fragment>

  );
};

export default UserPreferencePage;
