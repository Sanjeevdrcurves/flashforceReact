import React, { useMemo, useState, useEffect } from "react";
import {
  DataGrid,
  DataGridColumnHeader,
  DataGridRowSelect,
  DataGridRowSelectAll,
  useDataGrid,
  KeenIcon,
} from "@/components";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useSelector } from 'react-redux';


const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
const SecurityLog = () => {
  
    const {userId, companyId} = useSelector(state => state.AuthReducerKey);
  const [logs, setLogs] = useState([]); // State to store fetched data
  const [selectedAction, setSelectedAction] = useState({});

  useEffect(() => {
    // Fetch data from the API
    const fetchLogs = async () => {
      try {
        const response = await fetch(`${API_URL}/PolicyAssignment/GetDataLossPreventionLogsByCompanyId/${companyId}`);
        const data = await response.json();
        // Map data to fit the columns
        const formattedData = data.map(item => ({
          id: item.id.toString(), // Ensure the ID is a string
          timestamp: item.timeStamp,
          severity: item.severity,
          policyName: item.policyName,
          userInvolved: item.userName || "Unknown",
          details: item.ipAddress,
          status: item.policyLogStatus, // Fallback to 'Pending' if no status
        }));
        setLogs(formattedData); // Set the fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchLogs(); // Call the function to fetch data
  }, []); // Empty dependency array to run the effect only once on mount

  const handleActionChange = (id, action) => {
    setSelectedAction((prev) => ({ ...prev, [id]: action }));
    console.log(`Action for row ${id}: ${action}`);
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "High":
        return "badge-danger";
      case "Medium":
        return "badge-warning";
      case "Low":
        return "badge-success";
      case "Critical":
        return "badge-primary";
      default:
        return "badge-secondary";
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: () => <DataGridRowSelectAll />,
        cell: ({ row }) => <DataGridRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        meta: { headerClassName: "w-0" },
      },
      {
        accessorKey: "id",
        id: "alertId",
        header: ({ column }) => <DataGridColumnHeader title="Alert ID" column={column} />,
        enableSorting: true,
        cell: (info) => info.row.original.id,
        meta: { headerClassName: "min-w-[100px]", cellClassName: "text-gray-800" },
      },
      {
        accessorKey: "timestamp",
        id: "timestamp",
        header: ({ column }) => <DataGridColumnHeader title="Timestamp" column={column} />,
        enableSorting: true,
        cell: (info) => new Date(info.row.original.timestamp).toLocaleString("en-GB"),
        meta: { headerClassName: "min-w-[150px]", cellClassName: "text-gray-800" },
      },
      {
        accessorKey: "severity",
        id: "severity",
        header: ({ column }) => <DataGridColumnHeader title="Severity" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <span className={`badge ${getSeverityBadge(info.row.original.severity)} px-2 py-1`}>
            {info.row.original.severity}
          </span>
        ),
        meta: { headerClassName: "min-w-[100px]", cellClassName: "text-gray-800" },
      },
      {
        accessorKey: "policyName",
        id: "policyName",
        header: ({ column }) => <DataGridColumnHeader title="Policy Name" column={column} />,
        enableSorting: true,
        cell: (info) => info.row.original.policyName,
        meta: { headerClassName: "min-w-[150px]", cellClassName: "text-gray-800" },
      },
      {
        accessorKey: "userInvolved",
        id: "userInvolved",
        header: ({ column }) => <DataGridColumnHeader title="User Involved" column={column} />,
        enableSorting: true,
        cell: (info) => info.row.original.userInvolved,
        meta: { headerClassName: "min-w-[150px]", cellClassName: "text-gray-800" },
      },
      {
        accessorKey: "details",
        id: "details",
        header: ({ column }) => <DataGridColumnHeader title="Details" column={column} />,
        enableSorting: true,
        cell: (info) => info.row.original.details,
        meta: { headerClassName: "min-w-[150px]", cellClassName: "text-gray-800" },
      },
      {
        accessorKey: "status",
        id: "status",
        header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
        enableSorting: true,
        cell: (info) => <span className="text-blue-500">{info.row.original.status}</span>,
        meta: { headerClassName: "min-w-[100px]", cellClassName: "text-gray-800" },
      },
      {
        id: "actions",
        header: "Action",
        cell: (info) => (
          <select
            value={selectedAction[info.row.original.id] || ""}
            onChange={(e) => handleActionChange(info.row.original.id, e.target.value)}
            className="form-select px-2 py-1 border rounded text-gray-800"
          >
            <option value="" disabled>
              Select Action
            </option>
            <option value="View Details">View Details</option>
            <option value="Escalate">Escalate</option>
            <option value="Resolve">Resolve</option>
          </select>
        ),
        meta: { headerClassName: "min-w-[120px]" },
      },
    ],
    [selectedAction]
  );

  const Toolbar = () => {
    const { table } = useDataGrid();
    return (
      <div className="card-header border-b-0 px-5 flex-wrap">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 lg:gap-2 flex justify-center items-center">
          <h3 className="card-title">Security Logs</h3>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Bulk Option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Spain</SelectItem>
              <SelectItem value="2">Option 2</SelectItem>
              <SelectItem value="3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button className="btn btn-light btn-sm">
            <KeenIcon icon="filter" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <DataGrid
        columns={columns}
        data={logs} // Bind the fetched logs data here
        rowSelection={true}
        pagination={{ size: 5 }}
        sorting={[{ id: "timestamp", desc: false }]}
        toolbar={<Toolbar />}
        layout={{ card: true }}
        isLoading={logs.length === 0} // Show loading when data is empty
      />
    </div>
  );
};

export { SecurityLog };
