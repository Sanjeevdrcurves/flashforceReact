/* eslint-disable prettier/prettier */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/utils';
import { DataGrid, DataGridColumnHeader, KeenIcon, useDataGrid, DataGridRowSelectAll, DataGridRowSelect } from '@/components';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CompanyData } from './CompanyData';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import {CompanyFilter} from './CompanyFilter';
//import { DropdownCard2, DropdownCardItem1 } from '@/partials/dropdowns/general';
import { DropdownCrud1, DropdownCrudItem1 } from '@/partials/dropdowns/general';
import { Menu, MenuItem, MenuToggle, MenuTitle, MenuIcon, MenuLink, MenuSeparator, MenuSub } from '@/components';
import { useLanguage } from '@/i18n';
const Company = ({companies, filterTypes, deleteCompany}) => {
  const {
    isRTL
  } = useLanguage();
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
    }) => <DataGridColumnHeader title="Company Name" filter={<ColumnInputFilter column={column} />} column={column} />,
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
    }) => <DataGridColumnHeader title="Type" column={column} />,
    enableSorting: true,
    cell: info => {
      return info.row.original.role;
    },
    meta: {
      headerClassName: 'min-w-[180px]'
    }
  }, {
    accessorFn: row => row.status,
    id: 'status',
    header: ({
      column
    }) => <DataGridColumnHeader title="Parent" column={column} />,
    enableSorting: true,
    cell: info => {
      return <span className={`badge badge-${info.row.original.status.color} shrink-0 badge-outline rounded-[30px]`}>
              <span className={`size-1.5 rounded-full bg-${info.row.original.status.color} me-1.5`}></span>
              {info.row.original.status.label}
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
    }) => <DataGridColumnHeader title="RelationShip Number" column={column} />,
    enableSorting: true,
    cell: info => {
      return <div className="flex items-center text-gray-800 font-normal gap-1.5">
              
              {info.row.original.location}
            </div>;
    },
    meta: {
      headerClassName: 'min-w-[180px]'
    }
  }, {
    accessorFn: row => row.activity,
    id: 'activity',
    header: ({
      column
    }) => <DataGridColumnHeader title="Created At" column={column} />,
    enableSorting: true,
    cell: info => {
      return info.row.original.activity;
    },
    meta: {
      headerClassName: 'min-w-[180px]',
      cellClassName: 'text-gray-800 font-normal'
    }
  }, {
    id: 'edit',
    header: ({
      column
    }) => <DataGridColumnHeader title="Action" column={column} />,
    enableSorting: true,
    cell: info  => {
      return <Menu>
      <MenuItem toggle="dropdown" trigger="click" dropdownProps={{
      placement: isRTL() ? 'bottom-start' : 'bottom-end',
      modifiers: [{
        name: 'offset',
        options: {
          offset: isRTL() ? [0, -10] : [0, 10] // [skid, distance]
        }
      }]
    }}>
        <MenuToggle className="btn btn-sm btn-icon btn-light btn-clear">
          <KeenIcon icon="dots-vertical" />
        </MenuToggle>
        <MenuSub className="menu-default" rootClassName="w-full max-w-[175px]">
          <MenuItem path="#" onClick={()=>deleteCompany(info.row.original.companyId)}>
            <MenuLink>
              <MenuIcon>
                <KeenIcon icon="trash" />
              </MenuIcon>
              <MenuTitle>Remove</MenuTitle>
            </MenuLink>
          </MenuItem>
        </MenuSub>
      </MenuItem>
    </Menu>;
    },
    meta: {
      headerClassName: 'w-[60px]'
    }
  }], []);
  const data = useMemo(() => CompanyData, []);
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
        <h3 className="card-title font-medium text-sm">Showing {companies.length} Entities</h3>

        <div className="flex flex-wrap gap-2 lg:gap-5">
       

          <div className="flex flex-wrap gap-2.5">
            

           
            {/* <button className="btn btn-sm btn-outline btn-primary">
              <KeenIcon icon="setting-4" /> Filters
            </button> */}
        <CompanyFilter filterTypes={filterTypes} handleFilter={(props)=>{
          if(props.companyType)
            table.getColumn('role')?.setFilterValue(props.companyType)
          else{
            table.getColumn('role')?.setFilterValue('')
          }
          }}/>
          </div> 
        </div>
      </div>;
  };

//   return <DataGrid columns={columns} data={data} rowSelection={true} onRowSelectionChange={handleRowSelection} pagination={{
//     size: 5
//   }} sorting={[{
//     id: 'users',
//     desc: false
//   }]} toolbar={<Toolbar />} layout={{
//     card: true
//   }} />;
// };
  return <DataGrid columns={columns} data={companies} rowSelection={true} onRowSelectionChange={handleRowSelection} pagination={{
    size: 5
  }} sorting={[{
    id: 'users',
    desc: false
  }]} toolbar={<Toolbar />} layout={{
    card: true
  }} />;
};
export { Company };