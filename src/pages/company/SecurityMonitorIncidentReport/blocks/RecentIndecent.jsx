import React, { useMemo, useState, useEffect } from 'react';
import {
  DataGrid,
  DataGridColumnHeader,
  DataGridRowSelect,
  DataGridRowSelectAll,
  useDataGrid,
} from '@/components';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
//const companyId = 1; // Replace with the dynamic company ID
const RecentIndecent = () => {
  const {userId, companyId} = useSelector(state => state.AuthReducerKey);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/SecurityIncident/GetSecurityIncidents?CompanyId=${companyId}`
        );
        const formattedData = response.data.map((incident, index) => ({
          id: index + 1,
          incidentId: incident.incidentId,
          severity: incident.severity,
          date: new Date(incident.timestamp).toLocaleDateString(),
          details: incident.details,
          status: incident.status,
        }));
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load incidents.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const ColumnInputFilter = ({ column }) => (
    <Input
      placeholder="Filter..."
      value={column.getFilterValue() ?? ''}
      onChange={(event) => column.setFilterValue(event.target.value)}
      className="h-9 w-full max-w-40"
    />
  );

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
        accessorKey: 'incidentId',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Incident ID"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        meta: { headerClassName: 'min-w-[150px]', cellClassName: 'text-gray-800 font-normal' },
      },
      {
        accessorKey: 'severity',
        header: ({ column }) => (
          <DataGridColumnHeader title="Severity" column={column} />
        ),
        enableSorting: true,
        cell: ({ getValue }) => {
          const value = getValue();
          const colors = {
            Critical: 'bg-red-100 text-red-600',
            High: 'bg-orange-100 text-orange-600',
            Medium: 'bg-yellow-100 text-yellow-600',
            Low: 'bg-green-100 text-green-600',
          };
          return (
            <span className={`badge badge-sm ${colors[value] || 'bg-gray-100 text-gray-600'}`}>
              {value}
            </span>
          );
        },
        meta: { headerClassName: 'min-w-[120px]', cellClassName: 'text-gray-800 font-normal' },
      },
      {
        accessorKey: 'date',
        header: ({ column }) => (
          <DataGridColumnHeader title="Date" column={column} />
        ),
        enableSorting: true,
        meta: { headerClassName: 'min-w-[150px]', cellClassName: 'text-gray-800 font-normal' },
      },
      {
        accessorKey: 'details',
        header: ({ column }) => (
          <DataGridColumnHeader title="Details" column={column} />
        ),
        enableSorting: true,
        meta: { headerClassName: 'min-w-[200px]', cellClassName: 'text-gray-800 font-normal' },
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataGridColumnHeader title="Status" column={column} />
        ),
        enableSorting: true,
        meta: { headerClassName: 'min-w-[150px]', cellClassName: 'text-gray-800 font-normal' },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <select
            className="form-select form-select-sm"
            onChange={(e) => {
              const action = e.target.value;
              toast(`Action "${action}" selected for ${row.original.incidentId}`, {
                description: `Row Details: ${JSON.stringify(row.original)}`,
              });
            }}
            defaultValue=""
          >
            <option value="" disabled>
              Select Action
            </option>
            <option value="View">View</option>
            <option value="Update">Update</option>
            <option value="Escalate">Escalate</option>
            <option value="Archive">Archive</option>
          </select>
        ),
        meta: { headerClassName: 'w-[150px]', cellClassName: 'text-gray-800 font-normal' },
      },
    ],
    []
  );

  const handleRowSelection = (state) => {
    const selectedRowIds = Object.keys(state);
    if (selectedRowIds.length > 0) {
      toast(`Total ${selectedRowIds.length} rows are selected.`, {
        description: `Selected row IDs: ${selectedRowIds.join(', ')}`,
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo'),
        },
      });
    }
  };

  const Toolbar = () => {
    const { table } = useDataGrid();
    return (
      <div className="card-header border-b-0 px-5 flex-wrap">
        <h3 className="card-title">Recent Incidents</h3>
      </div>
    );
  };

  return (
    <DataGrid
      columns={columns}
      data={data}
      rowSelection={true}
      onRowSelectionChange={handleRowSelection}
      pagination={{ size: 5 }}
      sorting={[{ id: 'date', desc: false }]}
      toolbar={<Toolbar />}
      layout={{ card: true }}
      isLoading={loading}
    />
  );
};

export { RecentIndecent };
