import React from 'react';
import { Fragment } from 'react';
import { PageNavbar } from '@/pages/account';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { MiscFaq, MiscHighlightedPosts } from '@/partials/misc';
import { Backup, BackupSettings } from './blocks';
import { SecurityLog } from './blocks';
import { RightDrawer } from './blocks';

const DataBackupDisasterRecovery = () => {
   const posts = [{
    icon: 'book',
    title: 'Securing Data Integrity: Backup Recovery Systems',
    summary: 'Safeguard your data with our resilient backup recovery solutions. Detailed guides and expert strategies provide the roadmap to robust data protection and swift recovery.',
    path: '#'
  }];
  return (
  <Fragment>
    <PageNavbar />
     <div className="container-fixed">
      
       <Toolbar>
            <ToolbarHeading>
              <h1 className="text-xl font-medium leading-none text-gray-900">Databackup & Disaster Recovery</h1>
              <div class="flex items-center gap-2 text-sm font-normal text-gray-700"><div class="flex items-center gap-2 text-sm font-medium"><span class="text-gray-800 font-medium">Secure data backup, swift recovery.</span></div></div>
            </ToolbarHeading>
           <RightDrawer />
          </Toolbar>
   
   <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-7.5">
      <div className="col-span-2">
        <div className="flex flex-col gap-5 lg:gap-7.5">
          <Backup />

         
        </div>
      </div>

      <div className="col-span-1">
        <div className="flex flex-col gap-5 lg:gap-7.5">
          <BackupSettings />

          <MiscHighlightedPosts posts={posts} />
        </div>
      </div>
    </div>
    <div className="mt-10">
     <Toolbar>
            <ToolbarHeading>
              <h1 className="text-xl font-medium leading-none text-gray-900">Backup Logs</h1>
              <div class="flex items-center gap-2 text-sm font-normal text-gray-700"><div class="flex items-center gap-2 text-sm font-medium"><span class="text-gray-800 font-medium">Secure data backup, swift recovery.</span></div></div>
            </ToolbarHeading>
          </Toolbar>

          </div>
    <div className="grid gap-5 lg:gap-7.5">
      <SecurityLog />
   </div>
     
    </div>
    </Fragment>
  );
};

export default DataBackupDisasterRecovery;
