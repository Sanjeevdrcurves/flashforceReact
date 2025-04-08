/* eslint-disable prettier/prettier */
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { DataGrid, DataGridColumnHeader, DataGridRowSelect, useDataGrid, DataGridRowSelectAll, KeenIcon, DataGridColumnVisibility } from '@/components';
import { Popover } from '@mui/material';
import { RightDrawer } from './RightDrawer';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useLocation } from 'react-router';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
// Replace with dynamic user identification if needed
const NewFeatureTabel = () => {
  const [loading, setLoading] = useState(false);
  const {companyId,userId}  = useSelector(state => state.AuthReducerKey);
  console.log(userId,'userid');
  const location = useLocation();
    const passedData = location;
    console.log(passedData,"passed Data");
  
  const modifiedBy = (userId); 
  
  const [tableData, setTableData] = useState([]);
  const [isDrawer, setisDrawer] = useState(false);
  const[selectedItem,setSelectedItem]=useState(null)
  
  // Fetch data from API using Axios
  const fetchTableData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/Feature/GetAllFeaturesByCompany/${companyId}`);

      // Format the API response to match tableData structure
      const formattedData = response?.data?.map((item) => ({
        id: item.id,
        featureName: item.name,
        description: item.description,
        status: item.isDeleted ? 'Inactive' : 'Active',
        // users: item.numberOfUsers,
        plans: item?.planNames?.split(',').map((plan) => plan.trim()), // Split and trim plan names
        planId:item?.planId?.split(','),
        featureCategoryName: item.featureCategoryName || 'Uncategorized',
        featureCategoryId:item.featureCategoryId,
        // featureCategoryId: 0,
        // isToggle: item.isToggle ? 'Yes' : 'No',
        isMenuShow: item.isMenuShow ? 'Yes' : 'No',
        path:item.path,
        icon:item.icon,
        featureType:item.featureType,
        isTooltip: item.isTooltip ? 'Yes' : 'No',
        tooltip: item.tooltip || 'N/A',
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
      await axios.delete(`${API_URL}/Feature/DeleteFeature/${id}?modifiedBy=${modifiedBy}`);
      alert('Feature deleted successfully.');
      // Re-fetch data from the server after deletion
      await fetchTableData();
    } catch (error) {
      console.error('Error deleting feature:', error);
      alert('Failed to delete the feature.');
    } finally {
      setLoading(false);
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
      accessorKey: 'featureType',
      header: ({ column }) => <DataGridColumnHeader title="Feature Type" column={column} />,
      cell: ({ row }) => <span className="text-sm">{row.original.featureType}</span>,
      meta: { headerClassName: 'min-w-[150px]', cellClassName: 'text-sm' },
    },{
      accessorKey: 'featureCategoryName',
      header: ({ column }) => <DataGridColumnHeader title="Feature Category" column={column} />,
      cell: ({ row }) => <span className="text-sm">{row.original.featureCategoryName}</span>,
      meta: { headerClassName: 'min-w-[150px]', cellClassName: 'text-sm' },
    },
    {
      accessorKey: 'featureName',
      header: ({ column }) => <DataGridColumnHeader title="Features Name" column={column} />,
      cell: ({ row }) => <span className="text-sm font-medium">{row.original.featureName}</span>,
      meta: { headerClassName: 'min-w-[150px]', cellClassName: 'text-black text-sm font-medium' },
    },
    {
      accessorKey: 'description',
      header: ({ column }) => <DataGridColumnHeader title="Description" column={column} />,
      cell: ({ row }) => <span className="text-sm">{row.original.description}</span>,
      meta: { headerClassName: 'min-w-[300px]', cellClassName: 'text-gray-600 text-sm' },
    }
    , 
    // {
    //   accessorKey: 'isMenuShow',
    //   header: ({ column }) => <DataGridColumnHeader title="Is Menu Show" column={column} />,
    //   cell: ({ row }) => <span className="text-sm">{row.original.isMenuShow}</span>,
    //   meta: { headerClassName: 'min-w-[100px]', cellClassName: 'text-center' },
    // },
    {
      accessorKey: 'path',
      header: ({ column }) => <DataGridColumnHeader title="Path" column={column} />,
      cell: ({ row }) => <span className="text-sm">{row.original.path}</span>,
      meta: { headerClassName: 'min-w-[300px]', cellClassName: 'text-gray-600 text-sm' },
    },
    {
      accessorKey: 'icon',
      header: ({ column }) => <DataGridColumnHeader title="Icon" column={column} />,
      cell: ({ row }) => <span className="text-sm">{row.original.icon}</span>,
      meta: { headerClassName: 'min-w-[300px]', cellClassName: 'text-gray-600 text-sm' },
    },
    // {
    //   accessorKey: 'isTooltip',
    //   header: ({ column }) => <DataGridColumnHeader title="Has Tooltip" column={column} />,
    //   cell: ({ row }) => <span className="text-sm">{row.original.isTooltip}</span>,
    //   meta: { headerClassName: 'min-w-[100px]', cellClassName: 'text-center' },
    // },
    // {
    //   accessorKey: 'tooltip',
    //   header: ({ column }) => <DataGridColumnHeader title="Tooltip" column={column} />,
    //   cell: ({ row }) => <span className="text-sm">{row.original.tooltip}</span>,
    //   meta: { headerClassName: 'min-w-[200px]', cellClassName: 'text-sm' },
    // },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded ${
            row.original.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {row.original.status}
        </span>
      ),
      meta: { headerClassName: 'min-w-[100px]', cellClassName: 'text-center' },
    },
    // {
    //   accessorKey: 'users',
    //   header: ({ column }) => <DataGridColumnHeader title="Number of Users" column={column} />,
    //   cell: ({ row }) => <span className="text-sm">{row.original.users}</span>,
    //   meta: { headerClassName: 'min-w-[100px]', cellClassName: 'text-center' },
    // },
    {
      accessorKey: 'plans',
      header: ({ column }) => <DataGridColumnHeader title="Plans" column={column} />,
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
            {row?.original?.plans?.map((plan, index) => (
              <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded">
              {plan}
            </span>
          ))}
        </div>
      ),
      meta: { headerClassName: 'min-w-[200px]', cellClassName: 'flex items-center' },
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
        <h3 className="card-title">Feature Details</h3>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            className="btn btn-primary flex justify-center text-xs"
            onClick={() => {
              setisDrawer(true);
            }}
          >
          <KeenIcon icon="trash" />
            <span className="ml-2 text-xs">Add New Feature</span>
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
        sorting={[{ id: 'id', desc: false }]}
        layout={{ card: true }}
        isLoading={loading}
        toolbar={<Toolbar />}
      />
    </div>
  );
};

export { NewFeatureTabel };
