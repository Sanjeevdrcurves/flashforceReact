import React, { Fragment, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

// These imports match your existing usage in Addnewrole.jsx
import { PageNavbar } from '@/pages/account';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// DataGrid components
import {
  DataGrid,
  DataGridColumnHeader
} from '@/components';


const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

function TwilioCallLogs() {
  // ========== 1) Table: All Call Data ==========
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ========== 2) Detail Panel State ==========
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [recordingsLoading, setRecordingsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Redux store info, if needed
  const { companyId, userId } = useSelector(state => state.AuthReducerKey);

  // -------------------------------------------------------------
  //  1) FETCH THE MAIN CALL LOGS
  // -------------------------------------------------------------
  const fetchAllCalls = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/TwilioUser/GetTwilioCallLogs/${companyId}`);
      setTableData(response.data || []);
    } catch (error) {
      console.error('Error fetching call logs:', error);
      toast.error('Failed to fetch call logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCalls();
  }, []);

  // -------------------------------------------------------------
  //  2) WHEN USER CLICKS A CALL SID: fetch recordings
  // -------------------------------------------------------------
  const handleCallSidClick = async (rowData) => {
    setSelectedRowData(rowData);
    setRecordings([]);
    setRecordingsLoading(true);

    try {
      // const response = await axios.get(`${API_URL}/TwilioUser/GetCallSidRecordinglogs/${companyId}/${rowData.sid}`);
      const response = await axios.get(`${API_URL}/TwilioUser/GetCallLogRecordings/${rowData.sid}`);
      
      setRecordings(response.data || []);
    } catch (error) {
      console.error('Error fetching recordings:', error);
      toast.error('Failed to fetch recordings.');
    } finally {
      setRecordingsLoading(false);
    }
  };

  // -------------------------------------------------------------
  //  3) DATAGRID COLUMNS
  // -------------------------------------------------------------
  const columns = useMemo(() => [
    {
      accessorKey: 'srNo',
      header: ({ column }) => <DataGridColumnHeader title="Sr No" column={column} />,
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        return pageIndex * pageSize + row.index + 1;
      },
    },
    {
      accessorKey: 'sid',
      header: ({ column }) => <DataGridColumnHeader title="Call SID" column={column} />,
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <button
            onClick={() => handleCallSidClick(rowData)}
            className="text-blue-600 underline"
          >
            {rowData.sid}
          </button>
        );
      },
    },
    {
      accessorKey: 'from',
      header: ({ column }) => <DataGridColumnHeader title="From" column={column} />,
    },
    {
      accessorKey: 'to',
      header: ({ column }) => <DataGridColumnHeader title="To" column={column} />,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
    },
    {
      accessorKey: 'startTime',
      header: ({ column }) => <DataGridColumnHeader title="Start Time" column={column} />,
    },
    {
      accessorKey: 'endTime',
      header: ({ column }) => <DataGridColumnHeader title="End Time" column={column} />,
    },
    {
      accessorKey: 'duration',
      header: ({ column }) => <DataGridColumnHeader title="Duration" column={column} />,
    },
  ], []);

  const handleProcessAllCalls = async () => {
    try {
      // Make sure the shape of tableData matches what your endpoint expects
      await axios.post(
        // e.g. POST /TwilioUser/TwilioCallLogsDump?companyId={companyId}
        `${API_URL}/Twilio/TwilioCallLogsDump?companyId=${companyId}`, 
        tableData
      );
      toast.success('Call logs successfully processed!');
    } catch (error) {
      console.error('Error processing calls:', error);
      toast.error('Failed to process call logs.');
    }
  };


 const handleSpeechToText = () => {
  setIsModalOpen(true);
};

  const Toolbar = () => (
    <div className="card-header border-b-0 px-5 flex-wrap">
      <h3 className="card-title">Twillio Call logs and Recording </h3>
      <button 
            className="btn btn-primary" 
            onClick={handleProcessAllCalls}
          >
            Dump Call Logs
          </button>
    </div>
  );

  // -------------------------------------------------------------
  //  4) RENDER
  // -------------------------------------------------------------
  return (
    <>
      <PageNavbar />
      
      {/* Container matching your "Addnewrole" design */}
     
        
        {/* Optional Toolbar (similar to Addnewrole) */}
        <Toolbar>
        <ToolbarActions>
          {/* Add a button to process all calls */}
         
        </ToolbarActions>
      </Toolbar>
        
        {/* Content area: DataGrid on the left, details on the right */}
        <div className="flex gap-4">
          {/* Left side: DataGrid of calls */}
          <div className="w-3/4">
            <DataGrid
              columns={columns}
              data={tableData}
              pagination={{ size: 10 }}
              isLoading={loading}
            />
          </div>

          {/* Right side: detail panel */}
          <div className="w-1/4 border-l p-4">
            {!selectedRowData && (
              <p className="text-gray-600">Click a Call SID to view details</p>
            )}

            {selectedRowData && recordingsLoading && (
              <p>Loading recordings...</p>
            )}

            {selectedRowData && !recordingsLoading && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Call Details</h2>
                
                {/* Static call info from table row */}
                <div className="border rounded p-3 mb-4">
                  <h4 className="font-bold">Properties (from table)</h4>
                  <p><strong>Call SID:</strong> {selectedRowData.sid}</p>
                  <p><strong>From:</strong> {selectedRowData.from}</p>
                  <p><strong>To:</strong> {selectedRowData.to}</p>
                  <p><strong>Status:</strong> {selectedRowData.status}</p>
                  <p><strong>Start Time:</strong> {selectedRowData.startTime}</p>
                  <p><strong>End Time:</strong> {selectedRowData.endTime}</p>
                  <p><strong>Duration:</strong> {selectedRowData.duration}</p>
                </div>
{/* Recordings from server */}
<div className="border rounded p-3">
  <h4 className="font-bold mb-2">Recordings</h4>
  {recordings.length > 0 ? (
    recordings.map((rec, index) => (
      <div key={rec.sid || index} className="border rounded p-2 mb-3">
        <p>
          <strong>Recording SID:</strong> {rec.sid}
        </p>
        {/* <p>
          <strong>Date Created:</strong> {rec.dateCreated}
        </p> */}

        {/* Audio player for each recording */}
        {/* const url = `${API_URL}/TwilioUser/PlayCallLogRecordingByFilePath?localPath=${encodeURIComponent(rec.recordingUrl)}`; */}

        <audio controls src={`${API_URL}/TwilioUser/PlayCallLogRecordingByFilePath?localPath=${encodeURIComponent(rec.recordingUrl)}`}>
          Your browser does not support the audio element.
        </audio>
        <button   onClick={() =>
              handleSpeechToText(
              )} >Convert to Text</button>
      </div>
    ))
  ) : (
    <p className="text-gray-600">No recordings found for this call.</p>
  )}
</div>

              </div>
            )}
          </div>
        </div>
        {/* Enhanced Modal Popup */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="p-8 w-[750px] h-auto bg-white rounded-lg shadow-lg border border-gray-300">
        
        </DialogContent>
      </Dialog>
    </>
  );
}

export default TwilioCallLogs;
