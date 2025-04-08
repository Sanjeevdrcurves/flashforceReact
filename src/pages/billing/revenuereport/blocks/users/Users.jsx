/* eslint-disable prettier/prettier */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/utils';
import { DataGrid, DataGridColumnHeader, KeenIcon, useDataGrid, DataGridRowSelectAll, DataGridRowSelect } from '@/components';
import { CommonRating } from '@/partials/common';
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
  const columns = useMemo(() => [ {
    accessorFn: row => row.user,
    id: 'users',
    header: ({
      column
    }) => <DataGridColumnHeader title="Author" filter={<ColumnInputFilter column={column} />} column={column} />,
    enableSorting: true,
    cell: ({
      row
    }) => {
      // 'row' argumentini cell funksiyasiga qo'shdik
      return <div className="flex items-center gap-2.5">
             
              <div className="flex flex-col">
                <Link to="#" className="text-sm font-medium text-gray-900 hover:text-primary-active mb-px">
                  {row.original.user.userName}
                </Link>
                
                
              </div>
            </div>;
    },
    meta: {
      headerClassName: 'min-w-[250px]',
      cellClassName: 'text-gray-800 font-normal'
    }
  }, {
    id: 'social',
    header: ({
      column
    }) => <DataGridColumnHeader title="Social Profiles" column={column} />,
    enableSorting: false,
    cell: () => {
      return <div className="flex items-center gap-2.5">
              <Link to="#">
                <KeenIcon icon="facebook" className='text-gray-500 text-lg' /> 
              </Link>

              <Link to="#">
                <KeenIcon icon="dribbble" className='text-gray-500 text-lg' /> 
              </Link>

              <Link to="#">
                <KeenIcon icon="tiktok" className='text-gray-500 text-lg' /> 
              </Link> 
            </div>;
    },
    meta: {
      headerClassName: 'w-[150px]'
    }
  }, {
    id: 'edit',
    header: () => '',
    enableSorting: false,
    cell: () => {
      return <button className="btn btn-sm btn-icon btn-clear btn-light">
              <KeenIcon icon="dots-vertical" /> 
            </button>;
    },
    meta: {
      headerClassName: 'w-[60px]'
    }
  }], []);
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
        <h3 className="card-title font-medium text-sm">Revenue Breakdown by Client Segment</h3>

       
      </div>;
  };
  return <DataGrid columns={columns} data={data} rowSelection={true} onRowSelectionChange={handleRowSelection} pagination={{
    size: 5
  }} sorting={[{
    id: 'team',
    desc: false
  }]} toolbar={<Toolbar />} layout={{
    card: true
  }} />;
};
export { Users };