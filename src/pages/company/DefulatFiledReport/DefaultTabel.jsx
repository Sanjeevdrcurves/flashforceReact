/* eslint-disable prettier/prettier */
import { useEffect, useMemo, useState } from 'react';
import {
  DataGrid,
  DataGridColumnHeader,
  useDataGrid,
} from '@/components';
import { Badge, Tabs, Tab, InputBase } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const DefaultTable = () => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [tabsData, setTabsData] = useState([]);

  const { companyId } = useSelector((state) => state.AuthReducerKey);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

  // --------------------------------------
  // 1) Fetch the TABS data
  // --------------------------------------
  useEffect(() => {
    const fetchTabsData = async () => {
      try {
        const response = await axios.get(`${API_URL}/CustomObject/GetObjects/0`);
        setTabsData(response.data || []);
      } catch (error) {
        console.error('Error fetching tabs data:', error);
      }
    };
    fetchTabsData();
  }, [API_URL]);

  // --------------------------------------
  // 2) Flatten the new "pagesToSave" format
  // --------------------------------------
  /**
   * The new otherJSON looks like:
   * {
   *   "pagesToSave":[
   *     {
   *       "id": 1740904006971,
   *       "name": "Section 1",
   *       "color": "border-red-500",
   *       "fields": [
   *         { "id":"name", "label":"Name", "type":"text", "required":true, ... },
   *         { "id":"email", "label":"Email", "type":"email", "required":true, ... }
   *       ]
   *     }
   *   ]
   * }
   *
   * This function flattens each "page" (Section) and its .fields.
   * Now it also adds an "extraType" property for the new column.
   */
  const flattenPagesToSave = (pagesArray, formName, flattenedRows) => {
    pagesArray.forEach((page) => {
      const sectionPath = page.name || ''; // or any other logic if needed

      if (Array.isArray(page.fields)) {
        page.fields.forEach((field) => {
          flattenedRows.push({
            formName,
            label: field.label,
            type: field.type,
            source:field.source,
            required: field.required,
            sectionPath,


            // New property for the extra Type column
            extraType: field.type,
          });
        });
      }
    });
  };

  // --------------------------------------
  // 3) Fetch the custom fields data
  // --------------------------------------
  useEffect(() => {
    const getFieldsData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/CustomObject/GetObjects/0`
        );
        // Example of new data:
        // [
        //   {
        //     "fieldFormId": 11,
        //     "companyID": 46,
        //     "formName": "Lead",
        //     "otherJSON": "{\"pagesToSave\":[{\"id\":1740904006971,\"name\":\"Section 1\",\"color\":\"border-red-500\",\"fields\":[...]}]}"
        //   },
        //   ...
        // ]

        const flattenedRows = [];

        response.data.forEach((item) => {
          const { objectName, objectFields } = item;
          if (!objectFields) return; // safeguard

          // Parse the new JSON structure
          let parsed;
          try {
            parsed = JSON.parse(objectFields);
          } catch (e) {
            console.error('Error parsing otherJSON:', e);
            return;
          }
          // "pagesToSave" is the array of "pages" (sections)
          const pagesToSave = parsed?.fields || [];

          // Flatten the pages and their fields
          flattenPagesToSave(pagesToSave, objectName, flattenedRows);
        });

        setTableData(flattenedRows);
      } catch (err) {
        console.error('Error fetching fields data:', err);
      } finally {
        setLoading(false);
      }
    };

    getFieldsData();
  }, [API_URL, companyId]);

  // --------------------------------------
  // 4) Handle tab change
  // --------------------------------------
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    debugger
  };

  // --------------------------------------
  // 5) Filter data by tab & search
  // --------------------------------------
  const filteredData = useMemo(() => {
    if (!tableData.length) return [];
    return tableData.filter((item) => {
      // match against search
      const matchSearch =
        item?.formName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.sectionPath?.toLowerCase().includes(searchQuery.toLowerCase());

      // tab filtering example:
      if (activeTab === 'All') {
        return matchSearch;
      }
      return matchSearch && item.formName === activeTab.formName;
    });
  }, [tableData, searchQuery, activeTab]);

  // --------------------------------------
  // 6) Define columns for the DataGrid
  // --------------------------------------
  const columns = useMemo(
    () => [
      {
        accessorKey: 'formName',
        header: ({ column }) => (
          <DataGridColumnHeader title="Object Name" column={column} />
        ),
        cell: ({ row }) => row.original.formName,
        meta: {
          headerClassName: 'min-w-[130px]',
          cellClassName: 'text-black text-sm font-medium',
        },
      },
      {
        accessorKey: 'sectionPath',
        header: ({ column }) => (
          <DataGridColumnHeader title="Folder / Group Name" column={column} />
        ),
        cell: ({ row }) => row.original.sectionPath || '',
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'text-black text-sm font-medium',
        },
      },
      {
        accessorKey: 'label',
        header: ({ column }) => (
          <DataGridColumnHeader title="Field Name" column={column} />
        ),
        cell: ({ row }) => row.original.label,
        meta: {
          headerClassName: 'min-w-[150px]',
          cellClassName: 'text-black text-sm font-medium',
        },
      },
      {
        accessorKey: 'type',
        header: ({ column }) => (
          <DataGridColumnHeader title="Field Type" column={column} />
        ),
        cell: ({ row }) => row.original.source,
        meta: {
          headerClassName: 'min-w-[130px]',
          cellClassName: 'text-black text-sm font-medium',
        },
      },
      {
        accessorKey: 'required',
        header: ({ column }) => (
          <DataGridColumnHeader title="Required?" column={column} />
        ),
        cell: ({ row }) => {
          const required = row.original.required;
          return (
            <Badge
              badgeContent={required ? 'Yes' : 'No'}
              color={required ? 'success' : 'warning'}
              className="px-2 py-1 rounded-full text-sm font-medium"
            />
          );
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-black text-sm font-medium',
        },
      },
      // New Column: Type
      {
        accessorKey: 'extraType',
        header: ({ column }) => (
          <DataGridColumnHeader title="Type" column={column} />
        ),
        cell: ({ row }) => row.original.extraType,
        meta: {
          headerClassName: 'min-w-[130px]',
          cellClassName: 'text-black text-sm font-medium',
        },
      },
    ],
    []
  );

  // --------------------------------------
  // 7) Custom toolbar with dynamic tabs
  // --------------------------------------
  const Toolbar = () => {
    const { table } = useDataGrid();
    return (
      <>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          className="mb-2"
        >
          <Tab key="All" label="All" value="All" />
          {tabsData && tabsData.length > 0 &&
            tabsData.map((tab) => (
              <Tab
                key={tab.objectID}
                label={tab.objectName}
                value={tab}
              />
            ))
          }
        </Tabs>

        {activeTab !== 'All' && typeof activeTab === 'object' && (
          <div>
            <button
              onClick={() => {
                navigate(`/company/defaultform/${activeTab.objectID}`);
              }}
              className="btn btn-sm btn-light float-right"
            >
              {filteredData.length ? 'Edit or Add Fields' : 'Add Fields'}
            </button>
          </div>
        )}
      </>
    );
  };

  // --------------------------------------
  // Final Render
  // --------------------------------------
  return (
    <div>
      {/* Search input */}
      <div className="mb-4">
        <InputBase
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ border: '1px solid #ccc', padding: '4px 8px' }}
        />
      </div>

      <DataGrid
        columns={columns}
        data={filteredData}
        toolbar={<Toolbar />}
        rowSelection={false}
        pagination={{ size: 10 }}
        sorting={[{ id: 'formName', desc: false }]}
        layout={{ card: false }}
        isLoading={loading}
      />
    </div>
  );
};

export { DefaultTable };
