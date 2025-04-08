import React, { useMemo } from "react";
import {
  DataGrid,
  DataGridColumnHeader,
  DataGridRowSelect,
  DataGridRowSelectAll,
  useDataGrid
} from "@/components";

const staticData = [
  {
    id: 1,
    timestamp: "2024-11-01 8:30",
    user: "User123",
    activityType: "Profile Update",
    description: "Sed ut perspiciatis unde omnis iste natu error sit voluptatem",
  },
  {
    id: 2,
    timestamp: "2024-11-01 9:15",
    user: "User456",
    activityType: "Password Change",
    description: "Sed ut perspiciatis unde omnis iste natu error sit voluptatem",
  },
  {
    id: 3,
    timestamp: "2024-11-01 10:45",
    user: "User789",
    activityType: "Feature Usage",
    description: "Unde omnis iste natur error sit volup",
  },
  {
    id: 4,
    timestamp: "2024-11-01 11:00",
    user: "User321",
    activityType: "Report Generation",
    description: "Sed ut perspiciatis unde omnis iste",
  },
  {
    id: 5,
    timestamp: "2024-11-01 11:30",
    user: "User654",
    activityType: "Download Document",
    description: "Sed ut perspiciatis unde omnis iste natu error",
  },
];

const FutureTabel = ({userActivities}) => {
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
        accessorKey: "timestamp",
        header: ({ column }) => (
          <DataGridColumnHeader title="Timestamp" column={column} />
        ),
        enableSorting: true,
        meta: {
          headerClassName: "min-w-[150px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorKey: "user",
        header: ({ column }) => (
          <DataGridColumnHeader title="User" column={column} />
        ),
        enableSorting: true,
        meta: {
          headerClassName: "min-w-[150px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorKey: "activityType",
        header: ({ column }) => (
          <DataGridColumnHeader title="Activity Type" column={column} />
        ),
        enableSorting: true,
        meta: {
          headerClassName: "min-w-[200px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <DataGridColumnHeader title="Description" column={column} />
        ),
        enableSorting: false,
        meta: {
          headerClassName: "min-w-[300px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
    ],
    []
  );
 const Toolbar = () => {
    const { table } = useDataGrid();
    return (
      <div className="card-header border-b-0 px-5 flex-wrap">
        <h3 className="card-title">Future Details </h3>
        <div className="flex flex-wrap items-center gap-2.5"></div>
      </div>
    );
  };
  return (
    <DataGrid
      columns={columns}
      toolbar={<Toolbar />}
      
      // data={staticData}
      data={userActivities}
      rowSelection={true}
      pagination={{ size: 5 }}
      sorting={[{ id: "timestamp", desc: false }]}
      layout={{ card: true }}
    />
  );
};

export { FutureTabel };
