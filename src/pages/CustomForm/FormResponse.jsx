import React, { useEffect, useState, useMemo, useCallback, Fragment } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { Box, Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
const generateRandomId = () => Math.floor(Math.random() * 1000000);

// --------------------------
// Helper Functions
// --------------------------
const isTextBasedField = (type) => {
  const textTypes = ["text", "textarea", "password", "email", "tel", "date"];
  return textTypes.includes(type);
};

const countWords = (str) => {
  if (!str) return 0;
  return str
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
};

const countChars = (str) => {
  if (!str) return 0;
  return str.length;
};

const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const isEmpty = (value, type) => {
  if (type === "checkbox") {
    return !Array.isArray(value) || value.length === 0;
  }
  if (type === "select2") {
    if (value === undefined || value === null) return true;
    if (Array.isArray(value)) return value.length === 0;
    return value === "";
  }
  return value === undefined || value === "" || value === null;
};

// --------------------------
// Main FormResponse Component
// --------------------------
const FormResponse = () => {
  const { formId } = useParams();
  const navigate = useNavigate();

  // State for form structure and responses
  const [formData, setFormData] = useState(null);
  const [pages, setPages] = useState([]); // parsed pages array
  const [formName, setFormName] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [inputData, setInputData] = useState([]); // Array of response objects

  // -------------------------------
  // Fetch Form Structure
  // -------------------------------
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/CustomForm/GetCustomFormById/${formId}`
        );
        console.log("✅ Full API Response:", response.data);
        if (response.data && response.data.length > 0) {
          const formDetails = response.data[0];
          setFormData(formDetails);
          setFormName(formDetails.formName || "Unnamed Form");

          // Parse the stored JSON structure for pages
          const parsed = JSON.parse(formDetails.otherJSON) || [];
          if (Array.isArray(parsed)) {
            setPages(parsed);
          } else if (parsed.pages && Array.isArray(parsed.pages)) {
            setPages(parsed.pages);
          } else {
            console.error("Unexpected JSON format:", parsed);
            setPages([]);
          }
          toast.success("Form loaded successfully!");
        } else {
          console.warn("⚠️ No form data received!");
          setFormName("Unnamed Form");
          setPages([]);
          toast.error("No form data received!");
        }
      } catch (error) {
        console.error("❌ Error fetching form structure:", error);
        setFormName("Error Loading Form");
        toast.error("Failed to load the form. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchFormData();
  }, [formId]);

  // -------------------------------
  // Fetch Form Responses
  // -------------------------------
  useEffect(() => {
    const fetchInputData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/CustomForm/GetCustomFormResponse?formId=${formId}`
        );
        const parsedResponses = response.data.map((item) => ({
          responseID: item.responseID,
          fields: JSON.parse(item.response),
        }));
        setInputData(parsedResponses);
        toast.success("Input data loaded successfully!");
      } catch (error) {
        console.error("❌ Error fetching input data:", error);
        toast.error("Failed to load input data. Please try again later.");
      }
    };
    fetchInputData();
  }, [formId]);

  // -------------------------------
  // Build Columns and Format Data (Memoized)
  // -------------------------------
  const mergedColumns = useMemo(() => {
    // Build columns from the form structure
    const formColumns = pages.flatMap((page) =>
      page.fields.map((field) => ({
        id: field.id,
        label: field.label,
      }))
    );
    const formFieldIds = new Set(formColumns.map((field) => field.id));
    // Identify missing fields in responses (e.g., deleted fields)
    const missingColumnsSet = new Set();
    inputData.forEach((responseItem) => {
      responseItem.fields.forEach((field) => {
        if (!formFieldIds.has(field.fieldId)) {
          missingColumnsSet.add(field.fieldId);
        }
      });
    });
    const missingColumns = Array.from(missingColumnsSet).map((fieldId) => {
      const field = inputData
        .flatMap((responseItem) => responseItem.fields)
        .find((f) => f.fieldId === fieldId);
      return { id: fieldId, label: `${field?.label || "Unknown Field"} (Deleted)` };
    });
    return [...formColumns, ...missingColumns];
  }, [pages, inputData]);

  const tableColumns = useMemo(
    () =>
      mergedColumns.map((col) => ({
        accessorKey: col.label,
        header: col.label,
      })),
    [mergedColumns]
  );

  const memoizedData = useMemo(() => {
    return inputData.map((responseItem) => {
      const row = {};
      mergedColumns.forEach((col) => {
        const matchingField = responseItem.fields.find(
          (item) => item.fieldId === col.id
        );
        row[col.label] =
          matchingField && matchingField.value ? matchingField.value : "N/A";
      });
      return row;
    });
  }, [mergedColumns, inputData]);

  // -------------------------------
  // CSV Export Function (Rows Parameter)
  // -------------------------------
  const handleExportRowsCSV = useCallback(
    (rows) => {
      const headers = tableColumns.map((col) => col.header);
      const csvRows = [headers.join(",")];
      rows.forEach((row) => {
        const rowData = tableColumns.map((col) => {
          const cell = row.original[col.accessorKey];
          return `"${(cell || "").toString().replace(/"/g, '""')}"`;
        });
        csvRows.push(rowData.join(","));
      });
      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("download", `${formName}_responses.csv`);
      a.click();
    },
    [tableColumns, formName]
  );

  // -------------------------------
  // Create the Material React Table Instance with Custom Toolbar Actions
  // -------------------------------
  const table = useMaterialReactTable({
    data: memoizedData,
    columns: tableColumns,
    enableRowSelection: true,
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    renderTopToolbarCustomActions: useCallback(
      ({ table }) => (
        <Box
          sx={{
            display: "flex",
            gap: "16px",
            padding: "8px",
            flexWrap: "wrap",
          }}
        >
          <Button
            disabled={table.getPrePaginationRowModel().rows.length === 0}
            onClick={() =>
              handleExportRowsCSV(table.getPrePaginationRowModel().rows)
            }
            startIcon={<FileDownloadIcon />}
            variant="contained"
            color="success"
          >
            Export All Rows
          </Button>
          <Button
            disabled={table.getRowModel().rows.length === 0}
            onClick={() => handleExportRowsCSV(table.getRowModel().rows)}
            startIcon={<FileDownloadIcon />}
            variant="contained"
            color="primary"
          >
            Export Page Rows
          </Button>
          <Button
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            onClick={() =>
              handleExportRowsCSV(table.getSelectedRowModel().rows)
            }
            startIcon={<FileDownloadIcon />}
            variant="contained"
            color="secondary"
          >
            Export Selected Rows
          </Button>
        </Box>
      ),
      [handleExportRowsCSV]
    ),
  });

  // -------------------------------
  // Render the Component
  // -------------------------------
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      {/* Header: Form Name & Total Response Count */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{formName}</h2>
        <p className="text-lg text-gray-600">
          Total Responses: {inputData.length}
        </p>
      </div>

      {/* Render the Material React Table with custom toolbar actions */}
      <MaterialReactTable table={table} />

      {/* Back Button */}
      <Box sx={{ mt: 2 }}>
        <Button onClick={() => navigate(-1)} variant="contained" color="primary">
          Back
        </Button>
      </Box>
    </div>
  );
};

export default FormResponse;
