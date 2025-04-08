import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { DataGrid, DataGridColumnHeader,  useDataGrid,  KeenIcon} from '@/components';
import { TabCategoryRightDrawer } from './TabCategoryRightDrawer';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { sendNotification } from '@/utils/notificationapi';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
const NewTabCategoryTabel = () => {
    const [loading, setLoading] = useState(false);
    const { companyId, userId } = useSelector(state => state.AuthReducerKey);
    console.log(userId, 'userid');
   // const modifiedBy = String(userId);
    const [tableData, setTableData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [isDrawer, setisDrawer] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);

    const fetchTableData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/TagCategory/GetTagCategoryByCompanyId/${companyId}`);
            const formattedData = response?.data?.map((item) => ({
                id: item.id,
                tagCategoryName: item.tagCategoryName,
                isActive: item.isActive ? 'Yes' : 'No'
            }));
            console.log(JSON.stringify(response.data));
            setTableData(formattedData);

            setFilteredData(formattedData);
        } catch (error) {
            console.error('Error fetching table data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTableData();
    }, []);

    useEffect(() => {
        // setFilteredData(
        //     tableData.filter(item =>
        //         (item.parentMenuName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        //         (item.menuName?.toLowerCase() || '').includes(searchQuery.toLowerCase())
        //     )
        // );


        setFilteredData(
            tableData.filter(item => {
                const parentMenu = item.parentMenuName ? item.parentMenuName.toLowerCase() : "";
                const menu = item.menuName ? item.menuName.toLowerCase() : "";
                const query = searchQuery.toLowerCase();
        
                return parentMenu.includes(query) || menu.includes(query);
            })
        );

        
    }, [searchQuery, tableData]);

    const handleDelete = async (id, tagCategoryName) => {
        if (!window.confirm('Are you sure you want to delete this Tag Category?')) return;
        try {
            setLoading(true);
            await axios.delete(`${API_URL}/TagCategory/DeleteTagCategory?id=${id}&modifiedBy=${userId}`);
            toast.success('Tag Category deleted successfully.');
           // await sendNotification(userId, 43, 'Menu deletion notification', 'Menu deletion Successful', '31', menuName);
            await fetchTableData();
        } catch (error) {
            console.error('Error deleting Tag Category:', error);
            toast.success('Failed to delete the Tag Category.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAll = async () => {
        console.log("Selected rows before deletion:", selectedRows);
   
        if (!window.confirm('Are you sure you want to delete selected Tag Categories?')) return;
        try {
            setLoading(true);
            await Promise.all(selectedRows.map(id => axios.delete(`${API_URL}/TagCategory/DeleteTagCategor?id=${id}&modifiedBy=${userId}`)));
            toast.success('Selected Tag Categories deleted successfully.');
            setSelectedRows([]);
            await fetchTableData();
        } catch (error) {
            console.error('Error deleting Tag Categories:', error);
            toast.success('Failed to delete selected Tag Categories.');
        } finally {
            setLoading(false);
        }
    };

    const columns = useMemo(
        () => [
           // {
              //  accessorKey: 'menuId',
                //header: () => (
                    // <DataGridRowSelectAll 
                    //     onSelect={(allSelectedRows) => setSelectedRows(allSelectedRows.map(row => row.original.menuId))} 
                    // />
              //  ),
               // cell: ({ row }) => (
                    // <DataGridRowSelect 
                    //     row={row} 
                    //     onSelect={(selectedRow) => {
                    //         setSelectedRows(prev =>
                    //             prev.includes(selectedRow.original.menuId)
                    //                 ? prev.filter(id => id !== selectedRow.original.menuId)
                    //                 : [...prev, selectedRow.original.menuId]
                    //         );
                    //     }} 
                    // />
              //  ),
            //    enableSorting: false,
             //   enableHiding: false,
             //   meta: { headerClassName: 'w-0' },
           // }
          //  , 
            // {
            //     accessorKey: 'featureName',
            //     header: ({ column }) => <DataGridColumnHeader title="Feature Name" column={column} />,
            //     cell: ({ row }) => <span className="text-sm">{row.original.featureName}</span>,
            //     meta: { headerClassName: 'min-w-[300px]', cellClassName: 'text-gray-600 text-sm' },
            // },
            {
                accessorKey: 'tagCategoryName',
                header: ({ column }) => <DataGridColumnHeader title="Tag Category Name" column={column} />,
                cell: ({ row }) => <span className="text-sm">{row.original.tagCategoryName}</span>,
                meta: { headerClassName: 'min-w-[150px]', cellClassName: 'text-sm' },
            },
            {
                accessorKey: 'isActive',
                header: ({ column }) => <DataGridColumnHeader title="Is Active?" column={column} />,
                cell: ({ row }) => <span className="text-sm font-medium">{row.original.isActive}</span>,
                meta: { headerClassName: 'min-w-[150px]', cellClassName: 'text-black text-sm font-medium' },
            },
           
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button className="btn btn-icon btn-sm" title="Edit" onClick={() => { setSelectedItem(row.original); setisDrawer(true) }}>
                            <KeenIcon icon="notepad-edit" />
                        </button>
                        <button className="btn btn-icon btn-sm text-danger" title="Delete" onClick={() => handleDelete(row.original.id, row.original.tagCategoryName)}>
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
        console.log("Selected Rows:", selectedRows);  // Debugging
        return (
            <div className="card-header border-b-0 px-5 flex-wrap">
                <h3 className="card-title">Tag Category Details</h3>
                {/* <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border rounded px-2 py-1"
                /> */}
                   <div className="flex flex-wrap items-center gap-2.5">
                          <div className="flex gap-6">
                            <div className="relative">
                              <KeenIcon
                                icon="magnifier"
                                className="leading-none text-md text-gray-500 absolute top-1/2 start-0 -translate-y-1/2 ms-3"
                              />
                              <input
                                type="text"
                                placeholder="Search Tag Categories"
                                className="input input-sm ps-8"
                                value={table.getColumn('tagCategoryName')?.getFilterValue() ?? ''}
                                onChange={(event) =>
                                  table.getColumn('tagCategoryName')?.setFilterValue(event.target.value)
                                }
                              />
                            </div>
                            <button className="btn btn-primary" onClick={() => setisDrawer(true)}>
                        <KeenIcon icon="plus" />
                        <span className="ml-2 text-xs">Add New Tag Category</span>
                    </button>
                    {selectedRows.length > 0 && (
                        <button className="btn btn-danger" onClick={handleDeleteAll}>
                            <KeenIcon icon="trash" /> Delete Selected
                        </button>
                    )}
                          </div>
                        </div>
                {/* <div className="flex flex-wrap items-center gap-2.5">
                    
                </div> */}
            </div>
        );
    };
    
    
    return (
        <div>
            <TabCategoryRightDrawer userId={userId} companyId={companyId} selectedItem={selectedItem} isDrawerOpen={isDrawer} onClose={() => { setisDrawer(false); setSelectedItem(null); }} fetchTableData={fetchTableData} />
            {/* <DataGrid columns={columns} data={tableData} rowSelection={true} pagination={{ size: 10 }} sorting={[{ id: 'id', desc: false }]} layout={{ card: true }} isLoading={loading} toolbar={<Toolbar />} /> */}
            <DataGrid
    columns={columns}
    data={filteredData}
    rowSelection={selectedRows}
    pagination={{ size: 10 }}
    sorting={[{ id: 'id', desc: false }]}
    layout={{ card: true }}
    isLoading={loading}
    toolbar={<Toolbar selectedRows={selectedRows} />}
/>

        </div>
    );
};

export { NewTabCategoryTabel };
