import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { SidePopover } from '../../../components/SidePopover/sidepopover';
import CustomFormManager from '../CustomFileds/AddObject';
import AddObjectType from './AddobjectType';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const DefaultObjectTable = () => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedObject, setSelectedObject] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [tabsData, setTabsData] = useState([]);
  const [showAddFields, setShowAddFields] = useState(false);
  const [showObjectType, setShowObjectType] = useState(false);

  // Track expanded rows by objectId
  const [expandedRows, setExpandedRows] = useState([]);

  const navigate = useNavigate();
  const { companyId } = useSelector((state) => state.AuthReducerKey);
  const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

  // Helper function to format date in "Mar 12, 2025" format (time is removed)
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return format(date, 'MMM d, yyyy');
  };

  // Helper function to render status icon
  const renderStatusIcon = (status) => {
    if (status === 1 || status === "1") {
      return '✔️';
    } else if (status === 0 || status === "0") {
      return '❌';
    } else {
      return status || 'N/A';
    }
  };

  // Fetch main table data (using dummy data if API fails)
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/CustomObject/GetObjectDetails?objectId=0`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setTableData(res.data);
        } else {
          setTableData([]);
        }
      })
      .catch((err) => {
        console.error(err);
        // Dummy data for testing
        setTableData([
          {
            objectId: 1,
            objectName: 'Test Object 1',
            objectType: 'Type A',
            modifiedDate: '2025-03-06',
            status: 1,
            types: JSON.stringify([
              {
                ObjectID: 1,
                ObjectTypeID: 101,
                ObjectTypeName: 'Subtype A1',
                Status: 1,
                ModifiedDate: '2025-03-07',
              },
              {
                ObjectID: 1,
                ObjectTypeID: 102,
                ObjectTypeName: 'Subtype A2',
                Status: 0,
                ModifiedDate: '2025-03-08',
              },
            ]),
          },
          {
            objectId: 2,
            objectName: 'Test Object 2',
            objectType: 'Type B',
            modifiedDate: '2025-04-01',
            status: 0,
            types: JSON.stringify([
              {
                ObjectID: 2,
                ObjectTypeID: 201,
                ObjectTypeName: 'Subtype B1',
                Status: 1,
                ModifiedDate: '2025-04-02',
              },
            ]),
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, [API_URL, showAddFields, showObjectType]);

  // Filter table data based on search query
  const filteredData = useMemo(() => {
    return tableData.filter((item) => {
      return item.objectName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
    });
  }, [tableData, searchQuery]);

  const handleToggleRow = (objectId) => {
    setExpandedRows((prev) =>
      prev.includes(objectId)
        ? prev.filter((id) => id !== objectId)
        : [...prev, objectId]
    );
  };

  // Total number of columns in the main table
  const columnCount = 5;

  return (
    <div>
       {/* Main Table */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Object Name</th>
              <th className="border px-4 py-2">Object Type</th>
              <th className="border px-4 py-2">Modified Date</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columnCount} className="text-center py-4">
                  No records found.
                </td>
              </tr>
            ) : (
              filteredData.map((item) => {
                // Parse the nested types JSON
                let parsedTypes = [];
                try {
                  if (item.types) {
                    parsedTypes = JSON.parse(item.types);
                  }
                } catch (err) {
                  console.error('Failed to parse types for item', item.objectId, err);
                }
                const isExpanded = expandedRows.includes(item.objectId);
                return (
                  <React.Fragment key={item.objectId}>
                    {/* Main Row */}
                    <tr>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleToggleRow(item.objectId)}
                          style={{
                            color: 'blue',
                            cursor: 'pointer',
                            marginRight: '8px',
                          }}
                        >
                          {isExpanded ? '⮟' : '⮞'}
                        </button>
                        <a
                          onClick={() =>
                            navigate(`/company/defaultform/${item.objectId}`)
                          }
                          style={{ cursor: 'pointer' }}
                        >
                          {item.objectName}
                        </a>
                      </td>
                      <td className="border px-4 py-2">
                        {parsedTypes.length > 0 &&
                          parsedTypes.map((type, idx) => (
                            <span
                              key={idx}
                              onClick={() =>
                              {  
                                navigate(
                                  `/company/objectDefaultTypeform/${type.ObjectTypeName}/${type.ObjectID}/${type.ObjectTypeID}`
                                )}
                              }
                              className="btn btn-sm btn-light mr-1 cursor-pointer"
                            >
                              {type.ObjectTypeName}
                            </span>
                          ))}
                      </td>
                      <td className="border px-4 py-2">
                        {formatDate(item.modifiedDate)}
                      </td>
                      <td className="border px-4 py-2">
                        {renderStatusIcon(item.status)}
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => {
                            setShowObjectType(true);
                            setSelectedObject(item);
                          }}
                          className="btn btn-sm btn-light"
                        >
                          Add object type
                        </button>
                      </td>
                    </tr>

                    {/* Nested Row with additional columns including Shared To */}
                    {isExpanded && parsedTypes.length > 0 && (
                      <tr>
                        <td colSpan={columnCount} className="border px-4 py-2">
                          <div className="border p-2 bg-white">
                            <table className="min-w-full border-collapse">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="border px-2 py-1">Object Type Name</th>
                                  <th className="border px-2 py-1">Status</th>
                                  <th className="border px-2 py-1">Modified Date</th>
                                  <th className="border px-2 py-1">Shared To</th>
                                </tr>
                              </thead>
                              <tbody>
                                {parsedTypes.map((type, idx) => (
                                  <tr key={idx}>
                                    <td className="border px-2 py-1">{type.ObjectTypeName}</td>
                                    <td className="border px-2 py-1">{renderStatusIcon(type.Status)}</td>
                                    <td className="border px-2 py-1">{formatDate(type.ModifiedDate)}</td>
                                    <td className="border px-2 py-1">All Companies</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      )}

      {/* Side Popovers */}
      <SidePopover
        isDrawerOpen={showAddFields}
        title="Add Fields"
        onClose={() => setShowAddFields(false)}
      >
        <CustomFormManager />
      </SidePopover>

      <SidePopover
        isDrawerOpen={showObjectType}
        title="Activity"
        onClose={() => setShowObjectType(false)}
      >
        <AddObjectType title="Add object Type" SelectedObject={selectedObject} />
      </SidePopover>
    </div>
  );
};

export default DefaultObjectTable;
