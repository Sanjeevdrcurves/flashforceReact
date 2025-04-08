import { useMemo, useState, useEffect } from 'react';
import { DataGrid, DataGridColumnHeader, KeenIcon, useDataGrid, DataGridRowSelectAll, DataGridRowSelect } from '@/components';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import axios from 'axios';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
//const companyId = 1; // Replace with the dynamic company ID

const Visitors = () => {
  const {userId, companyId} = useSelector(state => state.AuthReducerKey);
  const ColumnInputFilter = ({ column }) => {
    return <Input placeholder="Filter..." value={column.getFilterValue() ?? ''} onChange={event => column.setFilterValue(event.target.value)} className="h-9 w-full max-w-40" />;
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'id',
      header: () => <DataGridRowSelectAll />,
      cell: ({ row }) => <DataGridRowSelect row={row} />,
      enableSorting: false,
      enableHiding: false,
      meta: {
        headerClassName: 'w-0'
      }
    },
    {
      accessorFn: row => row.tablesName,  // Updated to reflect the correct column
      id: 'tname',
      header: ({ column }) => <DataGridColumnHeader title="Table Names" filter={<ColumnInputFilter column={column} />} column={column} />,
      enableSorting: true,
      cell: info => (
        <div className="text-sm font-font-medium text-gray-900">
          {info.row.original.tablesName}
        </div>
      ),
      meta: {
        headerClassName: 'min-w-[200px]',
        cellClassName: 'text-gray-700 font-normal'
      }
    },
    {
      accessorFn: row => row.status,  // Updated to reflect the correct column
      id: 'status',
      header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
      enableSorting: true,
      cell: info => (
        <div className="text-gray-800 font-normal">
          {info.row.original.status}
        </div>
      ),
      meta: {
        headerClassName: 'min-w-[250px]',
        cellClassName: 'text-gray-700 font-normal'
      }
    },
    {
      accessorFn: row => row.algorithm,  // Updated to reflect the correct column
      id: 'algorithm',
      header: ({ column }) => <DataGridColumnHeader title="Algorithm" column={column} />,
      enableSorting: true,
      cell: info => <div>{info.row.original.algorithm}</div>,
      meta: {
        headerClassName: 'min-w-[190px]',
        cellClassName: 'text-gray-700 font-normal',
        headerTitle: 'IP Address'
      }
    },
    {
      accessorFn: row => row.keyLength,  // Updated to reflect the correct column
      id: 'keylength',
      header: ({ column }) => <DataGridColumnHeader title="Key Length" column={column} />,
      enableSorting: true,
      cell: info => <div>{info.row.original.keyLength}</div>,
      meta: {
        headerClassName: 'min-w-[190px]',
        cellClassName: 'text-gray-700 font-normal'
      }
    },
    {
      accessorFn: row => row.startTime,  // Updated to reflect the correct column
      id: 'stime',
      header: ({ column }) => <DataGridColumnHeader title="Start Time" column={column} />,
      enableSorting: true,
      cell: info => <div>{new Date(info.row.original.startTime).toLocaleString()}</div>,
      meta: {
        headerClassName: 'min-w-[190px]'
      }
    },
    {
      accessorFn: row => row.completionTime,  // Ensure completionTime is reflected
      id: 'completionTime',
      header: ({ column }) => <DataGridColumnHeader title="Completion Time" column={column} />,
      enableSorting: false,
      cell: ({ row }) => (
        <div>{new Date(row.original.completionTime).toLocaleString()}</div>
      ),
      meta: {
        headerClassName: 'min-w-[190px]'
      }
    },
  ], []);

  const [data, setData] = useState([]);
  const handleRowSelection = state => {
    const selectedRowIds = Object.keys(state);
    if (selectedRowIds.length > 0) {
      toast(`Total ${selectedRowIds.length} are selected.`, {
        description: `Selected row IDs: ${selectedRowIds}`,
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo')
        }
      });
    }
  };

  // Fetching data from the API
  useEffect(() => {
    axios.get(`${API_URL}/EncryptionHistory/GetEncryptionHistoryByCompany/${companyId}`)
      .then((response) => {
        setData(response.data); // Set the fetched data
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  const Toolbar = () => {
    const { table } = useDataGrid();
    const [searchInput, setSearchInput] = useState('');

    return (
      <div className="card-header flex-wrap gap-2 border-b-0 px-5">
        <h3 className="card-title font-medium text-sm">Encryption History</h3>
        <div className="flex flex-wrap gap-2 lg:gap-5">
          {/* Other toolbar items */}
        </div>
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
      sorting={[{ id: 'tablesName', desc: false }]}
      toolbar={<Toolbar />}
      layout={{ card: true }}
    />
  );
};

export { Visitors };
