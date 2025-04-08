/* eslint-disable prettier/prettier */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/utils';
import { DataGrid, DataGridColumnHeader, KeenIcon, useDataGrid, DataGridRowSelectAll, DataGridRowSelect } from '@/components';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UsersData } from './';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
const Users = () => {
  const ColumnInputFilter = ({
    column
  }) => {
    return <Input placeholder="Filter..." value={column.getFilterValue() ?? ''} onChange={event => column.setFilterValue(event.target.value)} className="h-9 w-full max-w-40" />;
  };
  const columns = useMemo(() => [{
    accessorKey: 'id',
    header: () => <DataGridRowSelectAll />,
    cell: ({
      row
    }) => <DataGridRowSelect row={row} />,
    enableSorting: false,
    enableHiding: false,
    meta: {
      headerClassName: 'w-0'
    }
  }, {
    accessorFn: row => row.user,
    id: 'users',
    header: ({
      column
    }) => <DataGridColumnHeader title="Table Name" filter={<ColumnInputFilter column={column} />} column={column} />,
    enableSorting: true,
    cell: ({
      row
    }) => {
      // 'row' argumentini cell funksiyasiga qo'shdik
      return <div className="flex items-center gap-4">
              <img src={toAbsoluteUrl(`/media/avatars/${row.original.user.avatar}`)} className="rounded-full size-9 shrink-0" alt={`${row.original.user.userName}`} />

              <div className="flex flex-col gap-0.5">
                <Link to="#" className="text-sm font-medium text-gray-900 hover:text-primary-active mb-px">
                  {row.original.user.userName}
                </Link>
                
                <Link to="#" className="text-2sm text-gray-700 font-normal hover:text-primary-active">
                  {row.original.user.userGmail}
                </Link> 
              </div>
            </div>;
    },
    meta: {
      className: 'min-w-[300px]',
      cellClassName: 'text-gray-800 font-normal'
    }
  }, {
    accessorFn: row => row.role,
    id: 'role',
    header: ({
      column
    }) => <DataGridColumnHeader title="Progress" column={column} />,
    enableSorting: true,
    cell: info => {
      // return info.row.original.role;
      
                 return <span>
            <div className="progress progress-primary max-w-2xl w-full">
                  <div className="progress-bar" style={{
                  width: `${info.row.original.role}%`
                }}></div> </div>
                  </span>;
    },
    meta: {
      headerClassName: 'min-w-[180px]'
    }
  },
   {
    accessorFn: row => row.role,
    id: 'role',
    header: ({
      column
    }) => <DataGridColumnHeader title="Key" column={column} />,
    enableSorting: true,
    cell: info => {
      return info.row.original.location;
    },
    meta: {
      headerClassName: 'min-w-[180px]'
    }
  }, {
    accessorFn: row => row.status,
    id: 'status',
    header: ({
      column
    }) => <DataGridColumnHeader title="Encrypt" column={column} />,
    enableSorting: true,
    cell: info => {
      return <span>
              <input className="radio" name="desktop_notification" type="radio" value="1" readOnly />
                  </span>;
    },
    meta: {
      headerClassName: 'min-w-[180px]'
    }
  }, {
    accessorFn: row => row.location,
    id: 'location',
    header: ({
      column
    }) => <DataGridColumnHeader title="Decrypt" column={column} />,
    enableSorting: true,
    cell: info => {
      return <span>
              <input className="radio" name="desktop_notification" type="radio" value="1" readOnly />
                  </span>;;
    },
    meta: {
      headerClassName: 'min-w-[180px]'
    }
  }, 
    
  ], []);
  const data = useMemo(() => UsersData, []);
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
  const Toolbar = () => {
    const {
      table
    } = useDataGrid();
    const [searchInput, setSearchInput] = useState('');
    return <div className="card-header flex-wrap gap-2 border-b-0 px-5">
        <h3 className="card-title font-medium text-sm">Tables to be Encrypted</h3>

        <div className="flex flex-wrap gap-2 lg:gap-5">
      

          <div className="flex flex-wrap gap-2.5">
            


            
          </div> 
        </div>
      </div>;
  };
  return <DataGrid columns={columns} data={data} rowSelection={true} onRowSelectionChange={handleRowSelection} pagination={{
    size: 4
  }} sorting={[{
    id: 'users',
    desc: false
  }]} toolbar={<Toolbar />} layout={{
    card: true
  }} />;
};
export { Users };