import React from 'react';
import { Fragment } from 'react';
import { PageNavbar } from '@/pages/account';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { Users } from './blocks/users';
import { Visitors } from './blocks/visitors';
const EncryptionSettings = () => {
  return (
  <Fragment>
    <PageNavbar />
     <div className="container-fixed" id='EncryptionSettings'>
      
       <Toolbar>
            <ToolbarHeading>
              <h1 className="text-xl font-medium leading-none text-gray-900">Encryption Settings</h1>
              <div class="flex items-center gap-2 text-sm font-normal text-gray-700"><div class="flex items-center gap-2 text-sm font-medium"><span class="text-gray-800 font-medium">Configuration options that enable secure encoding of data</span></div></div>
            </ToolbarHeading>
          </Toolbar>
   
   <div className="grid gap-5 lg:gap-7.5">
      
<Users />
 <Visitors />
      

    </div>
   
    </div>
    </Fragment>
  );
};

export default EncryptionSettings;
