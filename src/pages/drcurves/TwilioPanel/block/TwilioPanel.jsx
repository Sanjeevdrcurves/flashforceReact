/* eslint-disable prettier/prettier */
import React, { useEffect, useMemo, useState } from 'react';
import {
  DataGrid,
  DataGridColumnHeader,
  useDataGrid,KeenIcon
} from '@/components'; 
import { Badge, Tabs, Tab, InputBase, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useLocation } from 'react-router';


const TwilioPanel = () => {
  // ------------------------------------------
  // Global state/hooks
  // ------------------------------------------
  const { companyId } = useSelector((state) => state.AuthReducerKey);
  const navigate = useNavigate();

  // Example base URL or environment variable
  const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

  // Single search input for whichever tab is active
  const [searchQuery, setSearchQuery] = useState('');

  // Tab control
  const [activeTab, setActiveTab] = useState('queues');
  
  // Loading states for each data set
  const [loadingQueues, setLoadingQueues] = useState(false);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(false);
  const [loadingWorkers, setLoadingWorkers] = useState(false);

  // ------------------------------------------
  // Company list
  // ------------------------------------------
  const [companies, setCompanies] = useState([]);

  const getAllCompanies = async () => {
    try {
      const response = await axios.get(`${API_URL}/Company/all`);
      setCompanies(response.data);
    } catch (error) {
      toast.error('Error fetching companies: ' + error.message);
    }
  };

  useEffect(() => {
    getAllCompanies();
  }, [API_URL]);

  // ------------------------------------------
  // Queues
  // ------------------------------------------
  const [queuesData, setQueuesData] = useState([]);
  const [queueName, setQueueName] = useState('');
  const [queueCompanyId, setQueueCompanyId] = useState('0');

 // NEW: State for edit mode (selected queue)
 const [selectedQueue, setSelectedQueue] = useState(null);

  // 1) Fetch all queues
  const fetchQueues = async () => {
    setLoadingQueues(true);
    try {
      const resp = await axios.get(`${API_URL}/twiliophone/GetTwilioQueueByCompanyid/${companyId}`);
      setQueuesData(resp.data || []);
    } catch (error) {
      toast.error('Error fetching queue data: ' + error.message);
    } finally {
      setLoadingQueues(false);
    }
  };

  // 2) Create queue
  const handleQueueSubmit = async () => {
     // Validate required fields
     if (!queueName.trim() || !queueCompanyId.trim()) {
      toast.error("All fields are required for queue creation.");
      return;
    }
    try {
      const payload = {
        friendlyName: queueName,
        companyId: queueCompanyId,
      };
      const response = await axios.post(
        `${API_URL}/TwilioUser/createTwilioQueue`,
        payload
      );
      if (response.data?.queueSid) {
        toast.success('Queue created successfully!');
        setQueueName('');
        setQueueCompanyId('0');
        // Refresh data after creation
        fetchQueues();
      } else {
        toast.error('Queue creation failed. No queueSid returned.');
      }
    } catch (error) {
      toast.error('Error creating queue: ' + error.message);
    }
  };

  // 3) Delete queue
  const handleDeleteQueue = async (queueSid) => {
    if (!queueSid) return;
    try {
      await axios.delete(`${API_URL}/TwilioUser/DeleteTwilioQueue/${companyId}/${queueSid}`);
      toast.success('Queue deleted successfully');
      fetchQueues(); // refresh after deletion
    } catch (error) {
      toast.error('Error deleting queue: ' + error.message);
    }
  };

// 4) Update queue (when in edit mode)
const handleQueueUpdate = async () => {
  if (!queueName.trim() || !queueCompanyId.trim()) {
    toast.error("All fields are required for queue update.");
    return;
  }
  try {
    const payload = {
      friendlyName: queueName,
      companyId: queueCompanyId,
      queueSid: selectedQueue.queueSid,
    };
    const response = await axios.post(`${API_URL}/TwilioUser/UpdateTwilioQueue`, payload);
  
    if (response.data[0]!="-1") {
     
      toast.success('Queue updated successfully!');
      setSelectedQueue(null);
      setQueueName('');
      setQueueCompanyId('0');
      fetchQueues();
    } else {
      toast.error('Queue update failed.');
    }
  } catch (error) {
    toast.error('Error updating queue: ' + error.message);
  }
};

// When user clicks the edit icon, fill form fields and set edit mode.
const handleEditQueue = (queue) => {
  setSelectedQueue(queue);
  setQueueName(queue.friendlyName || '');
  // Assuming the API returns a companyId field; convert to string if necessary.
  setQueueCompanyId(queue.companyId ? queue.companyId.toString() : '0');
};


  // Columns for queue DataGrid
  const queueColumns = useMemo(
    () => [
      {
        accessorKey: 'friendlyName',
        header: ({ column }) => (
          <DataGridColumnHeader title="Queue Name" column={column} />
        ),
        cell: ({ row }) => row.original.friendlyName || '',
        meta: {
          headerClassName: 'min-w-[180px]',
          cellClassName: 'text-black text-sm font-medium',
        },
      },
      {
        accessorKey: 'queueSid',
        header: ({ column }) => (
          <DataGridColumnHeader title="Queue SID" column={column} />
        ),
        cell: ({ row }) => row.original.queueSid || '',
        meta: {
          headerClassName: 'min-w-[180px]',
          cellClassName: 'text-black text-sm font-medium',
        },
      },
      {
        accessorKey: 'active',
        header: ({ column }) => (
          <DataGridColumnHeader title="Active?" column={column} />
        ),
        cell: ({ row }) => {
          const active = row.original.active;
          return (
            <Badge
              badgeContent={active ? 'No' : 'Yes'}
              color={active ? 'warning' : 'success'}
              className="px-2 py-1 rounded-full text-sm font-medium"
            />
          );
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-black text-sm font-medium',
        },
      },
      {
        // NEW: Delete action column
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          // <IconButton
          //   onClick={() => handleDeleteQueue(row.original.queueSid)}
          //   size="small"
          //   title="Delete Queue"
          // >
          //   <DeleteIcon />
          // </IconButton>
          <div className="flex gap-2">
          {/* <button className="btn btn-icon btn-sm" title="Edit" onClick={()=>{setSelectedItem(row.original);setisDrawer(true)}}>
          <KeenIcon icon="notepad-edit" />
          </button> */}
          <button className="btn btn-icon btn-sm" title="Edit"  onClick={() => handleEditQueue(row.original)}  >
          <KeenIcon icon="notepad-edit" />
          </button>
          <button
            className="btn btn-icon btn-sm text-danger"
            title="Delete Queue"
            onClick={() => handleDeleteQueue(row.original.queueSid)}
          >
          <KeenIcon icon="trash" />
          </button>
          </div>



        ),
        meta: {
          headerClassName: 'min-w-[80px]',
          cellClassName: 'text-red text-sm font-medium',
        },
      },
    ],
    []
  );

  // ------------------------------------------
  // Workspaces
  // ------------------------------------------
  const [workspacesData, setWorkspacesData] = useState([]);
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceCompanyId, setWorkspaceCompanyId] = useState('0');


   // State for editing workspace
   const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const fetchWorkspaces = async () => {
    setLoadingWorkspaces(true);
    try {
      const resp = await axios.get(`${API_URL}/twiliophone/GetTwilioWorkspacesByCompanyid/${companyId}`);
      setWorkspacesData(resp.data || []);
    } catch (error) {
      toast.error('Error fetching workspace data: ' + error.message);
    } finally {
      setLoadingWorkspaces(false);
    }
  };

  const handleWorkspaceSubmit = async () => {
    if (!workspaceName.trim() || !workspaceCompanyId.trim()) {
      toast.error("All fields are required for workspace creation.");
      return;
    }
    try {
      const payload = {
        WorkspaceFriendlyName: workspaceName,
        companyId: workspaceCompanyId,
      };
      const response = await axios.post(
        `${API_URL}/TwilioUser/createTwilioWorkspace`,
        payload
      );
      if (response.data?.workspaceSid) {
        toast.success('Workspace created successfully!');
        setWorkspaceName('');
        setWorkspaceCompanyId('0');
        // Refresh data after creation
        fetchWorkspaces();
      } else {
        toast.error('Workspace creation failed. No workspaceSid returned.');
      }
    } catch (error) {
      toast.error('Error creating workspace: ' + error.message);
    }
  };
  // handleDeleteWorkspace
   // 3) Delete queue
   const handleDeleteWorkspace = async (workspaceSid) => {
    if (!workspaceSid) return;
    try {
      await axios.delete(`${API_URL}/TwilioUser/DeleteTwilioWorkspace/${companyId}/${workspaceSid}`);
      toast.success('Workspace deleted successfully');
      fetchWorkspaces(); // refresh after deletion
    } catch (error) {
      toast.error('Error deleting workspace: ' + error.message);
    }
  };

  const handleWorkspaceUpdate = async () => {
    if (!workspaceName.trim() || !workspaceCompanyId.trim()) {
      toast.error("All fields are required for workspace update.");
      return;
    }
    try {
      const payload = {
        workspaceFriendlyName: workspaceName,
        companyId: workspaceCompanyId,
        workspaceSid: selectedWorkspace.workspaceSid,
      };
      const response = await axios.post(`${API_URL}/TwilioUser/UpdateTwilioWorkspace`, payload);
      if (response.data[0]!="-1") {
        toast.success('Workspace updated successfully!');
        setSelectedWorkspace(null);
        setWorkspaceName('');
        setWorkspaceCompanyId('0');
        fetchWorkspaces();
      } else {
        toast.error('Workspace update failed.');
      }
    } catch (error) {
      toast.error('Error updating workspace: ' + error.message);
    }
  };

  const handleEditWorkspace = (workspace) => {
    setSelectedWorkspace(workspace);
    setWorkspaceName(workspace.workspaceFriendlyName || '');
    setWorkspaceCompanyId(workspace.companyId ? workspace.companyId.toString() : '0');
  };

  const workspaceColumns = useMemo(
    () => [
      {
        accessorKey: 'workspaceFriendlyName',
        header: ({ column }) => (
          <DataGridColumnHeader title="Workspace Name" column={column} />
        ),
        cell: ({ row }) => row.original.workspaceFriendlyName || '',
        meta: {
          headerClassName: 'min-w-[180px]',
          cellClassName: 'text-black text-sm font-medium',
        },
      },
      {
        accessorKey: 'workspaceSid',
        header: ({ column }) => (
          <DataGridColumnHeader title="Workspace SID" column={column} />
        ),
        cell: ({ row }) => row.original.workspaceSid || '',
        meta: {
          headerClassName: 'min-w-[180px]',
          cellClassName: 'text-black text-sm font-medium',
        },
      },
      {
        accessorKey: 'active',
        header: ({ column }) => (
          <DataGridColumnHeader title="Active?" column={column} />
        ),
        cell: ({ row }) => {
          const active = row.original.active;
          return (
            <Badge
              badgeContent={active ? 'No' : 'Yes'}
              color={active ? 'warning' : 'success'}
              className="px-2 py-1 rounded-full text-sm font-medium"
            />
          );
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-black text-sm font-medium',
        },
      },
      {
        // NEW: Delete action column
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (         

          <div className="flex gap-2">
          {/* <button className="btn btn-icon btn-sm" title="Edit" onClick={()=>{setSelectedItem(row.original);setisDrawer(true)}}>
          <KeenIcon icon="notepad-edit" />
          </button> */}
          <button className="btn btn-icon btn-sm" title="Edit" onClick={() => handleEditWorkspace(row.original)}>
              <KeenIcon icon="notepad-edit" />
            </button>
          <button
            className="btn btn-icon btn-sm text-danger"
            title="Delete Workspace"
            onClick={() => handleDeleteWorkspace(row.original.workspaceSid)}
          >
          <KeenIcon icon="trash" />
          </button>
          </div>

        ),
        meta: {
          headerClassName: 'min-w-[80px]',
          cellClassName: 'text-red text-sm font-medium',
        },
      },
    ],
    []
  );

  // ------------------------------------------
  // Workers
  // ------------------------------------------
  const [workersData, setWorkersData] = useState([]);
  const [workerName, setWorkerName] = useState('');
  const [workerContactUri, setWorkerContactUri] = useState('');
  const [workerSkills, setWorkerSkills] = useState('');
  const [workerLanguages, setWorkerLanguages] = useState('');
  const [workerCompanyId, setWorkerCompanyId] = useState('0');

