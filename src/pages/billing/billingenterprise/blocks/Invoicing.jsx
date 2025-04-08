/* eslint-disable prettier/prettier */
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { DataGrid, DataGridColumnHeader, DataGridRowSelect,DataGridColumnVisibility, DataGridRowSelectAll, useDataGrid, KeenIcon } from '@/components';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { RightDrawer } from './RightDrawer';
import { useSelector } from 'react-redux';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
//const companyId = 1; // Replace with the dynamic company ID

const Invoicing = () => {
  const {userId, companyId} = useSelector(state => state.AuthReducerKey);
  const [billingData, setBillingData] = useState([]);
  const [loading, setLoading] = useState(true);

  // State to handle RightDrawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  const openDrawer = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    //setSelectedInvoiceItemId(invoiceItemId);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedInvoiceId(null);
  };

  // Fetch billing data
  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        //const response = await axios.get(`${API_URL}/Billing/GetAllBillingByCompanyId/${companyId}`);
        const response = await axios.get(`${API_URL}/Payment/GetAllPaymentsByCompanyId/${companyId}`);
        setBillingData(response.data);
      } catch (error) {
        console.error('Error fetching billing data:', error);
        toast.error('Failed to fetch billing data.');
      } finally {
        setLoading(false);
      }
    };

    fetchBillingData();
  }, []);

  // Define columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: () => <DataGridRowSelectAll />,
        cell: ({ row }) => <DataGridRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        meta: { headerClassName: 'w-0' },
      },
      {
        accessorFn: (row) => row.invoiceNumber,
        id: 'invoiceNumber',
        header: ({ column }) => <DataGridColumnHeader title="Member" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <button
            className="btn btn-link text-primary underline"
            onClick={() => openDrawer(info.row.original.invoiceId)}
          >
            {info.row.original.invoiceNumber}
          </button>
        ),
        meta: { headerClassName: 'min-w-[120px]', cellClassName: 'text-gray-800 font-normal' },
      },
      {
        accessorFn: (row) => row.paymentStatus,
        id: 'paymentStatus',
        header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
        enableSorting: true,
        cell: (info) => (
          <div
            className={`badge badge-sm badge-outline ${
              info.row.original.paymentStatus === 'Completed' ? 'badge-success' : 'badge-warning'
            }`}
          >
            {info.row.original.paymentStatus}
          </div>
        ),
        meta: { headerClassName: 'w-[120px]' },
      },
      {
        accessorFn: (row) => row.paymentDate,
        id: 'paymentDate',
        header: ({ column }) => <DataGridColumnHeader title="Date" column={column} />,
        enableSorting: true,
        cell: (info) =>
          new Date(info.row.original.paymentDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
        meta: { headerClassName: 'min-w-[150px]', cellClassName: 'text-gray-800 font-normal' },
      },
      {
        // accessorFn: (row) => row.dueDate,
        // id: 'dueDate',
        // header: ({ column }) => <DataGridColumnHeader title="Due Date" column={column} />,
        // enableSorting: true,
        // cell: (info) =>
        //   new Date(info.row.original.dueDate).toLocaleDateString('en-GB', {
        //     day: '2-digit',
        //     month: 'short',
        //     year: 'numeric',
        //   }),
        // meta: { headerClassName: 'min-w-[150px]', cellClassName: 'text-gray-800 font-normal' },
        accessorFn: (row) => row.paymentTypeUsed,
        id: 'paymentTypeUsed',
        header: ({ column }) => <DataGridColumnHeader title="Payment Method" column={column} />,
        enableSorting: true,
        cell: (info) =>
          `${info.row.original.paymentTypeUsed}`,
        meta: { headerClassName: 'min-w-[150px]', cellClassName: 'text-gray-800 font-normal' },
      },
      {
        
        accessorFn: (row) => row.companyName,
        id: 'companyName',
        header: ({ column }) => <DataGridColumnHeader title="Client" column={column} />,
        enableSorting: true,
        cell: (info) =>
          `${info.row.original.companyName}`,
        meta: { headerClassName: 'min-w-[150px]', cellClassName: 'text-gray-800 font-normal' },
      },
      {
        accessorFn: (row) => row.paymentAmount,
        id: 'paymentAmount',
        header: ({ column }) => <DataGridColumnHeader title="Amount" column={column} />,
        enableSorting: true,
        cell: (info) => `$${info.row.original.paymentAmount}`,
        meta: { headerClassName: 'w-[120px]', cellClassName: 'text-gray-800 font-normal' },
      },      
      {
        id: 'actions',
        header: () => '',
        enableSorting: false,
        cell: (info) => (
          <div className="flex gap-0.5">
            <div className="btn btn-sm btn-icon btn-clear btn-light" onClick={() => {openDrawer(info.row.original.invoiceId)}}>
              <KeenIcon icon="menu" />
            </div>
            {/* <div className="btn btn-sm btn-icon btn-clear btn-light" onClick={()=>deletePaymentMethod(item.id)}>
              <KeenIcon icon="trash" />
            </div> */}
          </div>
        ),
        meta: { headerClassName: 'w-[100px]' },
      },
    ],
    []
  );
  const Toolbar = () => {
    const { table } = useDataGrid();
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
      <div className="card-header border-b-0 px-5 flex-wrap">
        <h3 className="card-title">Billing and Invoicing</h3>
        <div className="flex flex-wrap items-center gap-2.5">
          {/* <button className="btn btn-light btn-sm">
            <KeenIcon icon="exit-down" />
            Download PDF
          </button> */}
          <DataGridColumnVisibility table={table} />
        </div>
      </div>
    );
  };
  return (
    <div>
      <DataGrid
        columns={columns}
        data={billingData}
        rowSelection={true}
        pagination={{ size: 5 }}
        sorting={[{ id: 'billingId', desc: true }]}
        toolbar={<Toolbar />}
        layout={{ card: true }}
        isLoading={loading}
      />

      {/* RightDrawer */}
      {isDrawerOpen && (
        <RightDrawer
          isDrawerOpen={isDrawerOpen}
          onClose={closeDrawer}
          invoiceId={selectedInvoiceId}
        />
      )}
    </div>
  );
};

export { Invoicing };
