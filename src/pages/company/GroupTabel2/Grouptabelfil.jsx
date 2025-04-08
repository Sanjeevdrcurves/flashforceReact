import React, { useMemo, useState } from "react";
import {
  DataGrid,
  DataGridRowSelectAll,
  DataGridColumnHeader,
  useDataGrid,
  KeenIcon,
  DataGridColumnVisibility,
  DataGridColumnFilter
} from "@/components";

// Static data for rows
const staticData = [
  { id: "1", column1: "Data 1", column2: "Info 1", column3: "Details 1" },
  { id: "2", column1: "Data 2", column2: "Info 2", column3: "Details 2" },
  { id: "3", column1: "Data 3", column2: "Info 3", column3: "Details 3" },
  { id: "4", column1: "Data 4", column2: "Info 4", column3: "Details 4" },
];

const Grouptablefil = () => {
  const [selectedRows, setSelectedRows] = useState({});
  const [groupedRows, setGroupedRows] = useState([]);

  // Columns definition with checkboxes
  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: () => <DataGridRowSelectAll />,
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selectedRows[row.original.id] || false}
            onChange={(e) => {
              setSelectedRows((prev) => ({
                ...prev,
                [row.original.id]: e.target.checked,
              }));
            }}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "column1",
        header: ({ column }) => <DataGridColumnHeader title="Column 1" column={column} />,
        cell: (info) => info.row.original.column1,
      },
      {
        accessorKey: "column2",
        header: ({ column }) => <DataGridColumnHeader title="Column 2" column={column} />,
        cell: (info) => info.row.original.column2,
      },
      {
        accessorKey: "column3",
        header: ({ column }) => <DataGridColumnHeader title="Column 3" column={column} />,
        cell: (info) => info.row.original.column3,
      },
    ],
    [selectedRows]
  );

  const Toolbar = () => {
    const { table } = useDataGrid();

    // Dynamically generate options from column names
    const columnOptions = columns
      .filter((col) => col.accessorKey) // Ensure only columns with accessorKey are included
      .map((col) => ({ value: col.accessorKey, label: col.accessorKey }));

    return (
      <div className="card-header border-b-0 px-5 flex-wrap">
        <h3 className="card-title">Billing and Invoicing</h3>
        <div className="flex flex-wrap items-center gap-2.5">
          <button className="btn btn-light btn-sm">
            <KeenIcon icon="exit-down" />
            Download PDF
          </button>
          <DataGridColumnVisibility table={table} saveLayout={true} />
          {/* Adding DataGridColumnFilter */}
          <DataGridColumnFilter column={table} title="Filter Columns" options={columnOptions} />
        </div>
      </div>
    );
  };

  // Combine staticData with grouped rows
  const data = useMemo(() => {
    return staticData;
  }, []);

  return (
    <div className="p-4">
      <DataGrid columns={columns} data={data} toolbar={<Toolbar />} rowSelection={true} />
    </div>
  );
};

export default Grouptablefil;