// NEW: For worker, add workspace selection and attributes
const [workerWorkspaceSid, setWorkerWorkspaceSid] = useState('');
const [selectedWorker, setSelectedWorker] = useState(null);


  const fetchWorkers = async () => {
    setLoadingWorkers(true);
    try {
      const resp = await axios.get(`${API_URL}/twiliophone/GetTwilioWorkerByCompanyid/${companyId}`);
      setWorkersData(resp.data || []);
    } catch (error) {
      toast.error('Error fetching worker data: ' + error.message);
    } finally {
      setLoadingWorkers(false);
    }
  };

  const handleWorkerSubmit = async () => {
     // For creation, all fields required
     if (
      !workerName.trim() ||
      !workerCompanyId.trim() ||
      !workerContactUri.trim() ||
      !workerSkills.trim() ||
      !workerLanguages.trim() ||
      !workerWorkspaceSid.trim()
    ) {
      toast.error("All fields are required for worker creation.");
      return;
    }
    try {
      const payload = {
        WorkerFriendlyName: workerName,
        companyId: workerCompanyId,
        ContactUri: workerContactUri,
        Skills: [workerSkills],      // array
        Languages: [workerLanguages] // array
      };
      const response = await axios.post(
        `${API_URL}/TwilioUser/createTwilioWorker`,
        payload
      );
      if (response.data?.workerSid) {
        toast.success('Worker created successfully!');
        setWorkerName('');
        setWorkerContactUri('');
        setWorkerSkills('');
        setWorkerLanguages('');
        setWorkerCompanyId('0');
        // Refresh data after creation
        fetchWorkers();
      } else {
        toast.error('Worker creation failed. No workerSid returned.');
      }
    } catch (error) {
      toast.error('Error creating worker: ' + error.message);
    }
  };
  // handleDeleteWorker
  // 3) Delete queue
  const handleDeleteWorker = async (workerSid) => {
    if (!workerSid) return;
    try {
      await axios.delete(`${API_URL}/TwilioUser/DeleteTwilioWorker/${companyId}/${workerSid}`);
      toast.success('Worker deleted successfully');
      fetchWorkers(); // refresh after deletion
    } catch (error) {
      toast.error('Error deleting worker: ' + error.message);
    }
  };

  // Updated worker update: Extract separate fields from the row's attributes during edit
  const handleWorkerUpdate = async () => {
    if (
      !workerName.trim() ||
      !workerCompanyId.trim() ||
      !workerContactUri.trim() ||
      !workerSkills.trim() ||
      !workerLanguages.trim() ||
      !workerWorkspaceSid.trim()
    ) {
      toast.error("All fields are required for worker update.");
      return;
    }
    try {
      const payload = {
        workerFriendlyName: workerName,
        companyId: workerCompanyId,
        workerSid: selectedWorker.workerSid,
        workspaceSid: workerWorkspaceSid,
        // Send these fields separately (they were extracted during edit)
        contactUri: workerContactUri,
        skills: workerSkills.split(',').map(s => s.trim()),
        languages: workerLanguages.split(',').map(l => l.trim()),
      };
      const response = await axios.post(`${API_URL}/TwilioUser/UpdateTwilioWorker`, payload);
      if (response.data?.workerSid) {
        toast.success('Worker updated successfully!');
        setSelectedWorker(null);
        setWorkerName('');
        setWorkerContactUri('');
        setWorkerSkills('');
        setWorkerLanguages('');
        setWorkerCompanyId('0');
        setWorkerWorkspaceSid('');
        fetchWorkers();
      } else {
        toast.error('Worker update failed.');
      }
    } catch (error) {
      toast.error('Error updating worker: ' + error.message);
    }
  };



