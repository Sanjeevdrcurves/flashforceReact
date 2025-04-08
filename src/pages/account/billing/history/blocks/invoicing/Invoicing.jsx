/* eslint-disable prettier/prettier */
import { useMemo } from 'react';
import { useState, useEffect, Fragment } from 'react';
import { DataGrid, DataGridColumnHeader, DataGridColumnVisibility, DataGridRowSelect, DataGridRowSelectAll, useDataGrid, KeenIcon } from '@/components';
import { InvoicingData } from './';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Invoicing = () => {
  const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
  const {userId,companyId}=useSelector(state=>state.AuthReducerKey);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchInvoicingByCompany();
    
    }, []);
  
    
  
    const fetchInvoicingByCompany = async () => {
      
      try {
        var nietos = [];
        const response = await axios.get(`${API_URL}/Billing/GetAllBillingByCompanyId/90`);
        console.log('GetAllBillingByCompanyId Response:', response.data);
        if (response.data.length > 0) {
          response.data.map((item, index) => {
            let date = new Date(item.createDate);
            let createdDate = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(date);
              
            let ddate = new Date(item.dueDate);
            let dueDate = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(ddate);
              
            var comp = {
              invoice: 'INV-'+item.billingId,
              label: item.status,
              color: item.status == 'Paid'?'badge-success':'badge-warning',
              date: createdDate,
              dueDate: dueDate,
              // Changed to date
              amount: item.billingAmount
            }
            nietos.push(comp);
          })
        }
        setInvoices(nietos);
        
      } catch (error) {
        console.error('Error GetAllBillingByCompanyId:', error);
      }
    };
  const ColumnInputFilter = ({
    column
  }) => {
    return <Input placeholder="Filter..." value={column.getFilterValue() ?? ''} onChange={event => column.setFilterValue(event.target.value)} className="h-9 w-full max-w-40" />;
  };
  const columns = useMemo(() => [{
    accessorKey: 'id',
    header: () => <DataGridRowSelectAll />,
    cell: ({
      row
    }) => <DataGridRowSelect row={row} />,
    enableSorting: false,
    enableHiding: false,
    meta: {
      headerClassName: 'w-0'
    }
  }, {
    accessorFn: row => row.invoice,
    id: 'invoice',
    header: ({
      column
    }) => <DataGridColumnHeader title="Member" filter={<ColumnInputFilter column={column} />} column={column} />,
    enableSorting: true,
    cell: info => {
      return info.row.original.invoice;
    },
    meta: {
      headerClassName: 'min-w-[200px]',
      cellClassName: 'text-gray-800 font-normal'
    }
  }, {
    accessorFn: row => row.label,
    id: 'label',
    header: ({
      column
    }) => <DataGridColumnHeader title="Status" column={column} />,
    enableSorting: true,
    cell: info => {
      return <div className={`badge badge-sm badge-outline ${info.row.original.color}`}>
              {info.row.original.label}
            </div>;
    },
    meta: {
      headerClassName: 'w-[170px]'
    }
  }, {
    accessorFn: row => row.date,
    id: 'date',
    header: ({
      column
    }) => <DataGridColumnHeader title="Date" column={column} />,
    enableSorting: true,
    cell: info => {
      return info.row.original.date;
    },
    meta: {
      headerClassName: 'min-w-[170px]',
      cellClassName: 'text-gray-800 font-normal'
    }
  }, {
    accessorFn: row => row.dueDate,
    id: 'dueDate',
    header: ({
      column
    }) => <DataGridColumnHeader title="Due Date" column={column} />,
    enableSorting: true,
    cell: info => {
      return info.row.original.dueDate;
    },
    meta: {
      headerClassName: 'min-w-[170px]',
      cellClassName: 'text-gray-800 font-normal'
    }
  }, {
    accessorFn: row => row.amount,
    id: 'amount',
    header: ({
      column
    }) => <DataGridColumnHeader title="Amount" column={column} />,
    enableSorting: true,
    cell: info => {
      return info.row.original.amount;
    },
    meta: {
      headerClassName: 'w-[170px]',
      cellClassName: 'text-gray-800 font-normal'
    }
  }, {
    id: 'actions',
    header: () => '',
    enableSorting: false,
    cell: () => {
      return <button className="btn btn-link">Download</button>;
    },
    meta: {
      headerClassName: 'w-[100px]'
    }
  }], []);
  //const data = useMemo(() => InvoicingData, []);
  const data = useMemo(() => invoices, [invoices]);
  const handleRowSelection = state => {
    const selectedRowIds = Object.keys(state);
    if (selectedRowIds.length > 0) {
      toast(`Total ${selectedRowIds.length} are selected.`, {
        description: `Selected row IDs: ${selectedRowIds}`,
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo')
        }
      });
    }
  };
  const Toolbar = () => {
    const {
      table
    } = useDataGrid();
    const isFiltered = table.getState().columnFilters.length > 0;
    return <div className="card-header border-b-0 px-5 flex-wrap">
        <h3 className="card-title">Billing and Invoicing</h3>

        <div className="flex flex-wrap items-center gap-2.5">
          <button className="btn btn-light btn-sm">
            <KeenIcon icon="exit-down" />
            Download PDF
          </button>
          <DataGridColumnVisibility table={table} />
        </div>
      </div>;
  };
  return <DataGrid columns={columns} data={data} rowSelection={true} onRowSelectionChange={handleRowSelection} pagination={{
    size: 5
  }} sorting={[{
    id: 'invoice',
    desc: false
  }]} toolbar={<Toolbar />} layout={{
    card: true
  }} />;
};
export { Invoicing };