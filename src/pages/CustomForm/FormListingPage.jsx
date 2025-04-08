import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { Box, Button, IconButton } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ContentCopyIcon from "@mui/icons-material/ContentCopy"; // For copying the shareable link
import EditIcon from "@mui/icons-material/Edit"; // For editing
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"; // For viewing responses
import FileCopyIcon from "@mui/icons-material/FileCopy"; // For duplicate action
import DeleteIcon from "@mui/icons-material/Delete"; // For deletion
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import { KeenIcon } from '@/components';


const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const FormListingPage = () => {
  const [forms, setForms] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  // Functions to handle edit, delete, view responses, and duplicate.
  const handleEdit = useCallback((linkingId, formid) => {
    navigate(`/customPlans/${formid}/${linkingId}`);
  }, [navigate]);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      try {
        await axios.post(
          `${API_URL}/CustomForm/DeleteCustomForm?formId=${id}&modifiedBy=user`
        );
        toast.success("Form deleted successfully!");
        setRefresh((prev) => !prev);
      } catch (error) {
        console.error("Error deleting form:", error);
        toast.error("Error deleting form. Please try again.");
      }
    }
  }, []);

  const handleViewResponses = useCallback((linkingId, formid) => {
    navigate(`/formResponse/${formid}`);
  }, [navigate]);

  const handelduplicate = useCallback((id) => {
    navigate(`/customPlans/${id}`, {
      state: { duplicate: true },
    });
    toast.success("Duplicate action initiated!");
  }, [navigate]);

  // Define the columns for the table.
  const columns = useMemo(
    () => [
      {
        accessorKey: "formName", // The key in the form data
        header: "Form Name",
        size: 150,
      },
      {
        accessorKey: "formId", // This key is used to build a shareable link
        header: "Shareable Link",
        size: 150,
        Cell: ({ row }) => {
          const id = row.original.linkId;
          const link = `${window.location.origin}/metronic/tailwind/react/publicForm/${id}`;
          
          const handleCopy = async (e) => {
            e.preventDefault();
            try {
              await navigator.clipboard.writeText(link);
              toast.success("Link copied to clipboard!");
            } catch (err) {
              console.error("Failed to copy text: ", err);
              toast.error("Failed to copy text!");
            }
          };
          
          return (
            <Box display="flex" alignItems="center">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline cursor-pointer"
              >
                {link}
              </a>
              <IconButton onClick={handleCopy} sx={{ ml: 1 }}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Box>
          );
        },
      },
      {
        header: "Actions",
        size: 200,
        Cell: ({ row }) => {
          const linkId = row.original.linkId;
          const formId = row.original.formId;
          return (
            <Box sx={{ display: "flex", gap: "8px" }}>
              <IconButton onClick={() => handleEdit(linkId, formId)} color="primary">
<KeenIcon icon="notepad-edit" />
              </IconButton>
              <IconButton onClick={() => handleViewResponses(formId, linkId)} color="info">
                <RemoveRedEyeIcon />
              </IconButton>
              <IconButton onClick={() => handelduplicate(formId)} color="secondary">
                <FileCopyIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(formId)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          );
        },
      },
    ],
    [handleEdit, handleViewResponses, handleDelete, handelduplicate]
  );

  const handleExportRows = (rows) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save("mrt-pdf-example.pdf");
    toast.success("Rows exported as PDF!");
  };

  // Create the table using the hook.
  const table = useMaterialReactTable({
    data: forms, // using "forms" as the data source
    columns,
    enableRowSelection: true,
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    // renderTopToolbarCustomActions: ({ table }) => (
    //   <Box
    //     sx={{
    //       display: "flex",
    //       gap: "16px",
    //       padding: "8px",
    //       flexWrap: "wrap",
    //     }}
    //   >
    //     {/* <Button
    //       disabled={table.getPrePaginationRowModel().rows.length === 0}
    //       onClick={() =>
    //         handleExportRows(table.getPrePaginationRowModel().rows)
    //       }
    //       startIcon={<FileDownloadIcon />}
    //       variant="contained"
    //       color="success"
    //     >
    //       Export All Rows
    //     </Button> */}
    //     {/* <Button
    //       disabled={table.getRowModel().rows.length === 0}
    //       onClick={() => handleExportRows(table.getRowModel().rows)}
    //       startIcon={<FileDownloadIcon />}
    //       variant="contained"
    //       color="primary"
    //     >
    //       Export Page Rows
    //     </Button> */}
    //     {/* <Button
    //       disabled={
    //         !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
    //       }
    //       onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
    //       startIcon={<FileDownloadIcon />}
    //       variant="contained"
    //       color="secondary"
    //     >
    //       Export Selected Rows
    //     </Button> */}
    //   </Box>
    // ),
  });

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/CustomForm/GetCustomFormById/0`
        );
        setForms(response.data);
        toast.success("Forms fetched successfully!");
      } catch (error) {
        console.error("Error fetching forms:", error);
        toast.error("Error fetching forms. Please try again later.");
      }
    };
    fetchForms();
  }, [refresh]);

  return <MaterialReactTable table={table} />;
};

export default FormListingPage;
