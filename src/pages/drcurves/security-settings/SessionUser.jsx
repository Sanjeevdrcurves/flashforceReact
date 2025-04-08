import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n';
import { KeenIcon, Menu, MenuItem, MenuToggle } from '@/components';
import { DataGrid, DataGridColumnHeader, DataGridRowSelect, DataGridRowSelectAll
, useDataGrid } from '@/components';

import { toAbsoluteUrl } from '@/utils/Assets';
import { useMemo,useEffect, useState } from 'react';
import axios from 'axios';

import { toast } from 'sonner';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
const SessionUser = ({ url }) => {
  const compId = 1;
  const { isRTL } = useLanguage();
  const [tables, settables] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5); // Default visible items

  const fetch_user_session = async () => {
    try {
      const response = await axios.get(`${API_URL}/Session/GetAllSessions/${compId}`);
      const updatedData = response.data.map((item, index) => ({
        ...item,
        avatar: `300-${(index % 6) + 1}.png`, // Add avatar dynamically if not present
      }));
      settables(updatedData);
    } catch (error) {
      console.error('Error fetching session data:', error);
    }
  };

  useEffect(() => {
    fetch_user_session();
  }, []);




 // Define columns
 const columns = useMemo(
  () => [
  {
    accessorKey: 'userName',
    header: ({ column }) => <DataGridColumnHeader title="Name" column={column} />,
    cell: ({ row }) => <div className="flex items-center grow gap-2.5">
    <img
      src={toAbsoluteUrl(`/media/avatars/${row.original.avatar}`)}
      className="rounded-full size-9 shrink-0"
      alt={row.original.userName}
    />
    <div className="flex flex-col gap-1">
      <Link
        to={`/user-profile/${row.original.userID}`}
        className="text-sm font-medium text-gray-900 hover:text-primary-active mb-px"
      >
        {row.original.userName}
      </Link>
      <span className="text-xs font-normal text-gray-700 leading-3">
        {row.original.locationName}
      </span>
    </div>
  </div>,
    meta: { headerClassName: 'min-w-[150px]', cellClassName: 'text-sm' },
  },{
    accessorKey: 'locationName',
    header: ({ column }) => <DataGridColumnHeader title="Location Name" column={column} />,
    cell: ({ row }) => <span className="text-sm">{row.original.locationName}</span>,
    meta: { headerClassName: 'min-w-[150px]', cellClassName: 'text-sm' },
  },
  {
    accessorKey: 'time',
    header: ({ column }) => <DataGridColumnHeader title="Recent Activity" column={column} />,
    cell: ({ row }) => <span className="text-sm font-medium">{row.original.time}</span>,
    meta: { headerClassName: 'min-w-[150px]', cellClassName: 'text-black text-sm font-medium' },
  },
  
  ],
  []
);

const Toolbar = () => {
  const { table } = useDataGrid();
  return (
    <div className="card-header border-b-0 px-5 flex-wrap">
      <h3 className="card-title">Login Session</h3>
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
<DataGrid
columns={columns}
data={tables}
rowSelection={true}
pagination={{ size: 5 }}
sorting={[{ id: 'timestamp', desc: false }]}
toolbar={<Toolbar />}
layout={{ card: true }}
isLoading={false}
/> 
);
};
export { SessionUser };
