import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { DataGrid, DataGridColumnHeader } from "@/components";
import { KeenIcon } from "@/components";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { PageNavbar } from '@/pages/account';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions
} from '@/partials/toolbar';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const TwilioActiveNumbersTable = () => {
  const [loading, setLoading] = useState(false);
  const [activeNumbers, setActiveNumbers] = useState([]);
  const { companyId } = useSelector(state => state.AuthReducerKey);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActiveNumbers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/TwilioUser/acitve-numbers/${companyId}`);
        setActiveNumbers(response.data || []);
      } catch (error) {
        console.error("Error fetching active numbers:", error);
        toast.error("Failed to load active Twilio numbers.");
      } finally {
        setLoading(false);
      }
    };

    fetchActiveNumbers();
  }, [companyId]);

  /**
   * Handles the release of a phone number by making a POST request
   * to the TwilioUser/release-number endpoint.
   */
  const handleRelease = async (phoneNumberSid) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/TwilioUser/release-number`, {
        phoneNumberSid: phoneNumberSid,
        companyId: companyId
      });

      // Show success toast if API responds with success
      if (response.data?.message) {
        toast.success(response.data.message);
      } else {
        toast.success("Phone number released successfully.");
      }

      // Remove the released number from the local state
      setActiveNumbers(prev => prev.filter(num => num.sid !== phoneNumberSid));
    } catch (error) {
      console.error("Error releasing phone number:", error);
      toast.error("Failed to release phone number.");
    } finally {
      setLoading(false);
    }
  };

  // Define columns, including a new Actions/Release button column
  const columns = useMemo(() => [
    {
      accessorKey: 'sid',
      header: ({ column }) => <DataGridColumnHeader title="Phone SID" column={column} />,
      cell: () => '******'
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }) => <DataGridColumnHeader title="Phone Number" column={column} />
    },
    {
      accessorKey: "friendlyName",
      header: ({ column }) => <DataGridColumnHeader title="Friendly Name" column={column} />
    },
    {
      accessorKey: 'capabilities',
      header: ({ column }) => <DataGridColumnHeader title="Capabilities" column={column} />,
      cell: ({ row }) => {
        const { Fax, Voice, SMS, MMS } = row.original.capabilities;
        return `${Fax ? '📠 Fax ' : ''}${Voice ? '📞 Voice ' : ''}${SMS ? '💬 SMS ' : ''}${MMS ? '🖼 MMS ' : ''}`.trim();
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-sm font-medium ${
            row.original.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <button
          onClick={() => handleRelease(row.original.sid)}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded-lg transition"
        >
          Release
        </button>
      ),
    },
  ], []);

  const Toolbar = () => (
    <div className="card-header border-b-0 px-5 flex-wrap">
      <h3 className="card-title">Active Twilio Phone Numbers</h3>
      <button
        onClick={() => navigate('/public-profile/drcurves/TwilioAvailableNumbersTable')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition"
      >
        Buy a number
        <KeenIcon icon="arrow-right" className="w-5 h-5" />
      </button>
    </div>
  );

  return (
    <>
     
          <PageNavbar />
          
          {/* Container matching your "Addnewrole" design */}
         
            

    <Container>
      <DataGrid
        columns={columns}
        data={activeNumbers}
        pagination={{ size: 10 }}
        isLoading={loading}
        toolbar={<Toolbar />}
      />
    </Container>
    
    </>
  );
};

export default TwilioActiveNumbersTable;
