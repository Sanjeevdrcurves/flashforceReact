import { useEffect, useMemo, useState } from 'react';
import { DataGrid, DataGridColumnHeader } from '@/components';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { SidePopover } from '../../../components/SidePopover/sidepopover';
import CustomFormManager from '../CustomFileds/AddObject';
import AddObjectType from './AddobjectType';
import { useNavigate } from 'react-router-dom';

const CustomReportTable = () => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [SelectedObject, setSelectedObject] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [tabsData, setTabsData] = useState([]);
  const [showAddfileds, setshowAddfileds] = useState(false);
  const [showobjectType, setshowobjectType] = useState(false);
  const navigate = useNavigate();

  const { companyId } = useSelector((state) => state.AuthReducerKey);
  const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

  useEffect(() => {
    axios.get(`${API_URL}/CustomObject/GetObjectDetails?objectId=0`)
      .then((res) => setTabsData(res.data || []))
      .catch((err) => console.error(err));
  }, [API_URL, showAddfileds, showobjectType]);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/CustomObject/GetObjectDetails?objectId=0`)
      .then((res) => setTableData(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [API_URL, showAddfileds, showobjectType]);

  const filteredData = useMemo(() => {
    return tableData.filter((item) => {
      const matchesSearch = item.objectName.toLowerCase().includes(searchQuery.toLowerCase());
      if (activeTab === 'All') return matchesSearch;
      return matchesSearch && item.objectType === activeTab.objectType;
    });
  }, [tableData, searchQuery, activeTab]);

  const columns = useMemo(() => [
    {
      accessorKey: 'objectName',
      header: ({ column }) => <DataGridColumnHeader title="Object Name" column={column} />,
      cell: ({ row }) => (
        <a>
          {row.original.objectName}
        </a>
      ),
    },
    {
      accessorKey: 'objectType',
      header: ({ column }) => <DataGridColumnHeader title="Object Type" column={column} />,
      cell: ({ row }) => {
        let parsedTypes = [];
        try {
          parsedTypes = JSON.parse(row.original.types);
        } catch (err) {
          console.error("Failed to parse types:", err);
        }

        return (
          <div className="flex flex-wrap gap-1">
            {parsedTypes.map((res, index) => (
              <a
                key={res.ObjectTypeID || index}
                onClick={() => {
                  debugger
                  // setshowobjectType(true);
                  // setSelectedObject(row.original);
                  navigate(`/company/customDefaultform/${res.ObjectTypeName}/${res.ObjectID}/${res.ObjectTypeID}`)
                }}
                className="btn btn-sm btn-light"
              >
                {res.ObjectTypeName}
              </a>
            ))}
          </div>
        );
      },
    },
    // {
    //   id: 'actions',
    //   header: 'Actions',
    //   cell: ({ row }) => (
    //     <a
    //       onClick={() => {
    //         setshowobjectType(true);
    //         setSelectedObject(row.original);
    //       }}
    //       className="btn btn-sm btn-light"
    //     >
    //       Add object type
    //     </a>
    //   ),
    // },
  ], [navigate]);

  return (
    <div>
      <DataGrid
        columns={columns}
        data={filteredData}
        rowSelection={false}
        pagination={{ size: 10 }}
        sorting={[{ id: 'objectName', desc: false }]}
        layout={{ card: false }}
        isLoading={loading}
      />
      <SidePopover isDrawerOpen={showAddfileds} title={'Add Fields'} onClose={() => setshowAddfileds(false)}>
        <CustomFormManager />
      </SidePopover>

      <SidePopover isDrawerOpen={showobjectType} title={'Activity'} onClose={() => setshowobjectType(false)}>
        <AddObjectType title='Add object Type' SelectedObject={SelectedObject} />
      </SidePopover>
    </div>
  );
};

export default CustomReportTable;
