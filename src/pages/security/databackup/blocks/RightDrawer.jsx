import React, { useState } from 'react';
import './RightDrawer.css'; // Make sure to save your provided CSS in this file.
import { CreateBackupItems } from './';

const RightDrawer = ({CreateBackupBtnHandler}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div>
      {/* Button to Toggle Drawer */}
      <button className="btn btn-primary" onClick={toggleDrawer}>
        {isDrawerOpen ? 'Create Backup' : 'Create Backup'}
      </button>

      {/* Drawer */}
      <div className={`right-drawer ${isDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h4><b>Create Backup Items</b></h4>
          <button className="btn btn-light" onClick={toggleDrawer}>
            &times;
          </button>
        </div>
        <div className="drawer-body">
          <CreateBackupItems CreateBackupBtnHandler={CreateBackupBtnHandler}/>

        </div>
        <div className="drawer-footer">
      <div class="flex justify-end"><button class="btn btn-primary">Create Backup</button></div>
        </div>

      </div>
    </div>
  );
};
export { RightDrawer };

