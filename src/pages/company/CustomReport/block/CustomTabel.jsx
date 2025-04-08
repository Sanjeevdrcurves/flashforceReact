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

const CustomTabel = () => {
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
        const response = await axios.get(`${API_URL}/CustomForm/GetMasterCustomFormField`);
        setTabsData(response.data);
      } catch (error) {
        console.error('Error fetching tabs data:', error);
      }
    };
    fetchTabsData();
  }, [API_URL]);

  // --------------------------------------
  // 2) Utility to Flatten All Fields (SKIP section rows)
  // --------------------------------------
  /**
   * @param {Array} fields - array of field objects (could be top-level or section subfields)
   * @param {string} formName - the name of the parent form
   * @param {Array} flattenedRows - accumulative result
   * @param {Array<string>} ancestorSections - an array of section labels from the parent chain
   */
  const flattenFields = (fields, formName, flattenedRows, ancestorSections = []) => {
    fields.forEach((field) => {
      // If this field is a section, do NOT push a row for it. Instead, recurse into subfields.
      if (field.type === 'section') {
        // Create a new array of section labels, appending this section's label (if any)
        const newSectionPath = [...ancestorSections];
        if (field.label) {
          newSectionPath.push(field.label);
        }

        // Recurse into subfields, skipping the actual 'section' field itself
        if (Array.isArray(field.fields)) {
          flattenFields(field.fields, formName, flattenedRows, newSectionPath);
        }
      } else {
        // Normal field => push a row
        const sectionPath = ancestorSections.join(' > ');
        flattenedRows.push({
          formName,
          label: field.label,
          type: field.type,
          required: field.required,
          sectionPath,
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
          `${API_URL}/CustomForm/GetCustomFormFieldById/0/${companyId}`
        );
        // example data format:
        // [
        //   {
        //     "fieldFormId": 11,
        //     "companyID": 46,
        //     "formName": "Lead",
        //     "otherJSON": "{\"fields\":[...]}",
        //   },
        //   ...
        // ]

        const flattenedRows = [];
        response.data.forEach((item) => {
          const { formName, otherJSON } = item;
          if (!otherJSON) return; // safeguard

          // Parse the otherJSON
          const parsedJSON = JSON.parse(otherJSON);
          const fieldsArray = parsedJSON?.fields || [];

          // Flatten fields (recursively), skipping sections themselves
          flattenFields(fieldsArray, formName, flattenedRows, []);
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
        cell: ({ row }) => row.original.type,
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
      // NEW: Section Path column (if there's nesting)
     
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
                key={tab.masterCustomFormFieldId}
                label={tab.formName}
                value={tab}
              />
            ))
          }
        </Tabs>

        {activeTab !== 'All' && (
          <div>
            <button
              onClick={() => {
                navigate(`/customField/${activeTab.masterCustomFormFieldId}`);
              }}
              className="btn btn-sm btn-light float-right"
            >
              {filteredData.length?'Edit or Add Fields':"Add Fields"}
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

export { CustomTabel };