// When editing a worker, extract the separate fields from the attributes JSON.
const handleEditWorker = (worker) => {
  setSelectedWorker(worker);
  setWorkerName(worker.workerFriendlyName || '');
  setWorkerCompanyId(worker.companyId ? worker.companyId.toString() : '0');
  // Parse the attributes JSON to pre-fill the separate fields.
  let attr = {};
  try {
    attr = JSON.parse(worker.attributes);
  } catch (e) {
    // Fallback if parsing fails.
  }
  setWorkerContactUri(attr.contact_uri || '');
  setWorkerSkills(attr.skills ? attr.skills.join(', ') : '');
  setWorkerLanguages(attr.languages ? attr.languages.join(', ') : '');
  setWorkerWorkspaceSid(worker.workspaceSid || '');
};


  const workerColumns = useMemo(
    () => [
      {
        accessorKey: 'workerFriendlyName',
        header: ({ column }) => (
          <DataGridColumnHeader title="Worker Name" column={column} />
        ),
        cell: ({ row }) => row.original.workerFriendlyName || '',
        meta: {
          headerClassName: 'min-w-[120px]',
          cellClassName: 'text-black text-sm font-medium',
        },
      },
      {
        accessorKey: 'workspaceSid',
        header: ({ column }) => (
          <DataGridColumnHeader title="Workspace SID" column={column} />
        ),
        cell: ({ row }) => row.original.workspaceSid || '',
        meta: {
          headerClassName: 'min-w-[120px]',
          cellClassName: 'text-black text-sm font-medium',
        },
      },
      {
        accessorKey: 'attributes',
        header: ({ column }) => (
          <DataGridColumnHeader title="Attributes" column={column} />
        ),
        cell: ({ row }) => row.original.attributes || '',
        meta: {
          headerClassName: 'min-w-[120px]',
          cellClassName: 'text-black text-sm font-medium',
        },
      },
      {
        accessorKey: 'workerSid',
        header: ({ column }) => (
          <DataGridColumnHeader title="Worker SID" column={column} />
        ),
        cell: ({ row }) => row.original.workerSid || '',
        meta: {
          headerClassName: 'min-w-[120px]',
          cellClassName: 'text-black text-sm font-medium',
        },
      },
      {
        accessorKey: 'active',
        header: ({ column }) => (
          <DataGridColumnHeader title="Active?" column={column} />
        ),
        cell: ({ row }) => {
          const active = row.original.active;
          return (
            <Badge
              badgeContent={active ? 'No' : 'Yes'}
              color={active ? 'warning' : 'success'}
              className="px-2 py-1 rounded-full text-sm font-medium"
            />
          );
        },
        meta: {
          headerClassName: 'min-w-[100px]',
          cellClassName: 'text-black text-sm font-medium',
        },
      },
      {
        // NEW: Delete action column
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (

                <div className="flex gap-2">
                {/* <button className="btn btn-icon btn-sm" title="Edit" onClick={()=>{setSelectedItem(row.original);setisDrawer(true)}}>
                <KeenIcon icon="notepad-edit" />
                </button> */}
               <button className="btn btn-icon btn-sm" title="Edit" onClick={() => handleEditWorker(row.original)}>
              <KeenIcon icon="notepad-edit" />
            </button>
                <button
                  className="btn btn-icon btn-sm text-danger"
                  title="Delete"
                  onClick={() => handleDeleteWorker(row.original.workerSid)}
                >
                <KeenIcon icon="trash" />
                </button>
                </div>
        ),
        meta: {
          headerClassName: 'min-w-[80px]',
          cellClassName: 'text-red text-sm font-medium',
        },
      },
    ],
    []
  );

  // ------------------------------------------
  // Initial data load
  // ------------------------------------------
  useEffect(() => {
    fetchQueues();
    fetchWorkspaces();
    fetchWorkers();
  }, [API_URL]);

  // ------------------------------------------
  // Handle Tab Change
  // ------------------------------------------
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // ------------------------------------------
  // Filter the current tab's data by search
  // ------------------------------------------
  const filteredQueues = useMemo(() => {
    if (!queuesData.length) return [];
    return queuesData.filter((item) => {
      // match search
      return (
        item?.friendlyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.queueSid?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [queuesData, searchQuery]);

  const filteredWorkspaces = useMemo(() => {
    if (!workspacesData.length) return [];
    return workspacesData.filter((item) => {
      // Some endpoints return `friendlyName`, some return `workspaceFriendlyName`.
      // If needed, unify or adjust the search below:
      return (
        item?.friendlyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.workspaceFriendlyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.workspaceSid?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [workspacesData, searchQuery]);

  const filteredWorkers = useMemo(() => {
    if (!workersData.length) return [];
    return workersData.filter((item) => {
      // If the API returns 'friendlyName' or 'workerFriendlyName', unify as needed
      const name = item?.friendlyName || item?.workerFriendlyName || '';
      return (
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.workerSid?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [workersData, searchQuery]);

  // ------------------------------------------
  // Toolbar with Tabs
  // ------------------------------------------
  const Toolbar = () => {
    const { table } = useDataGrid();
    return (
      <div>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          className="mb-2"
        >
          <Tab label="Queues" value="queues" />
          <Tab label="Workspaces" value="workspaces" />
          <Tab label="Workers" value="workers" />
        </Tabs>
      </div>
    );
  };

  // ------------------------------------------
  // Render
  // ------------------------------------------
  return (
    <div>
      {/* Global Search input */}
      {/* <div className="mb-4">
        <InputBase
          placeholder="Search by Friendly Name or SID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ border: '1px solid #ccc', padding: '4px 8px' }}
        />
      </div> */}
<div>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          className="mb-2"
        >
          <Tab label="Queues" value="queues" />
          <Tab label="Workspaces" value="workspaces" />
          <Tab label="Workers" value="workers" />
        </Tabs>
      </div>
      {/* Tabs-specific forms and DataGrid */}
      {activeTab === 'queues' && (
        <>
          {/* Form for Queues */}
          {/* <h3>Queues</h3> */}
          <div className="flex items-baseline gap-2.5 mb-4  p-4">
            <label className="w-72">Select Company</label>
            <select
              className="input w-full"
              value={queueCompanyId}
              onChange={(e) => setQueueCompanyId(e.target.value)}
            >
              <option value="0">All Companies</option>
              {companies.map((company) => (
                <option key={company.companyId} value={company.companyId}>
                  {company.companyName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-baseline gap-2.5 mb-4 p-4">
            <label className="w-72">Queue Friendly Name:</label>
            <input
              type="text"
              className="input"
              value={queueName}
              onChange={(e) => setQueueName(e.target.value)}
            />
          </div>
         



          {/* Centered Create/Update Buttons */}
          <div className="flex justify-center mb-4 space-x-4">
            {selectedQueue ? (
              <>
                <Button variant="contained" onClick={handleQueueUpdate}>
                  Update Queue
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSelectedQueue(null);
                    setQueueName('');
                    setQueueCompanyId('0');
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="contained" onClick={handleQueueSubmit}>
                Create Queue
              </Button>
            )}
          </div>


          {/* DataGrid for Queues */}
          <DataGrid
            columns={queueColumns}
            data={filteredQueues}
            // toolbar={<Toolbar />}
            rowSelection={false}
            pagination={{ size: 10 }}
            sorting={[{ id: 'friendlyName', desc: false }]}
            layout={{ card: false }}
            isLoading={loadingQueues}
          />
        </>
      )}

      {activeTab === 'workspaces' && (
        <div>
          {/* Form for Workspaces */}
          {/* <h3>Workspaces</h3> */}
          <div className="flex items-baseline gap-2.5 mb-4 p-4">
            <label className="w-72">Select Company</label>
            <select
              className="input w-full"
              value={workspaceCompanyId}
              onChange={(e) => setWorkspaceCompanyId(e.target.value)}
            >
              <option value="0">All Companies</option>
              {companies.map((company) => (
                <option key={company.companyId} value={company.companyId}>
                  {company.companyName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-baseline gap-2.5 mb-4 p-4">
            <label className="w-72">Workspace Friendly Name:</label>
            <input
              type="text"
              className="input w-all"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
          </div>
          
          <div className="flex justify-center mb-4 space-x-4">
            {selectedWorkspace ? (
              <>
                <Button variant="contained" onClick={handleWorkspaceUpdate}>
                  Update Workspace
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSelectedWorkspace(null);
                    setWorkspaceName('');
                    setWorkspaceCompanyId('0');
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="contained" onClick={handleWorkspaceSubmit}>
                Create Workspace
              </Button>
            )}
          </div>
          {/* DataGrid for Workspaces */}
          <DataGrid
            columns={workspaceColumns}
            data={filteredWorkspaces}
            // toolbar={<Toolbar />}
            rowSelection={false}
            pagination={{ size: 10 }}
            sorting={[{ id: 'friendlyName', desc: false }]}
            layout={{ card: false }}
            isLoading={loadingWorkspaces}
          />
       </div>
      )}

      {activeTab === 'workers' && (
        <div>
          {/* Form for Workers */}
          {/* <h3>Workers</h3> */}
          <div className="flex items-baseline gap-2.5 mb-4 p-2">
            <label className="w-72">Select Company</label>
            <select
              className="input"
              value={workerCompanyId}
              onChange={(e) => setWorkerCompanyId(e.target.value)}
            >
              <option value="0">All Companies</option>
              {companies.map((company) => (
                <option key={company.companyId} value={company.companyId}>
                  {company.companyName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-baseline gap-2.5 mb-4 p-2">
            <label className="w-72">Worker Friendly Name:</label>
            <input
              type="text"
              className="input"
              value={workerName}
              onChange={(e) => setWorkerName(e.target.value)}
            />
          </div>
          <div className="flex items-baseline gap-2.5 mb-4 p-2">
            <label className="w-72">Contact Uri:</label>
            <input
              type="text"
              className="input"
              value={workerContactUri}
              onChange={(e) => setWorkerContactUri(e.target.value)}
            />
          </div>
          <div className="flex items-baseline gap-2.5 mb-4 p-2">
            <label className="w-72">Skills:</label>
            <input
              type="text"
              className="input"
              value={workerSkills}
              onChange={(e) => setWorkerSkills(e.target.value)}
            />
          </div>
          <div className="flex items-baseline gap-2.5 mb-4 p-2">
            <label className="w-72">Languages:</label>
            <input
              type="text"
              className="input"
              value={workerLanguages}
              onChange={(e) => setWorkerLanguages(e.target.value)}
            />
          </div>
          
          {/* In update mode, we no longer send the combined attributes */}
          <div className="flex justify-center mb-4 space-x-4">
            {selectedWorker ? (
              <>
                <Button variant="contained" onClick={handleWorkerUpdate}>
                  Update Worker
                </Button>
                <Button variant="outlined" onClick={() => {
                  setSelectedWorker(null);
                  setWorkerName('');
                  setWorkerContactUri('');
                  setWorkerSkills('');
                  setWorkerLanguages('');
                  setWorkerCompanyId('0');
                  setWorkerWorkspaceSid('');
                }}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="contained" onClick={handleWorkerSubmit}>
                Create Worker
              </Button>
            )}
          </div>
          {/* DataGrid for Workers */}
          <DataGrid
            columns={workerColumns}
            data={filteredWorkers}
            // toolbar={<Toolbar />}
            rowSelection={false}
            pagination={{ size: 10 }}
            sorting={[{ id: 'friendlyName', desc: false }]}
            layout={{ card: false }}
            isLoading={loadingWorkers}
          />
        </div>
      )}
    </div>
  );
};

export default TwilioPanel;
