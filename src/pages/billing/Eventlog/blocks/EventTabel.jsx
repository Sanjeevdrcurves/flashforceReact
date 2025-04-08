import { useEffect, useMemo, useState, useRef } from 'react';
import { DataGrid, DataGridColumnHeader, DataGridRowSelect, useDataGrid, DataGridRowSelectAll, KeenIcon } from '@/components';
import { Popover, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers';
import { useSelector } from 'react-redux';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
 
const EventTable = () => {
  const {userId,companyId}=useSelector(state=>state.AuthReducerKey)
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState([]);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [filterPopoverAnchor, setFilterPopoverAnchor] = useState(null);
  const [selectedRowDetails, setSelectedRowDetails] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const buttonRef = useRef(null);
  const [filters, setFilters] = useState({ userId: '', eventType: '', startDate: null });

  const toggleFilterPopover = () => setFilterPopoverAnchor((prev) => (prev ? null : buttonRef.current));
  const closeFilterPopover = () => setFilterPopoverAnchor(null);

  const fetchEventData = async () => {
    setLoading(true);
    try {
      const params = {
        CompanyId: companyId,
        ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value)), // Remove empty filter values
      };

      const response = await axios.get(`${API_URL}/v1/EventLogs/GetEventlogsByCompanyId`, { params });
      setEventData(response.data);
    } catch (error) {
      console.error('Error fetching event data:', error);
      setSnackbar({ open: true, message: 'Failed to fetch event data.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [filters]); // Re-fetch data when filters change

  const handleDelete = async (logId) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/v1/EventLogs/DeleteEventLog/${logId}`);
      setEventData((prev) => prev.filter((event) => event.logId !== logId));
      setSnackbar({ open: true, message: 'Event log deleted successfully.', severity: 'success' });
    } catch (error) {
      console.error('Error deleting event log:', error);
      setSnackbar({ open: true, message: 'Failed to delete event log.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'logId',
        header: () => <DataGridRowSelectAll />, // Select All checkbox
        cell: ({ row }) => <DataGridRowSelect row={row} />, // Row checkbox
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'eventType',
        header: ({ column }) => <DataGridColumnHeader title="Events" column={column} />,
        cell: ({ row }) => (
          <span
            onClick={(event) => {
              setPopoverAnchor(event.currentTarget);
              setSelectedRowDetails(row.original);
            }}
            className="text-blue-500 underline cursor-pointer"
          >
            {row.original.eventType}
          </span>
        ),
      },
      {
        accessorKey: 'userTask',
        header: ({ column }) => <DataGridColumnHeader title="User Task" column={column} />,
      },
      {
        accessorKey: 'userName',
        header: ({ column }) => <DataGridColumnHeader title="User Name" column={column} />,
      },
      {
        accessorKey: 'eventTimestamp',
        header: ({ column }) => <DataGridColumnHeader title="On (Date/Time)" column={column} />,
        cell: ({ row }) => new Date(row.original.eventTimestamp).toLocaleString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      },
      {
        accessorKey: 'details',
        header: ({ column }) => <DataGridColumnHeader title="Activity" column={column} />,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <button
            className="btn btn-icon btn-sm text-danger"
            title="Delete"
            onClick={() => handleDelete(row.original.logId)}
          >
            <KeenIcon icon="trash" />
          </button>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <div className="card-header flex justify-between items-center">
        <h3 className="card-title">Billing and Invoicing</h3>
        <button
          ref={buttonRef}
          onClick={toggleFilterPopover}
          className="btn btn-icon"
        >
          <KeenIcon icon="filter" />
        </button>
      </div>

      <DataGrid
        columns={columns}
        data={eventData}
        rowSelection={true}
        pagination={{ size: 10 }}
        isLoading={loading}
      />

<Popover
  open={!!popoverAnchor}
  anchorEl={popoverAnchor}
  onClose={() => setPopoverAnchor(null)}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
>
  <div className="p-4 w-96">
    <h3 className="font-bold mb-2">Event Details</h3>
    {selectedRowDetails ? (
      <div>
        {columns.map((column, index) => {
          const headerTitle =
            index === 0 // If it's the first column
              ? 'Event log Id' // Set custom name for the first key
              : typeof column.header === 'function'
              ? column.header({ column }).props.title
              : column.header || column.accessorKey;

          const value =
            selectedRowDetails[column.accessorKey] || 'N/A';

          return (
            <p key={column.accessorKey || column.id}>
              <strong>{headerTitle}:</strong> {String(value)}
            </p>
          );
        })}
      </div>
    ) : (
      <p>No details available</p>
    )}
  </div>
</Popover>

      <Popover
        open={!!filterPopoverAnchor}
        anchorEl={filterPopoverAnchor}
        onClose={closeFilterPopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <div className="p-4 w-72">
          <h4 className="text-lg font-bold mb-4">Filters</h4>

          <div className="mb-4">
            <label htmlFor="userId" className="block mb-1">User Name</label>
            <input
              id="userId"
              type="text"
              placeholder="User Name"
              className="w-full border rounded-lg p-2"
              value={filters.userId}
              onChange={(e) => setFilters((prev) => ({ ...prev, userId: e.target.value }))}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="eventType" className="block mb-1">Events</label>
            <input
              id="eventType"
              type="text"
              placeholder="Event Type"
              className="w-full border rounded-lg p-2"
              value={filters.eventType}
              onChange={(e) => setFilters((prev) => ({ ...prev, eventType: e.target.value }))}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="startDate" className="block mb-1">Start Date</label>
            <DatePicker
              value={filters.startDate}
              onChange={(date) => setFilters((prev) => ({ ...prev, startDate: date }))}
            />
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setFilters({ userId: '', eventType: '', startDate: null })}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Clear Filters
            </button>
            <button
              onClick={closeFilterPopover}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      </Popover>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ open: false, message: '', severity: '' })}
      >
        <Alert
          onClose={() => setSnackbar({ open: false, message: '', severity: '' })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export { EventTable };
