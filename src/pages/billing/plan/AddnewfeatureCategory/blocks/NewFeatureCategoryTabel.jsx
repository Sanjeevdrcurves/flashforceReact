/* eslint-disable prettier/prettier */
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { DataGrid, DataGridColumnHeader, DataGridRowSelect, useDataGrid, DataGridRowSelectAll, KeenIcon, DataGridColumnVisibility } from '@/components';
import { Popover } from '@mui/material';
import { RightDrawer } from './RightDrawer';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
// Replace with dynamic user identification if needed
const NewFeatureCategoryTabel = () => {
  const [loading, setLoading] = useState(false);
  const {companyId,userId}  = useSelector(state => state.AuthReducerKey);
  console.log(userId,'userid');
  
  const modifiedBy = String(userId); 
  
  const [tableData, setTableData] = useState([]);
  const [isDrawer, setisDrawer] = useState(false);
  const[selectedItem,setSelectedItem]=useState(null)
  
  // Fetch data from API using Axios
  const fetchTableData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/Feature/GetFeatureCategories`);

      // Format the API response to match tableData structure
      const formattedData = response?.data?.map((item) => ({
        id: item.id,
        featureCategory: item.featureCategory
      }));
console.log(JSON.stringify(response.data));
      setTableData(formattedData);
    } catch (error) {
      console.error('Error fetching table data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  // Handle delete feature
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feature?')) return;

    try {
    setLoading(true);
      await axios.delete(`${API_URL}/Feature/DeleteFeatureCategory/${id}?modifiedBy=${modifiedBy}`);
      toast('Feature  Catgory deleted successfully.');
      // Re-fetch data from the server after deletion
      await fetchTableData();
    } catch (error) {
      console.error('Error deleting feature:', error);
      toast('Failed to delete the feature.');
    } finally {
      setLoading(false);s
    }
  };

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
    }, {
      accessorKey: 'featureCategoryName',
      header: ({ column }) => <DataGridColumnHeader title="Feature Category" column={column} />,
      cell: ({ row }) => <span className="text-sm">{row.original.featureCategory}</span>,
      meta: { headerClassName: 'min-w-[150px]', cellClassName: 'text-sm' },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
            <button className="btn btn-icon btn-sm" title="Edit" onClick={()=>{setSelectedItem(row.original);setisDrawer(true)}}>
            <KeenIcon icon="notepad-edit" />
          </button>
            <button
              className="btn btn-icon btn-sm text-danger"
              title="Delete"
              onClick={() => handleDelete(row.original.id)}
            >
            <KeenIcon icon="trash" />
          </button>
        </div>
      ),
      meta: { headerClassName: 'w-[100px]', cellClassName: 'text-center' },
    },
    ],
    []
  );

  const Toolbar = () => {
    const { table } = useDataGrid();
    return (
      <div className="card-header border-b-0 px-5 flex-wrap">
        <h3 className="card-title">Feature Category Master</h3>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            className="btn btn-primary flex justify-center text-xs"
            onClick={() => {
              setisDrawer(true);
            }}
          >
          <KeenIcon icon="trash" />
            <span className="ml-2 text-xs">Add New Feature Category</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
  <RightDrawer userId={userId} companyId={companyId} selectedItem={selectedItem} isDrawerOpen={isDrawer} onClose={() => {setisDrawer(false);setSelectedItem(null)}} 
      fetchTableData={fetchTableData} // Pass the fetchTableData method
      />
      <DataGrid
        columns={columns}
        data={tableData}
        rowSelection={true}
        pagination={{ size: 10 }}
        sorting={[{ id: 'featureName', desc: false }]}
        layout={{ card: true }}
        isLoading={loading}
        toolbar={<Toolbar />}
      />
    </div>
  );
};

export { NewFeatureCategoryTabel };
