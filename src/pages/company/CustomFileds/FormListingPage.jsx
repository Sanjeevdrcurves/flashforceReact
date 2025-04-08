import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { jsPDF } from 'jspdf'; //or use your library of choice here
import autoTable from 'jspdf-autotable';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const CustomFiledLisiting = () => {
  const [forms, setForms] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  // Functions to handle edit, delete, and view responses.
  const handleEdit = useCallback((id) => {
    debugger
    navigate(`/customField/${id}`);
  }, [navigate]);
  const handelResponse = useCallback((id) => {
    
    navigate(`/customfieldresponsedemo/${id}`);
  }, [navigate]);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      try {
        await axios.post(
          `${API_URL}/CustomForm/DeleteCustomFormField?formFieldId=${id}&modifiedBy=123`
        );
        // Trigger a refresh after deletion.
        debugger
        setRefresh((prev) => !prev);
      } catch (error) {
        console.error("Error deleting form:", error);
      }
    }
  }, []);

  const handleViewResponses = useCallback((id) => {
    alert(`View responses for form with ID: ${id}`);
    navigate(`/formResponse/${id}`);
  }, [navigate]);
 
    const handelduplicate =useCallback((id)=>{
      navigate(`/customPlans/${id}`,{
        state: { duplicate: true },
      });
    },[navigate])

  // Define the columns for the table.
  const columns = useMemo(
    () => [
      {
        accessorKey: "formName", // The key in the form data
        header: "Form Name",
        size: 150,
      },
      // {
      //   accessorKey: "formId", // This key is used to build a shareable link
      //   header: "Shareable Link",
      //   size: 150,
      //   Cell: ({ row }) => {
      //     const id = row.original.linkId;
      //     const link = `${window.location.origin}/metronic/tailwind/react/publicForm/${id}`;
      //     const handleCopy = async (e) => {
      //       e.preventDefault();
      //       try {
      //         await navigator.clipboard.writeText(link);
      //         alert("Link copied to clipboard!");
      //       } catch (err) {
      //         console.error("Failed to copy text: ", err);
      //       }
      //     };
      //     return (
      //       <a
      //         href={link}
      //         onClick={handleCopy}
      //         className="text-blue-500 underline cursor-pointer"
      //       >
      //         {link}
      //       </a>
      //     );
      //   },
      // },
      {
        header: "Actions",
        size: 200,
        Cell: ({ row }) => {
          const id = row.original.masterCustomFormField;
          return (
            <div className="grid grid-cols-2 gap-4">
  <button
    onClick={() => handleEdit(id)}
    className="btn btn-sm btn-light"
  >
    Edit
  </button>
 
 
  <button
    onClick={() => handleDelete(id)}
    className="btn btn-sm btn-light"
  >
    Delete
  </button>
  <button
    onClick={() => handelResponse(id)}
    className="btn btn-sm btn-light"
  >
  Response
  </button>
</div>

          );
        },
      },
    ],
    [handleEdit, handleViewResponses, handleDelete]
  );
  const handleExportRows = (rows) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save('mrt-pdf-example.pdf');
  };

  // Create the table using the hook.
  const table = useMaterialReactTable({
    data: forms, // Note: using "data" instead of "forms"
    columns,
    enableRowSelection: true,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          //export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          startIcon={<FileDownloadIcon />}
        >
          Export All Rows
        </Button>
        <Button
          disabled={table.getRowModel().rows.length === 0}
          //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onClick={() => handleExportRows(table.getRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Page Rows
        </Button>
        <Button
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          //only export selected rows
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Selected Rows
        </Button>
      </Box>
    ),
  });

  // Fetch forms from the API.
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/CustomForm/GetCustomFormFieldById/0/46`
        );
        debugger
        setForms(response.data);
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };
    fetchForms();
  }, [refresh]);

  return <MaterialReactTable table={table} />;
};

export default CustomFiledLisiting;
