import React, { useState, useRef, Fragment } from 'react';
import { PageNavbar } from '@/pages/account';
import { DataGrid, DataGridColumnHeader, DataGridRowSelect, useDataGrid,DataGridRowSelectAll,KeenIcon,DataGridColumnVisibility } from '@/components';
import { Toolbar, ToolbarHeading, ToolbarActions } from '@/partials/toolbar';
 
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { EventTable } from './blocks';
import { useSelector } from 'react-redux';
const EventLog = () => {
  // State to manage the visibility of the popover
    const {userId,companyId}=useSelector(state=>state.AuthReducerKey)
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  
  // Ref to the button to help position the popover
  const buttonRef = useRef(null);

  // Function to toggle the popover visibility
  const togglePopover = () => {
    setIsPopoverVisible(!isPopoverVisible);
  };

  // Function to close the popover
  const closePopover = () => {
    setIsPopoverVisible(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Fragment>
      <PageNavbar />
      <div className="container-fixed" id="clientBilling">
        <Toolbar>
          <ToolbarHeading>
            <h1 className="text-xl font-medium leading-none text-gray-900">Event Log</h1>
            <div className="flex items-center gap-2 text-sm font-normal text-gray-700" id="BillingEnterprisePage">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-gray-800 font-medium">Central Hub for Personal Customization</span>
              </div>
            </div>
          </ToolbarHeading>
          <ToolbarActions>
            <a
              href="#"
              ref={buttonRef} // Reference to the button for positioning the popover
              className="btn btn-sm btn-light"
              onClick={togglePopover} // Toggle popover visibility on click
            ><KeenIcon icon="filter" />
              Filters
            </a>
          </ToolbarActions>
        </Toolbar>

        {/* Conditionally render the popover */}
        {isPopoverVisible && (
          <div
            style={{
              position: 'absolute',
              top: buttonRef.current?.getBoundingClientRect().top, // Align popover vertically with the button
              left: buttonRef.current?.getBoundingClientRect().left - 300, // Position the popover 300px to the left of the button
              zIndex: 9999,
              backgroundColor: 'white',
              border: '1px solid #ddd',
              padding: '10px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              width: '300px', // Increased the width of the popover to 300px
            }}
          >
            <div>
              <h3>Security Overview</h3>
              <p>Details about security will go here. This section could include any relevant information such as security settings, access logs, or other security-related details.</p>
              <button
                onClick={closePopover} // Close the popover when clicked
                style={{
                  backgroundColor: '#007BFF',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Event Table Component */}
        <EventTable />
      </div>
    </Fragment>
      
      </LocalizationProvider>
  );
};

export default EventLog;
