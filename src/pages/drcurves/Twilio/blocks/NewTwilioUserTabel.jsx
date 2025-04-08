import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { DataGrid, DataGridColumnHeader, DataGridRowSelect, useDataGrid, DataGridRowSelectAll, KeenIcon } from '@/components';
import { RightDrawer } from './RightDrawer';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const NewTwilioUserTabel = () => {
  const [loading, setLoading] = useState(false);
  const { companyId, userId } = useSelector(state => state.AuthReducerKey);
  const [tableData, setTableData] = useState([]);
  const [isDrawer, setIsDrawer] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchTableData = async () => {
   // console.log('companid userid'+companyId,userId);
    
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/TwilioUser/GetByCompanyId/${companyId}/${userId}`);
      //console.log(JSON.stringify(response.data));
      
      setTableData(response?.data || []);
    } catch (error) {
      console.error('Error fetching table data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Twilio Account?')) return;

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/TwilioUser/Delete/${id}/${userId}`);
      toast.success('Twilio Account deleted successfully.');
      fetchTableData();
    } catch (error) {
      console.error('Error deleting Twilio Account:', error);
      toast.error('Failed to delete the Twilio Account.');
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      // { accessorKey: 'id', header: () => <DataGridRowSelectAll />, cell: ({ row }) => <DataGridRowSelect row={row} />, enableSorting: false },
      {
        accessorKey: 'srNo',
        header: ({ column }) => <DataGridColumnHeader title="Sr No" column={column} />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return pageIndex * pageSize + row.index + 1;
        }
    },{ accessorKey: 'companyName', header: ({ column }) => <DataGridColumnHeader title="Company Name" column={column} /> },
    { 
      accessorKey: 'twilioAccountSid', 
      header: ({ column }) => <DataGridColumnHeader title="Twilio Account SID" column={column} />, 
      cell: () => '******' 
    },
    { 
      accessorKey: 'twilioAuthToken', 
      header: ({ column }) => <DataGridColumnHeader title="Twilio Auth Token" column={column} />, 
      cell: () => '******' 
    },{ accessorKey: 'isActive', header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />, cell: ({ row }) => row.original.isActive ? 'Active' : 'Inactive' },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button className="btn btn-icon btn-sm" title="Edit" onClick={() => { setSelectedItem(row.original); setIsDrawer(true); }}>
              <KeenIcon icon="notepad-edit" />
            </button>
            <button className="btn btn-icon btn-sm text-danger" title="Delete" onClick={() => handleDelete(row.original.id)}>
              <KeenIcon icon="trash" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const Toolbar = () => (
    <div className="card-header border-b-0 px-5 flex-wrap">
      <h3 className="card-title">Twillio Account Details</h3>
      <button className="btn btn-primary" onClick={() => setIsDrawer(true)}>
        <KeenIcon icon="plus" /> Add Twillio User
      </button>
    </div>
  );

  return (
    <div>
      <RightDrawer userId={userId} companyId={companyId} selectedItem={selectedItem} isDrawerOpen={isDrawer} onClose={() => { setIsDrawer(false); setSelectedItem(null); }} fetchTableData={fetchTableData} />
      <DataGrid columns={columns} data={tableData} rowSelection pagination={{ size: 10 }} isLoading={loading} toolbar={<Toolbar />} />
    </div>
  );
};

export { NewTwilioUserTabel };
