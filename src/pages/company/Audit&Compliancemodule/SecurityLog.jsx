import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, DataGridColumnHeader, DataGridRowSelect, DataGridRowSelectAll, DataGridColumnVisibility, useDataGrid, KeenIcon } from '@/components';
import { RightDrawer } from './blocks';
import { useSelector } from 'react-redux';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
//const companyId = 1; // Replace with the dynamic company ID

const SecurityLog = () => {
  const {userId, companyId} = useSelector(state => state.AuthReducerKey);
  const [drawerOpen, setisDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [logs, setLogs] = useState([]); // State to hold logs

  useEffect(() => {
    // Fetch data from the API
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`${API_URL}/SecurityIncident/GetSecurityLogsByCompanyId/${companyId}/${userId}`);
        const formattedLogs = response.data.map(log => ({
          timestamp: log.timestamp,
          eventType: log.actionType, // Map to eventType
          actionTaken: log.actionTaken,
          sourceIP: log.sourceIPAddress,
          destinationIP: log.destinationIP,
          severity: log.severity,
          details: log.details, // Assuming the response contains 'details' for each log
        }));
        setLogs(formattedLogs); // Set the fetched data to state
      } catch (error) {
        console.error('Error fetching security logs:', error);
      }
    };

    fetchLogs();
  }, []);

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'High':
        return 'badge-danger';
      case 'Medium':
        return 'badge-warning';
      case 'Low':
        return 'badge-success';
      case 'Critical':
        return 'badge-primary';
      default:
        return 'badge-secondary';
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: () => <DataGridRowSelectAll />,
        cell: ({ row }) => <DataGridRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        meta: { headerClassName: 'w-0' },
      },
      {
        accessorFn: (row) => row.timestamp,
        id: 'timestamp',
        header: ({ column }) => <DataGridColumnHeader title="Timestamp" column={column} />,
        enableSorting: true,
        cell: (info) => new Date(info.row.original.timestamp).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        meta: { headerClassName: 'min-w-[150px]', cellClassName: 'text-gray-800 font-normal' },
      },
      {
        accessorFn: (row) => row.eventType,
        id: 'eventType',
        header: ({ column }) => <DataGridColumnHeader title="Event Type" column={column} />,
        enableSorting: true,
        cell: (info) => <div className="flex items-center gap-2">{info.row.original.eventType}</div>,
        meta: { headerClassName: 'min-w-[200px]', cellClassName: 'text-gray-800 font-normal' },
      },
      {
        accessorFn: (row) => row.actionTaken,
        id: 'actionTaken',
        header: ({ column }) => <DataGridColumnHeader title="Action Taken" column={column} />,
        enableSorting: true,
        cell: (info) => info.row.original.actionTaken,
        meta: { headerClassName: 'min-w-[150px]', cellClassName: 'text-gray-800 font-normal' },
      },
      {
        accessorFn: (row) => row.sourceIP,
        id: 'sourceIP',
        header: ({ column }) => <DataGridColumnHeader title="Source IP" column={column} />,
        enableSorting: true,
        cell: (info) => info.row.original.sourceIP,
        meta: { headerClassName: 'min-w-[150px]', cellClassName: 'text-gray-800 font-normal' },
      },
      {
        accessorFn: (row) => row.destinationIP,
        id: 'destinationIP',
        header: ({ column }) => <DataGridColumnHeader title="Destination IP" column={column} />,
        enableSorting: true,
        cell: (info) => info.row.original.destinationIP,
        meta: { headerClassName: 'min-w-[150px]', cellClassName: 'text-gray-800 font-normal' },
      },
      {
        accessorFn: (row) => row.severity,
        id: 'severity',
        header: ({ column }) => <DataGridColumnHeader title="Severity" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <span className={`badge ${getSeverityBadge(info.row.original.severity)}`}>
            {info.row.original.severity}
          </span>
        ),
        meta: { headerClassName: 'w-[120px]', cellClassName: 'text-gray-800 font-normal' },
      },
      {
        id: 'actions',
        header: () => '',
        enableSorting: false,
        cell: (info) => (
          <button
            className="btn btn-link"
            onClick={() => { setSelectedItem(info.row.original); setisDrawerOpen(true); }}
          >
            Details
          </button>
        ),
        meta: { headerClassName: 'w-[100px]' },
      },
    ],
    []
  );

  const handleDetailsClick = (rowData) => {
    alert(JSON.stringify(rowData));
    console.log("Row Details:", rowData);
    setisDrawerOpen(true);
  };

  const Toolbar = () => {
    const { table } = useDataGrid();
    return (
      <div className="card-header border-b-0 px-5 flex-wrap">
        <h3 className="card-title">Security Logs</h3>
        <div className="flex flex-wrap items-center gap-2.5">
          {/* <button className="btn btn-light btn-sm">
            <KeenIcon icon="exit-down" />
            Export
          </button> */}
          {/* <DataGridColumnVisibility table={table} /> */}
        </div>
      </div>
    );
  };

  return (
    <div>
      <RightDrawer isDrawerOpen={drawerOpen} selectedItem={selectedItem} onClose={() => { setisDrawerOpen(false); }} />
      <DataGrid
        columns={columns}
        data={logs}
        rowSelection={true}
        pagination={{ size: 5 }}
        sorting={[{ id: 'timestamp', desc: false }]}
        toolbar={<Toolbar />}
        layout={{ card: true }}
        isLoading={false}
      />
    </div>
  );
};

export { SecurityLog };
