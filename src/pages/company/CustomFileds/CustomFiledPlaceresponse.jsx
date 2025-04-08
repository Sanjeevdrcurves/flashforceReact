import axios from "axios";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import { useNavigate, useParams } from "react-router";
import {
  Box,
  Button,
  Popover,
  Typography,
  TextField,
  MenuItem,
} from "@mui/material";
import { toast } from "sonner";
import { KeenIcon } from "@/components";
import { useSelector } from "react-redux";

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const CustomFieldPlaceResponse = () => {
  // ====================
  // Data & Navigation
  // ====================
  const [dynamicColumns, setDynamicColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const { userId, companyId } = useSelector((state) => state.AuthReducerKey);
  const navigate = useNavigate();
  const { formid } = useParams();

  // ====================
  // Filter & Sort State
  // ====================
  const [filterList, setFilterList] = useState([
    { column: "", value: "", order: "No Order" },
  ]);
  const [anchorElFilter, setAnchorElFilter] = useState(null);

  // ====================
  // Grouping State
  // ====================
  const [groupList, setGroupList] = useState([{ column: "" }]);
  const [anchorElGroup, setAnchorElGroup] = useState(null);

  // ==========================
  // Save & Load Layout State
  // ==========================
  const [layoutName, setLayoutName] = useState("");
  const [saveColumnSwitches, setSaveColumnSwitches] = useState({});
  const [anchorElSave, setAnchorElSave] = useState(null);

  // Manage Layouts Popover
  const [anchorElManage, setAnchorElManage] = useState(null);
  const [savedLayouts, setSavedLayouts] = useState([]);
  const [currentLayout, setCurrentLayout] = useState(null);

  // objectLayoutsId from the server
  const [objectLayoutsId, setObjectLayoutsId] = useState(0);

  // ====================
  // Object Types
  // ====================
  const [objectTypes, setObjectTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);

  // Helper for Popover ID
  const getPopoverId = (anchor) => (Boolean(anchor) ? "popover" : undefined);

  // ========================
  // 1) Fetch Object Types
  // ========================
  useEffect(() => {
    const fetchObjectTypes = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/CustomObject/GetObjectDetails?objectId=26`
        );
        const types = JSON.parse(response.data[0]?.types ?? "[]");
        setObjectTypes(types);

        // Auto-select first type if available
        if (types.length > 0) {
          setSelectedType(types[0]);
        }
      } catch (error) {
        console.error("Error fetching object types:", error);
        toast.error("Failed to load object types");
      }
    };
    fetchObjectTypes();
  }, []);

  // =====================================================================
  // 2) When selected type changes, fetch custom field columns
  // =====================================================================
  useEffect(() => {
    if (!selectedType) return;
    const fetchDynamicColumns = async () => {
      try {
        const resp = await axios.get(
          `${API_URL}/CustomObject/GetObjectCustomFields?objectCustomTypeId=0` +
            `&objectTypeId=${selectedType.ObjectTypeID}` +
            `&objectId=${selectedType.ObjectID}` +
            `&companyId=${companyId || 0}`
        );

        if (Array.isArray(resp.data) && resp.data.length > 0) {
          const item = resp.data[0];
          if (item && item.objectTypeFields) {
            // Parse 'objectTypeFields'
            const parsed = JSON.parse(item.objectTypeFields);
            const extractedColumns = [];
            // Flatten all fields from each section
            if (parsed.fields && Array.isArray(parsed.fields)) {
              parsed.fields.forEach((section) => {
                if (section.fields && Array.isArray(section.fields)) {
                  section.fields.forEach((field) => {
                    extractedColumns.push({
                      id: field.id,
                      label: field.label,
                      source: field.source, // "core" or "custom"
                      dbColumnName: field.dbcoloumName,
                    });
                  });
                }
              });
            }
            setDynamicColumns(extractedColumns);
            toast.success(`Loaded custom fields for ${selectedType.ObjectTypeName}`);
          } else {
            setDynamicColumns([]);
            toast.error("No objectTypeFields in API response");
          }
        } else {
          setDynamicColumns([]);
          toast.error("No data returned for custom fields");
        }
      } catch (err) {
        console.error("Error fetching dynamic columns:", err);
        toast.error("Failed to load custom fields");
      }
    };
    fetchDynamicColumns();
  }, [selectedType, companyId]);

  // ===========================
  // 3) Fetch Row Data
  // ===========================
  useEffect(() => {
    if (!selectedType) return;
    const fetchRows = async () => {
      try {
        const placeId = 0;
        const compId = companyId || 0;
        const customObjectTypeId = selectedType.ObjectTypeID || 0;
        const res = await axios.get(
          `${API_URL}/CustomObject/GetPlaces?placeId=${placeId}&companyId=${compId}&customObjectTypeId=${customObjectTypeId}`
        );
        // Keep the entire array of rows; copy 'CustomFieldData'
        const rawRows = res.data || [];
        const finalRows = rawRows.map((item) => ({
          ...item,
          customFieldData: item.CustomFieldData,
        }));
        setRows(finalRows);
        toast.success("Rows loaded successfully");
      } catch (error) {
        console.error("Error fetching rows:", error);
        toast.error("Failed to load rows");
      }
    };
    fetchRows();
  }, [selectedType, companyId]);

  // ====================
  // 4) Fetch Saved Layouts
  // ====================
  // Flush localStorage before fetching new layouts, then update localStorage with the new data.
  const fetchSavedLayouts = async (objectTypeId, objectId) => {
    localStorage.removeItem("customFieldResponseDemoLayouts");
    try {
      const response = await axios.get(
        `${API_URL}/CustomObject/GetObjectLayout?ObjectLayoutsId=0&objectId=${objectId}&objectTypeId=${objectTypeId}`
      );
      const data = Array.isArray(response.data)
        ? response.data[0]
        : response.data;
      if (!data) {
        toast.error("No data found in layout API response");
        setSavedLayouts([]);
        return;
      }
      const { objectLayoutsId, layouts } = data;
      setObjectLayoutsId(objectLayoutsId || 0);
      if (!layouts) {
        toast.error("No layouts found in API response");
        setSavedLayouts([]);
        return;
      }
      let parsedLayouts = [];
      if (typeof layouts === "string" && layouts.trim()) {
        try {
          parsedLayouts = JSON.parse(layouts);
        } catch (error) {
          console.error("Error parsing layouts JSON:", error);
          toast.error("Failed to parse layouts JSON");
        }
      } else if (Array.isArray(layouts)) {
        parsedLayouts = layouts;
      }
      localStorage.setItem("customFieldResponseDemoLayouts", JSON.stringify(parsedLayouts));
      setSavedLayouts(parsedLayouts);
    } catch (error) {
      console.error("Error fetching layouts:", error);
      toast.error("Failed to load layouts from API");
      setSavedLayouts([]);
    }
  };

  // Fetch layouts automatically when selectedType changes
  useEffect(() => {
    if (selectedType) {
      fetchSavedLayouts(selectedType.ObjectTypeID, selectedType.ObjectID);
    }
  }, [selectedType]);

  // ===================================
  // Initialize saveColumnSwitches
  // ===================================
  useEffect(() => {
    if (dynamicColumns.length > 0 && Object.keys(saveColumnSwitches).length === 0) {
      const initialSwitches = {};
      dynamicColumns.forEach((col) => {
        initialSwitches[col.id] = true;
      });
      setSaveColumnSwitches(initialSwitches);
    }
  }, [dynamicColumns, saveColumnSwitches]);

  // ======================
  // Helpers: Filter/Group
  // ======================
  const handleApplyFilters = (table) => {
    const newColumnFilters = [];
    const newSorting = [];
    filterList.forEach(({ column, value, order }) => {
      if (column && value) {
        newColumnFilters.push({ id: column, value });
      }
      if (column && order && order !== "No Order") {
        newSorting.push({ id: column, desc: order === "desc" });
      }
    });
    table.setColumnFilters(newColumnFilters);
    table.setSorting(newSorting);
    if (currentLayout) {
      const updatedLayout = {
        ...currentLayout,
        grouping: currentLayout.grouping || [],
        filters: newColumnFilters,
        sorting: newSorting,
      };
      updateLayoutInLocalStorage(updatedLayout);
      setCurrentLayout(updatedLayout);
    }
    setAnchorElFilter(null);
  };

  const handleApplyGrouping = (table) => {
    const groupingColumns = groupList.map((g) => g.column).filter(Boolean);
    table.setGrouping(groupingColumns);
    if (currentLayout) {
      const updatedLayout = {
        ...currentLayout,
        grouping: groupingColumns,
        filters: currentLayout.filters || [],
        sorting: currentLayout.sorting || [],
      };
      updateLayoutInLocalStorage(updatedLayout);
      setCurrentLayout(updatedLayout);
    }
    setAnchorElGroup(null);
  };

  // Simple helper to update one layout in localStorage
  const updateLayoutInLocalStorage = (layoutToUpdate) => {
    const localLayoutsStr = localStorage.getItem("customFieldResponseDemoLayouts");
    let localLayouts = localLayoutsStr ? JSON.parse(localLayoutsStr) : [];
    localLayouts = localLayouts.map((l) =>
      l.layoutName === layoutToUpdate.layoutName ? layoutToUpdate : l
    );
    localStorage.setItem("customFieldResponseDemoLayouts", JSON.stringify(localLayouts));
  };

  // ====================
  // Save Layout Locally
  // ====================
  const handleSaveLayout = (table) => {
    const { grouping, columnFilters, sorting } = table.getState();
    const columnsToSave = Object.keys(saveColumnSwitches).filter(
      (colId) => saveColumnSwitches[colId]
    );
    const filteredGrouping = grouping.filter((g) => columnsToSave.includes(g));
    const filteredFilters = columnFilters.filter((f) => columnsToSave.includes(f.id));
    const filteredSorting = sorting.filter((s) => columnsToSave.includes(s.id));
    const layout = {
      layoutName,
      grouping: filteredGrouping,
      filters: filteredFilters,
      sorting: filteredSorting,
      formid,
    };
    const localLayoutsStr = localStorage.getItem("customFieldResponseDemoLayouts");
    let localLayouts = localLayoutsStr ? JSON.parse(localLayoutsStr) : [];
    localLayouts.push(layout);
    localStorage.setItem("customFieldResponseDemoLayouts", JSON.stringify(localLayouts));
    setSavedLayouts(localLayouts);
    setCurrentLayout(layout);
    setAnchorElSave(null);
    toast.success("New layout created locally!");
  };

  // ====================
  // Remove Layout
  // ====================
  const handleRemoveLayout = async (layout) => {
    if (!window.confirm(`Remove layout: ${layout.layoutName}?`)) return;
    try {
      await axios.delete(`${API_URL}/deleteLayout`, {
        data: { layoutName: layout.layoutName, formid },
      });
      toast.success("Layout removed from API!");
    } catch (error) {
      console.error("Error removing layout from API", error);
      toast.error("Failed to remove layout from API");
    }
    const localLayoutsStr = localStorage.getItem("customFieldResponseDemoLayouts");
    let localLayouts = localLayoutsStr ? JSON.parse(localLayoutsStr) : [];
    localLayouts = localLayouts.filter((l) => l.layoutName !== layout.layoutName);
    localStorage.setItem("customFieldResponseDemoLayouts", JSON.stringify(localLayouts));
    setSavedLayouts(localLayouts);
    toast.success("Layout removed successfully!");
    if (currentLayout?.layoutName === layout.layoutName) {
      setCurrentLayout(null);
      setLayoutName("");
    }
  };

  // ====================
  // Apply Layout
  // ====================
  const handleApplyLayout = (layout, table) => {
    table.setGrouping(layout.grouping || []);
    table.setColumnFilters(layout.filters || []);
    table.setSorting(layout.sorting || []);
    setLayoutName(layout.layoutName || "");
    const loadedFilters = (layout.filters || []).map((filter) => {
      const sort = (layout.sorting || []).find((s) => s.id === filter.id);
      return {
        column: filter.id,
        value: filter.value,
        order: sort ? (sort.desc ? "desc" : "asc") : "No Order",
      };
    });
    setFilterList(
      loadedFilters.length
        ? loadedFilters
        : [{ column: "", value: "", order: "No Order" }]
    );
    const loadedGrouping = (layout.grouping || []).map((col) => ({ column: col }));
    setGroupList(loadedGrouping.length ? loadedGrouping : [{ column: "" }]);
    setCurrentLayout(layout);
    toast.success(`Loaded layout: ${layout.layoutName}`);
  };

  // ====================
  // Edit & Delete
  // ====================
  const handleEdit = (row) => {
    console.log("Edit clicked for row:", row);
    navigate(
      `/company/editplace/${selectedType.ObjectTypeName}/${selectedType.ObjectID}/${row.CustomObjectTypeId}/${row.PlaceId}`
    );
  };

  const handleDelete = (rowId) => {
    if (window.confirm("Are you sure you want to delete this row?")) {
      setRows((prev) => prev.filter((r) => r.id !== rowId));
      toast.success("Row deleted (local example only)");
    }
  };

  // ====================
  // Memo: Rows & Columns
  // ====================
  const memoizedData = useMemo(() => rows, [rows]);

  /**
   * For columns with source === 'core', map data from the outer object (row[dbColumnName]),
   * ignoring CustomFieldData. For columns with source !== 'core', parse CustomFieldData.
   */
  const memoizedColumns = useMemo(() => {
    const columns = dynamicColumns.map((col) => ({
      id: col.id,
      header:
        saveColumnSwitches[col.id] && layoutName
          ? `${col.label} (${layoutName})`
          : col.label,
      accessorFn: (row) => {
        if (col.source === "core") {
          if (col.dbColumnName) {
            const rowKey = Object.keys(row).find(
              (k) => k.toLowerCase() === col.dbColumnName.toLowerCase()
            );
            if (rowKey) return row[rowKey] ?? "-";
          }
          return "-";
        } else {
          if (!row.customFieldData) return "-";
          let parsedData;
          try {
            parsedData = JSON.parse(row.customFieldData);
          } catch (error) {
            console.error("Error parsing customFieldData:", error);
            return "-";
          }
          const found = parsedData.find((item) => item.fieldId === col.id);
          return found ? found.value : "-";
        }
      },
    }));

    // Add an "Actions" column at the end
    columns.push({
      id: "actions",
      header: "Actions",
      pin: "right",
      enableColumnOrdering: false,
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: "16px" }}>
          <Button variant="outlined" onClick={() => handleEdit(row.original)}>
            Edit
          </Button>
          <Button variant="contained" color="error" onClick={() => handleDelete(row.original.id)}>
            Delete
          </Button>
        </Box>
      ),
    });
    return columns;
  }, [dynamicColumns, layoutName, saveColumnSwitches]);

  // ====================
  // CSV Export
  // ====================
  const handleExportRowsCSV = useCallback(
    (rowsToExport, table) => {
      if (!rowsToExport?.length) {
        toast.error("No rows to export.");
        return;
      }
      const columns = memoizedColumns.filter((c) => c.id !== "actions");
      let csvContent =
        columns.map((c) => JSON.stringify(c.header)).join(",") + "\n";
      rowsToExport.forEach(({ original }) => {
        const rowData = columns.map((c) => {
          const value = c.accessorFn ? c.accessorFn(original) : "";
          return JSON.stringify(value);
        });
        csvContent += rowData.join(",") + "\n";
      });
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV export successful!");
    },
    [memoizedColumns]
  );

  // ====================
  // Save Object Layout
  // ====================
  const handleSaveObjectLayout = async () => {
    try {
      const localLayoutsStr = localStorage.getItem("customFieldResponseDemoLayouts");
      const allLayouts = localLayoutsStr ? JSON.parse(localLayoutsStr) : [];
      const payload = {
        objectLayoutsId: objectLayoutsId,
        objectId: selectedType?.ObjectID || 0,
        objectTypeId: selectedType?.ObjectTypeID || 0,
        companyId: companyId || 0,
        userId: userId || 0,
        layouts: JSON.stringify(allLayouts),
        createdBy: userId || 0,
      };
      await axios.post(`${API_URL}/CustomObject/AddObjectLayout`, payload);
      toast.success("Layouts saved to the API!");
    } catch (error) {
      console.error("Error saving object layout:", error);
      toast.error("Failed to save object layout to API");
    }
  };

  // ==========================
  // Custom Toolbar Actions
  // ==========================
  const renderTopToolbarCustomActions = useCallback(
    ({ table }) => {
      const groupingActive = groupList.some((g) => g.column);
      return (
        <Box>
          {/* Object Type Buttons */}
          <Box sx={{ mb: 2 }}>
            {objectTypes.map((type, idx) => (
              <Button
                key={idx}
                variant={
                  selectedType && selectedType.ObjectTypeID === type.ObjectTypeID
                    ? "contained"
                    : "outlined"
                }
                sx={{ mr: 1, mb: 1 }}
                onClick={() => {
                  setSelectedType(type);
                  // Fetch layouts for the newly selected type
                  fetchSavedLayouts(type.ObjectTypeID, type.ObjectID);
                }}
              >
                {type.ObjectTypeName}
              </Button>
            ))}
          </Box>

          {/* Existing Layout Buttons */}
          <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
            {savedLayouts.length === 0 ? (
              <Typography variant="body2" sx={{ mr: 2 }}>
                No saved layouts.
              </Typography>
            ) : (
              savedLayouts.map((layout) => {
                const isActive =
                  currentLayout &&
                  layout.layoutName === currentLayout.layoutName;
                return (
                  <Box
                    key={layout.layoutName}
                    onClick={() => handleApplyLayout(layout, table)}
                    style={{
                      cursor: "pointer",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      backgroundColor: isActive ? "#ffee58" : "#f5f5f5",
                      border: isActive ? "2px solid #fdd835" : "1px solid #ccc",
                    }}
                  >
                    {layout.layoutName}
                  </Box>
                );
              })
            )}
          </Box>

          {/* Other Toolbar Buttons */}
          <Box sx={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              onClick={() =>
                handleExportRowsCSV(
                  table.getPrePaginationRowModel().rows,
                  table
                )
              }
            >
              <KeenIcon icon="paper-clip" />
              Export
            </Button>

            <Button variant="outlined" onClick={(e) => setAnchorElFilter(e.currentTarget)}>
              <KeenIcon icon="filter" />
              Filters
            </Button>
            <Popover
              id={getPopoverId(anchorElFilter)}
              open={Boolean(anchorElFilter)}
              anchorEl={anchorElFilter}
              onClose={() => setAnchorElFilter(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
              <Box sx={{ p: 2, minWidth: 400 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Manage Filters &amp; Sorting
                </Typography>
                {filterList.map((filterItem, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1, flexWrap: "wrap" }}
                  >
                    <TextField
                      select
                      size="small"
                      label="Column"
                      value={filterItem.column}
                      onChange={(e) =>
                        setFilterList((prev) =>
                          prev.map((f, i2) =>
                            i2 === index ? { ...f, column: e.target.value } : f
                          )
                        )
                      }
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="">No Filter</MenuItem>
                      {memoizedColumns
                        .filter((col) => col.id !== "actions")
                        .map((col) => (
                          <MenuItem key={col.id} value={col.id}>
                            {col.header}
                          </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                      size="small"
                      label="Filter Value"
                      value={filterItem.value}
                      onChange={(e) =>
                        setFilterList((prev) =>
                          prev.map((f, i2) =>
                            i2 === index ? { ...f, value: e.target.value } : f
                          )
                        )
                      }
                      sx={{ minWidth: 120 }}
                    />
                    <TextField
                      select
                      size="small"
                      label="Order"
                      value={filterItem.order}
                      onChange={(e) =>
                        setFilterList((prev) =>
                          prev.map((f, i2) =>
                            i2 === index ? { ...f, order: e.target.value } : f
                          )
                        )
                      }
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="No Order">No Order</MenuItem>
                      <MenuItem value="asc">Ascending</MenuItem>
                      <MenuItem value="desc">Descending</MenuItem>
                    </TextField>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() =>
                        setFilterList((prev) => prev.filter((_, i3) => i3 !== index))
                      }
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
                <Button
                  variant="text"
                  onClick={() =>
                    setFilterList((prev) => [...prev, { column: "", value: "", order: "No Order" }])
                  }
                  sx={{ mb: 2 }}
                >
                  + Add Filter
                </Button>
                <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                  <Button onClick={() => setAnchorElFilter(null)}>Cancel</Button>
                  <Button variant="contained" onClick={() => handleApplyFilters(table)}>
                    Apply Filters
                  </Button>
                </Box>
              </Box>
            </Popover>
            <Button variant="outlined" onClick={(e) => setAnchorElGroup(e.currentTarget)}>
              <KeenIcon icon="copy-success" />
              Group By
            </Button>
            <Popover
              id={getPopoverId(anchorElGroup)}
              open={Boolean(anchorElGroup)}
              anchorEl={anchorElGroup}
              onClose={() => setAnchorElGroup(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
              <Box sx={{ p: 2, minWidth: 300 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Manage Grouping
                </Typography>
                {groupList.map((groupItem, idx) => (
                  <Box
                    key={idx}
                    sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1, flexWrap: "wrap" }}
                  >
                    <TextField
                      select
                      size="small"
                      label="Group Column"
                      value={groupItem.column}
                      onChange={(e) =>
                        setGroupList((prev) =>
                          prev.map((g, i2) =>
                            i2 === idx ? { ...g, column: e.target.value } : g
                          )
                        )
                      }
                      sx={{ minWidth: 200 }}
                    >
                      <MenuItem value="">No Group</MenuItem>
                      {memoizedColumns
                        .filter((col) => col.id !== "actions")
                        .map((col) => (
                          <MenuItem key={col.id} value={col.id}>
                            {col.header}
                          </MenuItem>
                        ))}
                    </TextField>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() =>
                        setGroupList((prev) => prev.filter((_, i3) => i3 !== idx))
                      }
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
                <Button variant="text" onClick={() => setGroupList((prev) => [...prev, { column: "" }])} sx={{ mb: 2 }}>
                  + Add Group
                </Button>
                <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                  <Button onClick={() => setAnchorElGroup(null)}>Cancel</Button>
                  <Button variant="contained" onClick={() => handleApplyGrouping(table)}>
                    Apply Grouping
                  </Button>
                </Box>
              </Box>
            </Popover>
            <Button variant="outlined" onClick={(e) => setAnchorElSave(e.currentTarget)}>
              <KeenIcon icon="plus" />
              Layout
            </Button>
            <Popover
              id={getPopoverId(anchorElSave)}
              open={Boolean(anchorElSave)}
              anchorEl={anchorElSave}
              onClose={() => setAnchorElSave(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
              <Box sx={{ p: 2, minWidth: 280 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Save Layout Settings
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  label="Layout Name"
                  value={layoutName}
                  onChange={(e) => setLayoutName(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 1 }}>
                  <Button onClick={() => setAnchorElSave(null)}>Cancel</Button>
                  <Button variant="contained" onClick={() => handleSaveLayout(table)}>
                    Save Layout
                  </Button>
                </Box>
              </Box>
            </Popover>
            <Button
              variant="outlined"
              onClick={(e) => {
                setAnchorElManage(e.currentTarget);
                if (selectedType) {
                  fetchSavedLayouts(selectedType.ObjectTypeID, selectedType.ObjectID);
                }
              }}
            >
              <KeenIcon icon="setting" />
              Layouts
            </Button>
            <Popover
              id={getPopoverId(anchorElManage)}
              open={Boolean(anchorElManage)}
              anchorEl={anchorElManage}
              onClose={() => setAnchorElManage(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
              <Box sx={{ p: 2, minWidth: 300 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Manage Layouts
                </Typography>
                {savedLayouts.length === 0 ? (
                  <Typography variant="body2">No layouts saved.</Typography>
                ) : (
                  savedLayouts.map((layout) => (
                    <Box key={layout.layoutName} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2">{layout.layoutName}</Typography>
                      <Box sx={{ display: "flex", gap: "8px" }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            handleApplyLayout(layout, table);
                            setAnchorElManage(null);
                          }}
                        >
                          Load
                        </Button>
                        <Button variant="outlined" color="error" size="small" onClick={() => handleRemoveLayout(layout)}>
                          Remove
                        </Button>
                      </Box>
                    </Box>
                  ))
                )}
                <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 1 }}>
                  <Button onClick={() => setAnchorElManage(null)}>Close</Button>
                </Box>
              </Box>
            </Popover>
            <Button variant="outlined" onClick={handleSaveObjectLayout}>
              <KeenIcon icon="cloud-download" />
              Save Layout
            </Button>
            {groupList.some((g) => g.column) && (
              <Typography variant="caption" color="error">
                Drag ordering is disabled when grouping is active.
              </Typography>
            )}
          </Box>
        </Box>
      );
    },
    [
      anchorElFilter,
      anchorElGroup,
      anchorElSave,
      anchorElManage,
      filterList,
      groupList,
      saveColumnSwitches,
      layoutName,
      memoizedColumns,
      savedLayouts,
      currentLayout,
      objectTypes,
      selectedType,
      handleExportRowsCSV,
    ]
  );

  // ====================
  // Render the Table
  // ====================
  const groupingActive = groupList.some((g) => g.column);

  return (
    <Box>
      <MaterialReactTable
        getRowId={(row) => row.id || row.PlaceId || Math.random()}
        columns={memoizedColumns}
        data={memoizedData}
        enableRowSelection
        enableGrouping
        enableRowOrdering={!groupingActive}
        enableSorting
        enableColumnOrdering
        muiRowDragHandleProps={({ table }) => ({
          onDragEnd: () => {
            const { draggingRow, hoveredRow } = table.getState();
            if (hoveredRow && draggingRow) {
              rows.splice(hoveredRow.index, 0, rows.splice(draggingRow.index, 1)[0]);
              setRows([...rows]);
            }
          },
        })}
        paginationDisplayMode="pages"
        groupingColumnDef={{
          header: "",
          size: 60,
          enableColumnOrdering: false,
          pin: "left",
          GroupedCell: ({ row, table }) => {
            const { grouping } = table.getState();
            const lastGroupId = grouping[grouping.length - 1];
            const groupValue = row.getValue(lastGroupId);
            return <Box sx={{ fontWeight: "bold" }}>Group: {groupValue}</Box>;
          },
          muiTableHeadCellProps: {
            sx: {
              position: "sticky",
              left: 0,
              backgroundColor: "white",
              zIndex: 1200,
            },
          },
          muiTableBodyCellProps: {
            sx: {
              position: "sticky",
              left: 0,
              backgroundColor: "inherit",
              zIndex: 100,
            },
          },
        }}
        enableColumnResizing
        groupedColumnMode="remove"
        positionToolbarAlertBanner="bottom"
        renderTopToolbarCustomActions={renderTopToolbarCustomActions}
      />
    </Box>
  );
};

export default CustomFieldPlaceResponse;
