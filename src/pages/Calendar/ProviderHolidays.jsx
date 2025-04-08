// components/ProviderHolidays.jsx
import React from "react";
import { DataGrid, useDataGrid, DataGridColumnVisibility, KeenIcon } from "@/components";

export default function ProviderHolidays({
  providerData,
  handleEditHoliday,
  handleDeleteHoliday,
  setShowProviderHolidayDrawer,
  setProviderHolidayEditId,
  setPhTitle,
  setPhDateFrom,
  setPhDateTo,
  setPhDescription,
}) {
  const Toolbar = ({ searchColumn }) => {
    const { table } = useDataGrid();
    return (
      <div className="card-header flex-wrap px-5 py-5 border-b-0">
        <h3 className="card-title">Holidays</h3>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <KeenIcon
              icon="magnifier"
              className="text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"
            />
            <input
              type="text"
              placeholder="Search"
              className="input input-sm ps-8"
              value={table.getColumn(searchColumn)?.getFilterValue() ?? ""}
              onChange={(e) => table.getColumn(searchColumn)?.setFilterValue(e.target.value)}
            />
          </div>
          <DataGridColumnVisibility table={table} />
        </div>
      </div>
    );
  };

  const providerColumns = [
    { accessorKey: "provider", header: "Provider" },
    { accessorKey: "holidayName", header: "Title" },
    { accessorKey: "startDate", header: "Date From" },
    { accessorKey: "endDate", header: "Date To" },
    { accessorKey: "description", header: "Description" },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="text-blue-600"
            onClick={() =>
              handleEditHoliday(row.original.holidayId || row.original.id, "User")
            }
          >
            Edit
          </button>
          <button
            className="text-red-600"
            onClick={() =>
              handleDeleteHoliday(row.original.holidayId || row.original.id)
            }
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Provider Holidays</h2>
      <button
        onClick={() => {
          setProviderHolidayEditId(0);
          setPhTitle("");
          setPhDateFrom("");
          setPhDateTo("");
          setPhDescription("");
          setShowProviderHolidayDrawer(true);
        }}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Provider Holiday
      </button>
      <DataGrid
        columns={providerColumns}
        data={providerData}
        pagination={{ size: 10 }}
        toolbar={<Toolbar searchColumn="provider" />}
        layout={{ card: true }}
      />
    </div>
  );
}
