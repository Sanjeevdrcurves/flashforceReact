import React from 'react';
import { Fragment, useState } from 'react';
import { PageNavbar } from '@/pages/account';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { MiscFaq, MiscHighlightedPosts } from '@/partials/misc';
import { Backup, BackupSettings } from './blocks';
import { SecurityLog } from './blocks';
import { RightDrawer } from './blocks';
import axios from 'axios';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const DataBackupDisasterRecovery = () => {

  const [backupSchedArr, setBackupSched] = useState(null);
  const fetchBackupsSched = async () => {
    var nietos = [];
    try {
      const response = await axios.get(`${API_URL}/BackupSchedule/GetAllBackupSchedules`);
      console.log('fetchBackups: '+response.data);
      const backupsSchedArr = response.data;
      if(backupsSchedArr && backupsSchedArr.length){
        backupsSchedArr.map((backupSched, index) => {
          var LastRun = 'Not Run', Duration='N/A', PagesCount=0, MediaCount=0, TablesCount=0;
          if(backupSched.lastRun){
            let date = new Date(backupSched.lastRun);
            LastRun = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(date);
            Duration = calculateTimeDifference(backupSched.lastRun);
          }
          if(backupSched.pagesCount)
            PagesCount = backupSched.pagesCount;
          if(backupSched.mediaCount)
            MediaCount = backupSched.mediaCount;
          if(backupSched.tablesCount)
            TablesCount = backupSched.tablesCount;

          var obj = {
            when: {
              duration: Duration,
              datetime: LastRun
            },
            details: {
              title: backupSched.scheduleName,
              pages: PagesCount,
              media: MediaCount,
              tables: TablesCount
            }
          }
          nietos.push(obj);
        });
      }
      setBackupSched(nietos);
      
    } catch (error) {
      console.error('Error fetching backups:', error);
    }
  };

  const insertBackupSchedule = async (selectedItems, txtSchedulerName) => {
    const dte = getCurrentDateInISOFormat();
    //const url = 'http://localhost:5078/api/BackupSchedule/InsertBackupSchedule';
    const headers = {
      'accept': 'text/plain',
      'Authorization': 'Basic ZHJjdXJ2ZXM6ZHJDdXJ2ZXMjIUBAQA==',
      'Content-Type': 'application/json'
    };
    const data = {
      backupScheduleId: 0,
      scheduleName: txtSchedulerName,
      frequency: "0",
      startTime: dte,
      backupType: "manual",
      storageLocation: "FlashForce_db",
      isActive: true,
      createBy: "anas",
      createDate: dte,
      isDelete: false,
      modifiedBy: null,
      modifiedDate: null,
      tablesCount: 0,
      pagesCount: 0,
      mediaCount: 0,
      lastRun: null
    };
  
    try {
      const response = await axios.post(`${API_URL}/BackupSchedule/InsertBackupSchedule`, data, { headers });
      console.log('Response:', response.data);
      fetchBackupsSched();
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  const updateBackupSchedule = async (selectedItems, txtSchedulerName) => {
    //const url = 'http://localhost:5078/api/BackupSchedule/UpdateBackupSchedule';
    const headers = {
      'accept': '*/*',
      'Authorization': 'Basic ZHJjdXJ2ZXM6ZHJDdXJ2ZXMjIUBAQA==',
      'Content-Type': 'application/json'
    };
    const data = {
      backupScheduleId: 1,
      scheduleName: "MANUAL_BACKUP_TABLE",
      frequency: "0",
      startTime: "2024-12-24T15:35:34.660Z",
      backupType: "manual",
      storageLocation: "FLASHFORCE_DB",
      isActive: true,
      createBy: "anas",
      createDate: "2024-12-24T15:35:34.660Z",
      isDelete: true,
      modifiedBy: null,
      modifiedDate: null,
      tablesCount: 0,
      pagesCount: 0,
      mediaCount: 0,
      lastRun: "2024-12-24T15:35:34.660Z"
    };
  
    try {
      const response = await axios.put(`${API_URL}/BackupSchedule/UpdateBackupSchedule`, data, { headers });
      debugger;
      console.log('Response:', response.data);
      fetchBackupsSched();
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  const getCurrentDateInISOFormat = () => {
    const currentDate = new Date();
    return currentDate.toISOString();
  };
  
  function calculateTimeDifference(pastDate) {
    const now = new Date();
    const past = new Date(pastDate);

    if (isNaN(past.getTime())) {
        return "Invalid date format.";
    }

    const diffInMilliseconds = now - past;

    if (diffInMilliseconds < 0) {
        return "The provided date is in the future.";
    }

    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute(s) ago`;
    } else if (diffInHours < 24) {
        return `${diffInHours} hour(s) ago`;
    } else {
        return `${diffInDays} day(s) ago`;
    }
  }
   const posts = [{
    icon: 'book',
    title: 'Securing Data Integrity: Backup Recovery Systems',
    summary: 'Safeguard your data with our resilient backup recovery solutions. Detailed guides and expert strategies provide the roadmap to robust data protection and swift recovery.',
    path: '#'
  }];
  return (
  <Fragment>
    <PageNavbar />
     <div className="container-fixed" id='DataBackupDisasterRecovery'>
      
       <Toolbar>
            <ToolbarHeading>
              <h1 className="text-xl font-medium leading-none text-gray-900">Databackup & Disaster Recovery</h1>
              <div class="flex items-center gap-2 text-sm font-normal text-gray-700"><div class="flex items-center gap-2 text-sm font-medium"><span class="text-gray-800 font-medium">Secure data backup, swift recovery.</span></div></div>
            </ToolbarHeading>
           <RightDrawer CreateBackupBtnHandler={(selectedItems, txtSchedulerName) => insertBackupSchedule(selectedItems, txtSchedulerName)} />
          </Toolbar>
   
   <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-7.5">
      <div className="col-span-2">
        <div className="flex flex-col gap-5 lg:gap-7.5">
          <Backup backupSchedArr={backupSchedArr} fetchBackupsSchedHandler={() => fetchBackupsSched()} />

         
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
