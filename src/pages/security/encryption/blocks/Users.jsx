import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/utils';
import { DataGrid, DataGridColumnHeader, DataGridRowSelectAll, DataGridRowSelect } from '@/components';
import { Input } from '@/components/ui/input';
import axios from 'axios'; // Import axios for making the API request
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
//const companyId = 1; // Replace with the dynamic company ID
const Users = () => {
  
  const {userId,companyId}=useSelector(state=>state.AuthReducerKey);
  const [users, setUsers] = useState([]);  // State to hold users data
  const [loading, setLoading] = useState(true);  // State to manage loading state

  useEffect(() => {
    // Fetch user data (for the sake of example, we are using hardcoded user data)
    axios.get(`${API_URL}/EncryptionStatus/GetAllEncryptionStatusByCompany/${companyId}`) // Fetch data from the provided API URL
      .then((response) => {
        // Assuming response.data is an array of encryption status objects
        setUsers(response.data);  // Set the fetched data into the users state
        setLoading(false);  // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);  // Set loading to false even if there is an error
      });
  }, []); // Empty dependency array to run once when the component mounts

  // Function to handle the change of encryption/decryption status
  const handleEncryptionChange = (encryptionID, isEncrypt, EorD) => {
    let payload;

    // Check if it's for encryption (EorD === 1) or decryption (EorD !== 1)
    if (EorD === 1) {
      payload = {
        encryptionID: encryptionID,
        isEncrypt: isEncrypt,  // true for encrypt, false for decrypt
        modifiedBy: String(userId)  // Modify with the actual user who made the change
      };
    } else {
      payload = {
        encryptionID: encryptionID,
        isEncrypt: false,  // true for encrypt, false for decrypt
        modifiedBy: String(userId) // Modify with the actual user who made the change
      };
    }

    // Make a PUT request to update the encryption status
    axios.put(`${API_URL}/EncryptionStatus/UpdateEncryptionStatus`, payload)
      .then((response) => {
        // Assuming the response indicates success, update the local state
        if (EorD === 1) {
          toast.success('Encryption status updated successfully');
        } else {
          toast.success('Decryption status updated successfully');
        }

        // Update local state based on the status (either encryption or decryption)
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.encryptionID === encryptionID
              ? {
                  ...user,
                  isEncrypt: isEncrypt,     // Update the isEncrypt flag
                  isDecrypt: !isEncrypt     // Ensure isDecrypt is updated as the opposite of isEncrypt
                }
              : user
          )
        );
      })
      .catch((error) => {
        console.error("Error updating encryption status: ", error);
        toast.error('Failed to update encryption status');
      });
  };

  const ColumnInputFilter = ({ column }) => {
    return <Input placeholder="Filter..." value={column.getFilterValue() ?? ''} onChange={event => column.setFilterValue(event.target.value)} className="h-9 w-full max-w-40" />;
  };

  const columns = useMemo(() => [{
    accessorKey: 'encryptionID',
    header: () => <DataGridRowSelectAll />,
    cell: ({ row }) => <DataGridRowSelect row={row} />,
    enableSorting: false,
    enableHiding: false,
    meta: {
      headerClassName: 'w-0'
    }
  }, {
    accessorFn: row => row.tableName,
    id: 'tableName',
    header: ({ column }) => <DataGridColumnHeader title="Table Name" filter={<ColumnInputFilter column={column} />} column={column} />,
    enableSorting: true,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-0.5">
            <Link to="#" className="text-sm font-medium text-gray-900 hover:text-primary-active mb-px">
              {row.original.tableName}
            </Link>
          </div>
        </div>
      );
    },
    meta: {
      className: 'min-w-[300px]',
      cellClassName: 'text-gray-800 font-normal'
    }
  }, {
    accessorFn: row => row.progress,
    id: 'progress',
    header: ({ column }) => <DataGridColumnHeader title="Progress" column={column} />,
    enableSorting: true,
    cell: info => {
      const progressValue = info.row.original.progress;
      let progressColor = 'bg-green-600'; // Default green color

      // Change color based on progress
      if (progressValue <= 30) {
        progressColor = 'bg-red-600'; // Red for low progress
      } else if (progressValue <= 70) {
        progressColor = 'bg-yellow-500'; // Yellow for moderate progress
      }

      return (
        <div className="relative w-full h-6 rounded-full bg-gray-300">
          <div
            className={`h-full ${progressColor} rounded-full`}
            style={{ width: `${progressValue}%` }}
          >
            <span className="absolute left-1/2 transform -translate-x-1/2 text-white font-semibold text-sm">
              {progressValue}%
            </span>
          </div>
        </div>
      );
    },
    meta: {
      headerClassName: 'min-w-[180px]'
    }
  }, {
    accessorFn: row => row.encryptionKey,
    id: 'encryptionKey',
    header: ({ column }) => <DataGridColumnHeader title="Encryption Key" column={column} />,
    enableSorting: true,
    cell: info => {
      const encryptionKey = info.row.original.encryptionKey;
      // Show the encryption key as masked text (e.g., "************")
      return (
        <span className="text-gray-900 font-semibold">
          {encryptionKey ? '************' : '-'}
        </span>
      );
    },
    meta: {
      headerClassName: 'min-w-[180px]'
    }
  }, {
    accessorFn: row => row.isEncrypt,
    id: 'isEncrypt',
    header: ({ column }) => <DataGridColumnHeader title="Encrypt" column={column} />,
    enableSorting: true,
    cell: info => {
      const encryptionID = info.row.original.encryptionID;
      const currentStatus = info.row.original.isEncrypt;

      return (
        <span>
          <input
            className="radio"
            name={`encrypt-${encryptionID}`}
            type="radio"
            value="1"
            checked={currentStatus === true}
            onChange={() => handleEncryptionChange(encryptionID, true, 1)}  // Update status to "Encrypt"
          />
        </span>
      );
    },
    meta: {
      headerClassName: 'min-w-[180px]'
    }
  }, {
    accessorFn: row => !row.isEncrypt,  // Inverse of isEncrypt
    id: 'isDecrypt',
    header: ({ column }) => <DataGridColumnHeader title="Decrypt" column={column} />,
    enableSorting: true,
    cell: info => {
      const encryptionID = info.row.original.encryptionID;
      const currentStatus = !info.row.original.isEncrypt; // Inverse of isEncrypt
  
      return (
        <span>
          <input
            className="radio"
            name={`decrypt-${encryptionID}`}
            type="radio"
            value="1"
            checked={currentStatus === true}
            onChange={() => handleEncryptionChange(encryptionID, false, 2)}  // Update status to "Decrypt"
          />
        </span>
      );
    },
    meta: {
      headerClassName: 'min-w-[180px]'
    }
  }
  ], []);

  const handleRowSelection = (state) => {
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
    return (
      <div className="card-header flex-wrap gap-2 border-b-0 px-5">
        <h3 className="card-title font-medium text-sm">Encryption Status</h3>
        <div className="flex flex-wrap gap-2 lg:gap-5">
          {/* You can add more toolbar options here */}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while data is fetching
  }

  return (
    <DataGrid 
      columns={columns} 
      data={users}  // Bind users data to the DataGrid
      rowSelection={true} 
      onRowSelectionChange={handleRowSelection} 
      pagination={{ size: 4 }} 
      sorting={[{ id: 'tableName', desc: false }]} 
      toolbar={<Toolbar />} 
      layout={{ card: true }} 
    />
  );
};

export { Users };
