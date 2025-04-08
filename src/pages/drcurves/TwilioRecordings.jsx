import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

// Same DataGrid import
import {
  DataGrid,
  DataGridColumnHeader
} from '@/components';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

function TwilioRecordings() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { companyId, userId } = useSelector(state => state.AuthReducerKey);

  // Fetch recordings data
  const fetchTableData = async () => {
    setLoading(true);
    try {
      // Adjust this endpoint to match your .NET API route for recordings
      const response = await axios.get(`${API_URL}/TwilioUser/GetCallRecordinglogs/${companyId}`);
      // Example shape could be:
      // [
      //   {
      //     sid: 'RExxxxxx',
      //     callSid: 'CAxxxxxx',
      //     dateCreated: '2023-01-01T12:00:00Z',
      //     recordingUrl: 'https://api.twilio.com/2010-04-01/Accounts/...',
      //   },
      //   ...
      // ]
      setTableData(response.data || []);
    } catch (error) {
      console.error('Error fetching recordings:', error);
      toast.error('Failed to fetch recordings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  const columns = useMemo(
    () => [
      // Auto-increment row number
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
        header: ({ column }) => <DataGridColumnHeader title="Recording SID" column={column} />,
      },
      {
        accessorKey: 'callSid',
        header: ({ column }) => <DataGridColumnHeader title="Call SID" column={column} />,
      },
      {
        accessorKey: 'dateCreated',
        header: ({ column }) => <DataGridColumnHeader title="Date Created" column={column} />,
      },
      {
        accessorKey: 'recordingUrl',
        header: ({ column }) => <DataGridColumnHeader title="Recording" column={column} />,
        cell: ({ row }) => {
          const { recordingUrl } = row.original;
          return (
            <a href={recordingUrl} target="_blank" rel="noreferrer">
              Download
            </a>
          );
        },
      },
    ],
    []
  );

  // Custom toolbar for recordings
  const Toolbar = () => (
    <div className="card-header border-b-0 px-5 flex-wrap">
      <h3 className="card-title">Recordings</h3>
    </div>
  );

  return (
    <div>
      <DataGrid
        columns={columns}
        data={tableData}
        pagination={{ size: 10 }}
        isLoading={loading}
        toolbar={<Toolbar />}
      />
    </div>
  );
}

export default TwilioRecordings;
