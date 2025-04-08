// components/OfficeHolidays.jsx
import React from "react";
import { DataGrid, useDataGrid, DataGridColumnVisibility, KeenIcon } from "@/components";

export default function OfficeHolidays({
  officeData,
  handleEditHoliday,
  handleDeleteHoliday,
  setShowOfficeHolidayDrawer,
  setOfficeHolidayEditId,
  setOhTitle,
  setOhDateFrom,
  setOhDateTo,
  setOhRemarks,
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

  const officeColumns = [
    { accessorKey: "holidayName", header: "Holiday Title" },
    { accessorKey: "startDate", header: "Date From" },
    { accessorKey: "endDate", header: "Date To" },
    { accessorKey: "description", header: "Remarks" },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="text-blue-600"
            onClick={() =>
              handleEditHoliday(row.original.holidayId || row.original.id, "Office")
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
      <h2 className="text-xl font-semibold mb-2">Office Holidays</h2>
      <button
        onClick={() => {
          setOfficeHolidayEditId(0);
          setOhTitle("");
          setOhDateFrom("");
          setOhDateTo("");
          setOhRemarks("");
          setShowOfficeHolidayDrawer(true);
        }}
        className="mb-4 bg-red-600 text-white px-4 py-2 rounded"
      >
        Add Office Holiday
      </button>
      <DataGrid
        columns={officeColumns}
        data={officeData}
        pagination={{ size: 10 }}
        toolbar={<Toolbar searchColumn="holidayName" />}
        layout={{ card: true }}
      />
    </div>
  );
}
