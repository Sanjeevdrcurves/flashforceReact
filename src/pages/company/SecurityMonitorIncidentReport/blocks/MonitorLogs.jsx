import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  DataGrid,
  DataGridColumnHeader,
  DataGridRowSelect,
  DataGridRowSelectAll,
  useDataGrid,
} from '@/components';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
//const companyId = 1; // Replace with the dynamic company ID
const MonitiorLogs = () => {
  const {userId, companyId} = useSelector(state => state.AuthReducerKey);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get( `${API_URL}/IncidentLogs/GetAllIncidentLogsByCompanyId/${companyId}`);
        const formattedData = response.data.map((item) => ({
         checkedLog: item.checkedLog,
         warning1: item.warning1,
         notes: item.notes,
         warning2: item.warning2,
          id: item.id,
          logId: item.incidentId,
          timestamp: item.incidentTimestamp,
          type: item.incidentType,
          eventDescription: item.eventDescription,
          relatedIncident: item.relatedIncident,
        }));
        setData(formattedData);
      } catch (error) {
        toast.error('Failed to fetch incident logs. Please try again later.');
        console.error('Error fetching data:', error);
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
        accessorKey: 'logId',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Log ID"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        enableSorting: true,
        meta: { headerClassName: 'min-w-[150px]', cellClassName: 'text-gray-800 font-normal' },
      },
      {
        accessorKey: 'timestamp',
        header: ({ column }) => (
          <DataGridColumnHeader title="Timestamp" column={column} />
        ),
        enableSorting: true,
        meta: { headerClassName: 'min-w-[200px]', cellClassName: 'text-gray-800 font-normal' },
      },
      {
        accessorKey: 'type',
        header: ({ column }) => (
          <DataGridColumnHeader title="Type" column={column} />
        ),
        enableSorting: true,
        meta: {
          headerClassName: 'min-w-[120px]',
          cellClassName: (info) =>
            info.row.original.type === 'Error'
              ? 'bg-red-100 text-red-600'
              : info.row.original.type === 'Warning'
              ? 'bg-yellow-100 text-yellow-600'
              : '',
        },
      },
      {
        accessorKey: 'eventDescription',
        header: ({ column }) => (
          <DataGridColumnHeader title="Event Description" column={column} />
        ),
        enableSorting: true,
        meta: { headerClassName: 'min-w-[300px]', cellClassName: 'text-gray-800 font-normal' },
      },
      {
        accessorKey: 'relatedIncident',
        header: ({ column }) => (
          <DataGridColumnHeader title="Related Incident" column={column} />
        ),
        enableSorting: true,
        meta: { headerClassName: 'min-w-[200px]', cellClassName: 'text-gray-800 font-normal' },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <button className="btn btn-sm btn-outline-primary">View Details</button>
        ),
        meta: { headerClassName: 'w-[120px]' },
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
        <h3 className="card-title">Monitoring Log</h3>
        <div className="flex flex-wrap items-center gap-2.5"></div>
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
      sorting={[{ id: 'timestamp', desc: false }]}
      toolbar={<Toolbar />}
      layout={{ card: true }}
      isLoading={loading}
    />
  );
};

export { MonitiorLogs };
