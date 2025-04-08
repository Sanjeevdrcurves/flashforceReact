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
  { id: "1", Name: "Data 1", username: "Info 1", column3: "Details 1", column4: "Extra 1", column5: "More 1", column6: "Additional 1" },
  { id: "2", Name: "Data 2", username: "Info 2", column3: "Details 2", column4: "Extra 2", column5: "More 2", column6: "Additional 2" },
  { id: "3", Name: "Data 3", username: "Info 3", column3: "Details 3", column4: "Extra 3", column5: "More 3", column6: "Additional 3" },
  { id: "4", Name: "Data 4", username: "Info 4", column3: "Details 4", column4: "Extra 4", column5: "More 4", column6: "Additional 4" },
];


const GroupTable = () => {
  const [selectedRows, setSelectedRows] = useState({});
  const [groupedRows, setGroupedRows] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [groupName, setGroupName] = useState("");
  const [showCreateGroupInput, setShowCreateGroupInput] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State to handle error messages
  const [editingGroupId, setEditingGroupId] = useState(null); // State to track which group is being edited
  const [newGroupName, setNewGroupName] = useState(""); // State to hold the new group name during edit

  // Handle selection changes
  const handleRowSelectionChange = (selected) => {
    setSelectedRows(selected);
  };

  // Handle creating a group
  const handleCreateGroup = () => {
    const selectedIds = Object.keys(selectedRows).filter((id) => selectedRows[id]);
    if (!groupName) {
      setErrorMessage("Group name is required.");
      return;
    }
    if (selectedIds.length === 0) {
      setErrorMessage("No rows selected. Please select rows to create a group.");
      return;
    }

    // Check if the group name already exists
    const groupExists = groupedRows.some((group) => group.name === groupName);
    if (groupExists) {
      setErrorMessage("Group name already exists.");
      return;
    }

    setGroupedRows((prev) => [
      ...prev,
      { id: `group-${Date.now()}`, groupedIds: selectedIds, name: groupName },
    ]);
    setSelectedRows({});
    setGroupName("");
    setShowCreateGroupInput(false); // Hide the input after group is created
    setErrorMessage(""); // Clear error message after successful group creation
  };

  // Handle toggling group expansion
  const toggleGroupExpand = (groupId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Handle adding row to the selected group
  const handleAddToGroup = () => {
    if (!selectedGroup) {
      alert("Please select a group first.");
      return;
    }

    const selectedIds = Object.keys(selectedRows).filter((id) => selectedRows[id]);

    if (selectedIds.length === 0) {
      setErrorMessage("No rows selected. Please select a row.");
      return;
    }

    setGroupedRows((prevGroups) => {
      return prevGroups.map((group) => {
        if (group.name === selectedGroup) {
          return { ...group, groupedIds: [...group.groupedIds, ...selectedIds] };
        }
        return group;
      });
    });

    setSelectedRows({});
    setErrorMessage(""); // Clear error message
  };

  // Handle removing a row from a group
  const handleRemoveFromGroup = (groupId, rowId) => {
    setGroupedRows((prevGroups) => {
      const updatedGroups = prevGroups.map((group) => {
        if (group.id === groupId) {
          const updatedGroupedIds = group.groupedIds.filter((id) => id !== rowId);
          return { ...group, groupedIds: updatedGroupedIds };
        }
        return group;
      });
      return updatedGroups;
    });

    const row = staticData.find((item) => item.id === rowId);
    if (row) {
      setGroupedRows((prevGroups) => {
        const updatedGroupedRows = prevGroups.filter((group) =>
          !group.groupedIds.includes(rowId)
        );
        return updatedGroupedRows;
      });
    }
  };

  // Handle editing a group's name
  const handleEditGroupName = (groupId) => {
    const group = groupedRows.find((group) => group.id === groupId);
    if (group) {
      setEditingGroupId(groupId);
      setNewGroupName(group.name);
    }
  };

  // Handle saving the new group name
  const handleSaveGroupName = () => {
    if (!newGroupName) {
      setErrorMessage("Group name cannot be empty.");
      return;
    }

    setGroupedRows((prevGroups) => {
      return prevGroups.map((group) => {
        if (group.id === editingGroupId) {
          return { ...group, name: newGroupName };
        }
        return group;
      });
    });

    setEditingGroupId(null); // Clear the editing state
    setNewGroupName(""); // Clear the input field
    setErrorMessage(""); // Clear error message after successful update
  };

  // Handle deleting a group
  const handleDeleteGroup = (groupId) => {
    const groupToDelete = groupedRows.find((group) => group.id === groupId);
    if (groupToDelete && groupToDelete.groupedIds.length > 0) {
      setErrorMessage("Cannot delete group because it contains rows.");
      return;
    }

    setGroupedRows((prevGroups) => prevGroups.filter((group) => group.id !== groupId));
    setErrorMessage(""); // Clear any error messages
  };

  // Columns definition with checkboxes
 // Columns definition with checkboxes
 const columns = useMemo(() => {
  // Extract columns dynamically from the first row's keys (excluding 'id')
  const dynamicColumns = Object.keys(staticData[0]).filter((key) => key !== "id").map((key) => ({
    accessorKey: key,
    header: ({ column }) => <DataGridColumnHeader title={key} column={column} />,
    cell: (info) => info.row.original[key],
  }));

  // Add the checkbox column to the beginning
  const selectColumn = {
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
  };

  return [selectColumn, ...dynamicColumns];
}, [selectedRows]);

  // Generate unique background colors for groups
  const generateBackgroundColor = (index) => {
    const colors = [
      "bg-blue-200", "bg-green-200", "bg-yellow-200", "bg-red-200", "bg-purple-200",
      "bg-indigo-200", "bg-teal-200", "bg-orange-200", "bg-pink-200", "bg-lime-200"
    ];
    return colors[index % colors.length];
  };

  // Combine staticData with grouped rows
  const data = useMemo(() => {
    const regularRows = staticData.filter((row) => {
      return !groupedRows.some((group) => group.groupedIds.includes(row.id));
    });

    return regularRows;
  }, [groupedRows]);
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
          <DataGridColumnFilter column={table} title="Filter Columns" options={columnOptions} />
          <DataGridColumnVisibility table={table} saveLayout={true} />
          {/* Adding DataGridColumnFilter */}
        </div>
      </div>
    );
  };
  return (
    <div className="p-4">
      <div className="mb-4">
        {groupedRows.length === 0 && !showCreateGroupInput ? (
          <button
            onClick={() => setShowCreateGroupInput(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Create New Group
          </button>
        ) : (
          <div>
            <select
              value={selectedGroup}
              onChange={(e) => {
                const selectedGroup = e.target.value;
                if (selectedGroup === "createNew") {
                  setShowCreateGroupInput(true);
                  setGroupName("");
                } else {
                  setSelectedGroup(selectedGroup);
                  setShowCreateGroupInput(false);
                }
              }}
              className="form-select px-2 py-1 border rounded mb-2"
            >
              <option value="">Select an existing group or create a new one</option>
              {groupedRows.map((group) => (
                <option key={group.id} value={group.name}>
                  {group.name} ({group.groupedIds.length} rows)
                </option>
              ))}
              <option value="createNew">Create New Group</option>
            </select>
          </div>
        )}

        {showCreateGroupInput && (
          <div className="mt-2 flex gap-4">
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter Group Name"
              className="form-input px-4 py-2 border rounded w-full max-w-sm"
            />
            <button
              onClick={handleCreateGroup}
              className="px-4 py-2 bg-blue-500 text-white rounded w-full max-w-xs"
              disabled={!groupName}
            >
              Create Group
            </button>
          </div>
        )}
      </div>

      {groupedRows.length > 0 && !showCreateGroupInput && selectedGroup && (
        <div className="mt-4">
          <button
            onClick={handleAddToGroup}
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={Object.keys(selectedRows).length === 0 || !selectedGroup}
          >
            Add Selected Rows to Group
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="mt-2 text-red-500">{errorMessage}</div>
      )}

      <div className="mt-6">
        {groupedRows.map((group, index) => {
          const groupColor = generateBackgroundColor(index);
          return (
            <div key={group.id} className="mb-4">
              <div
                className={`cursor-pointer text-lg font-semibold text-black px-4 py-2 rounded-md ${groupColor} flex items-center justify-between`}
                onClick={() => toggleGroupExpand(group.id)}
              >
                <div className="flex items-center gap-2">
                  {expandedGroups[group.id] ? (
                    <span className="text-xl">-</span>
                  ) : (
                    <span className="text-xl">+</span>
                  )}
                  {editingGroupId === group.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        className="form-input px-2 py-1 border rounded-md"
                      />
                      <button
                        onClick={handleSaveGroupName}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <span className="text-lg font-semibold text-black">
                      {group.name} ({group.groupedIds.length} rows)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditGroupName(group.id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <i className="ki-filled ki-notepad-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    className="text-red-500 hover:text-red-700"
                    disabled={group.groupedIds.length > 0}
                  >
                    <i className="ki-filled ki-trash"></i>
                  </button>
                </div>
              </div>

              {expandedGroups[group.id] && (
                <div className="ml-4 mt-2">
                  <table className="min-w-full bg-white shadow-md rounded-lg">
                    <tbody>
                      {group.groupedIds.map((id) => {
                        const row = staticData.find((item) => item.id === id);
                        return row ? (
                          <tr key={id}>
                            <td className="px-4 py-2 border-b">{row.column1}</td>
                            <td className="px-4 py-2 border-b">{row.column2}</td>
                            <td className="px-4 py-2 border-b">{row.column3}</td>
                            <td className="px-4 py-2 border-b">
                              <button
                                className="text-red-500"
                                onClick={() => handleRemoveFromGroup(group.id, id)}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ) : null;
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>


      <DataGrid
        columns={columns}
        data={data}
        rowSelection
        toolbar={<Toolbar />}
        onRowSelectionChange={handleRowSelectionChange}
      />
    </div>
  );
};

export default GroupTable;
