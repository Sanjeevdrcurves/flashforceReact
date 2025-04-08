/* eslint-disable prettier/prettier */
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DataGrid, DataGridColumnHeader, DataGridColumnVisibility, KeenIcon, useDataGrid } from '@/components';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { sendNotification } from '@/utils/notificationapi';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
let loginUserId="";
const Teams = () => {
  const {userId,companyId}=useSelector(state=>state.AuthReducerKey)
  loginUserId=userId;
  const [TeamsData, setTeamsData] = useState([]);
  const storageFilterId = 'teams-filter';
  const navigator = useNavigate();
  const fetchTeamsData = async () => {

    try {
      
      const response = await axios.get(`${API_URL}/User/all?companyId=${companyId}`, {
     
      });
      debugger
//console.log(JSON.stringify(response.data));
      const formattedData = response.data.map((user) => {
        const rawDate = new Date(user.dateOfBirth);
        const formattedDate = `${String(rawDate.getDate()).padStart(2, '0')}-${String(rawDate.getMonth() + 1).padStart(2, '0')}-${rawDate.getFullYear()}`;

        return {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          userName: user.userName,
          dateOfBirth: formattedDate,
          userId: user.userID,
          status:user.status,
          team: {
            name: `${user.firstName} ${user.lastName}`,
            description: user.email,
          },
          rating: {
            value: user.userName,
            round: 0,
          },
          lastModified: formattedDate,
          members: {
            size: 'size-[30px]',
            group: [
              { filename: '300-4.png' },
              { filename: '300-1.png' },
              { filename: '300-2.png' },
            ],
            more: {
              number: user.userId,
              variant: 'text-success-inverse ring-success-light bg-success',
            },
          },
          rolenames:user.roleNames,
          roleids:user.roleIds,
        };
      });

      setTeamsData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch Teams data');
    }
  };

  useEffect(() => {
    fetchTeamsData();
  }, []);

  const handleDelete = async (userId,Name) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${API_URL}/User/delete/${userId}?modifiedBy=${loginUserId}`);
      toast.success('User deleted successfully');


      
// Send Notification
await sendNotification(
  userId,
   46, // Assuming 46 is the notification setting ID for the user deletion
   'User deleted notification',
   'User deletion Successful',
   '28',
   Name
 );
      fetchTeamsData(); // Fetch updated list after successful deletion
    } catch (error) {
      console.error("Error deleting user:", error.message);
      toast.error('Failed to delete user');
    }
  };

  const ColumnInputFilter = ({ column }) => {
    return (
      <Input
        placeholder="Filter..."
        value={column.getFilterValue() ?? ''}
        onChange={(event) => column.setFilterValue(event.target.value)}
        className="h-9 w-full max-w-40"
      />
    );
  };

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.name,
        id: 'name',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Name"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        cell: (info) => (
          <div className="flex flex-col gap-2">
            <Link
              className="leading-none font-medium text-sm text-gray-900 hover:text-primary"
              to="#"
            >
              {info.row.original.name}
            </Link>
          </div>
        ),
        meta: {
          headerClassName: 'min-w-[250px]',
          cellClassName: 'text-gray-700 font-normal',
        },
      },
      {
        accessorFn: (row) => row.email,
        id: 'email',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Email"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        cell: (info) => info.getValue(),
        meta: {
          headerClassName: 'min-w-[250px]',
          cellClassName: 'text-gray-700 font-normal',
        },
      },
      {
        accessorFn: (row) => row.status,
        id: 'status',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Status"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        cell: (info) => {
          const status = info.getValue();
          let badgeColor = 'bg-gray-500';
          if (status?.toLowerCase() === 'active') {
            badgeColor = 'bg-green-500';
          } else if (status?.toLowerCase() === 'inactive') {
            badgeColor = 'bg-red-500';
          } else if (status?.toLowerCase() === 'pending') {
            badgeColor = 'bg-yellow-500';
          }
          return (
            <span className={`text-white py-1 px-3 rounded-full ${badgeColor}`}>
              {status}
            </span>
          );
        },
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'text-gray-700 font-normal',
        },
      },
      {
        accessorFn: (row) => row.rolenames,
        id: 'rolenames',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Role"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        cell: (info) => info.getValue(),
        meta: {
          headerClassName: 'min-w-[250px]',
          cellClassName: 'text-gray-700 font-normal',
        },
      },
      // {
      //   accessorFn: (row) => row.address,
      //   id: 'address',
      //   header: ({ column }) => (
      //     <DataGridColumnHeader title="Address" column={column} />
      //   ),
      //   cell: (info) => info.getValue(),
      //   meta: {
      //     headerClassName: 'w-[200px]',
      //     cellClassName: 'text-gray-700 font-normal',
      //   },
      // },
      {
        accessorFn: (row) => row.dateOfBirth,
        id: 'dateOfBirth',
        header: ({ column }) => (
          <DataGridColumnHeader title="Date of Birth" column={column} />
        ),
        cell: (info) => info.getValue(),
        meta: {
          headerClassName: 'w-[200px]',
          cellClassName: 'text-gray-700 font-normal',
        },
      },
      {
        id: 'edit',
        header: () => '',
        enableSorting: false,
        cell: ({ row }) => (
          <button
            className="btn btn-sm btn-icon btn-clear btn-light"
            onClick={() =>
              navigator('/public-profile/drcurves/RoleManagement', {
                state: { userId: row.original.userId },
                replace: false,
              })
            }
          >
            <KeenIcon icon="notepad-edit" />
          </button>
        ),
        meta: {
          headerClassName: 'w-[60px]',
        },
      },
      {
        id: 'delete',
        header: () => '',
        enableSorting: false,
        cell: ({ row }) => (
          <button
            className="btn btn-sm btn-icon btn-clear btn-light"
            onClick={() => handleDelete(row.original.userId,row.original.email)}
          >
            <KeenIcon icon="trash" />
          </button>
        ),
        meta: {
          headerClassName: 'w-[60px]',
        },
      },
    ],
    [navigator]
  );

  const [searchTerm, setSearchTerm] = useState(() => {
    return localStorage.getItem(storageFilterId) || '';
  });

  useEffect(() => {
    localStorage.setItem(storageFilterId, searchTerm);
  }, [searchTerm]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return TeamsData;

    return TeamsData.filter(
      (team) =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, TeamsData]);

  const Toolbar = () => {
    const { table } = useDataGrid();
    return (
      <div className="card-header flex-wrap px-5 py-5 border-b-0">
        <h3 className="card-title">Teams</h3>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex gap-6">
            <div className="relative">
              <KeenIcon
                icon="magnifier"
                className="leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"
              />
              <input
                type="text"
                placeholder="Search Teams"
                className="input input-sm ps-8"
                value={table.getColumn('name')?.getFilterValue() ?? ''}
                onChange={(event) =>
                  table.getColumn('name')?.setFilterValue(event.target.value)
                }
              />
            </div>
          </div>
          <DataGridColumnVisibility table={table} />
        </div>
      </div>
    );
  };

  return (
    <DataGrid
      columns={columns}
      data={filteredData}
      rowSelection={false}
      pagination={{ size: 10 }}
      sorting={[{ id: 'team', desc: false }]}
      toolbar={<Toolbar />}
      layout={{ card: true }}
    />
  );
};

export { Teams };
