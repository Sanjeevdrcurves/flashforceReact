import { Fragment, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Container } from '@/components/container';
import { DataGrid, DataGridColumnHeader } from '@/components';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageNavbar } from '@/pages/account';
import {
  Toolbar,
  ToolbarActions
} from '@/partials/toolbar';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const TwilioAvailableNumbersTable = () => {
  const [loading, setLoading] = useState(false);
  const { companyId } = useSelector((state) => state.AuthReducerKey);
  const [tableData, setTableData] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTableData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/TwilioUser/GetAvailablePhoneNumbersPrice/${companyId}/US`);
      setTableData(response?.data || []);
    } catch (error) {
      toast.error('Failed to load available phone numbers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchTableData();
    }
  }, [companyId]);

  // Include all capability fields you need from row.original
  const handleBuyNumber = (phoneNumber, price, type, region, voice, fax, sms, mms) => {
    setSelectedNumber({ phoneNumber, price, type, region, voice, fax, sms, mms });
    setIsModalOpen(true);
  };

  const confirmPurchase = async () => {
    try {
      const response = await axios.post(`${API_URL}/TwilioUser/PurchaseTwilioPhoneNumber`, {
        companyId: companyId,
        phoneNumber: selectedNumber.phoneNumber,
        region: selectedNumber.region,
        type: selectedNumber.type,
        price: selectedNumber.price
      });

      let data = response.data;

      // If the data is a string, try to parse it as JSON
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (parseError) {
          toast.error("Unable to process purchase details.");
          return;
        }
      }

      // Now `data` should be an object; check for the phone_number field
      if (data && data.phone_number) {
        // Optionally update selectedNumber if you want to store the new Twilio data
        // setSelectedNumber(data);
        setIsModalOpen(false);
        toast.success(`Successfully purchased ${data.phone_number}`);
      } else {
        toast.error("Purchase was successful, but no details were returned.");
      }
    } catch (error) {
      toast.error(`Failed to purchase ${selectedNumber.phoneNumber}`);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'srNo',
        header: ({ column, table }) => <DataGridColumnHeader title="Sr No" column={column} />,
        cell: ({ row, table }) => {
          const pageIndex = table.getState().pagination.pageIndex;
          const pageSize = table.getState().pagination.pageSize;
          return pageIndex * pageSize + row.index + 1;
        },
      },
      {
        accessorKey: 'phoneNumber',
        header: ({ column }) => <DataGridColumnHeader title="Number" column={column} />,
      },
      {
        accessorKey: 'type',
        header: ({ column }) => <DataGridColumnHeader title="Type" column={column} />,
      },
      {
        accessorKey: 'capabilities',
        header: ({ column }) => <DataGridColumnHeader title="Capabilities" column={column} />,
        cell: ({ row }) => (
          <div>
            {row.original.voice && '📞 Voice '}
            {row.original.sms && '💬 SMS '}
            {row.original.mms && '🖼 MMS '}
            {row.original.fax && '📠 Fax '}
          </div>
        ),
      },
      {
        accessorKey: 'region',
        header: ({ column }) => <DataGridColumnHeader title="Region" column={column} />,
      },
      {
        accessorKey: 'addressRequirement',
        header: ({ column }) => <DataGridColumnHeader title="Address Requirement" column={column} />,
      },
      {
        accessorKey: 'price',
        header: ({ column }) => <DataGridColumnHeader title="Monthly Fee" column={column} />,
        cell: ({ row }) => <span>${row.original.price.toFixed(2)}</span>,
      },
      {
        accessorKey: 'actions',
        header: ' ',
        cell: ({ row }) => (
          <Button
            variant="outline"
            className="bg-blue-600 hover:bg-blue-200 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition"
            onClick={() =>
              handleBuyNumber(
                row.original.phoneNumber,
                row.original.price,
                row.original.type,
                row.original.region,
                row.original.voice,
                row.original.fax,
                row.original.sms,
                row.original.mms
              )
            }
          >
            Buy
          </Button>
        ),
      },
    ],
    []
  );

  return (
<>
     
          <PageNavbar />
          
          {/* Container matching your "Addnewrole" design */}
         
            
            {/* Optional Toolbar (similar to Addnewrole) */}
            <Toolbar>
              <ToolbarActions>
                {/* If you want a button or other controls in the toolbar, add them here */}
              </ToolbarActions>
            </Toolbar>
            
            <Container>
    
      <DataGrid columns={columns} data={tableData} pagination={{ size: 10 }} isLoading={loading} />

      {/* Enhanced Modal Popup */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="p-8 w-[750px] h-auto bg-white rounded-lg shadow-lg border border-gray-300">
          {selectedNumber && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900">Review Phone Number</DialogTitle>
              </DialogHeader>

              {/* Number & Price */}
              <div className="flex justify-between items-center text-lg font-semibold text-gray-800 mt-2">
                <span>{selectedNumber.phoneNumber}</span>
                <span>${selectedNumber.price?.toFixed(2)} monthly fee</span>
              </div>

              {/* Explanation */}
              <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                You’ll be charged <span className="font-semibold">${selectedNumber.price?.toFixed(2)}</span> immediately. Afterwards, 
                you’ll be charged <span className="font-semibold">${selectedNumber.price?.toFixed(2)}/month</span> in addition 
                to usage costs.
              </p>

              {/* Dynamic Capabilities */}
              <div className="mt-4 p-4 bg-gray-100 rounded-md">
                <p className="font-bold text-lg">Capabilities</p>
                <ul className="list-none mt-3 space-y-3">

                  {/* Voice */}
                  {selectedNumber.voice && (
                    <li className="flex items-center space-x-2 py-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-700"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2.003 5.884l3.664-.732a1 1 0 011.125.49l1.528 2.65a1 1 0 01-.12 1.2L6.043 9.65a9.126 9.126 0 004.796 4.796l2.157-2.157a1 1 0 011.2-.12l2.65 1.528a1 1 0 01.49 1.125l-.732 3.664A1.875 1.875 0 0114.125 20 15.125 15.125 0 012 14.125a1.875 1.875 0 01.003-8.241z" />
                      </svg>
                      <span className="font-medium">Voice - Receive and make calls</span>
                    </li>
                  )}

                  {/* Fax */}
                  {selectedNumber.fax && (
                    <li className="flex items-center space-x-2 py-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-700"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6 2a2 2 0 00-2 2v3h12V4a2 2 0 00-2-2H6zM3 9a1 1 0 00-1 1v5a2 2 0 002 2h1v2a1 1 0 001 1h8a1 1 0 001-1v-2h1a2 2 0 002-2v-5a1 1 0 00-1-1H3zm5 6H7v-2h1v2zm3 0h-1v-2h1v2z" />
                      </svg>
                      <span className="font-medium">Fax - Send and receive faxes</span>
                    </li>
                  )}

                  {/* SMS */}
                  {selectedNumber.sms && (
                    <li className="flex items-center space-x-2 py-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-700"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M18 10c0 3.314-3.582 6-8 6-1.412 0-2.747-.24-3.875-.666L3 16l1.318-3.842A6.92 6.92 0 014 10c0-3.314 3.582-6 8-6s8 2.686 8 6z" />
                      </svg>
                      <span className="font-medium">SMS - Send and receive text messages</span>
                    </li>
                  )}

                  {/* MMS */}
                  {selectedNumber.mms && (
                    <li className="flex items-center space-x-2 py-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-700"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M4 3a2 2 0 00-2 2v8a2 2 0 002 2h5a1 1 0 010 2H4a4 4 0 01-4-4V5a4 4 0 014-4h12a4 4 0 014 4v3a1 1 0 11-2 0V5a2 2 0 00-2-2H4zm8.414 3H9a1 1 0 000 2h3a1 1 0 01.707.293l2.707 2.707V7a1 1 0 00-1-1h-1.293z" />
                      </svg>
                      <span className="font-medium">MMS - Send and receive multimedia messages</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <Button
                  variant="outline"
                  className="px-6 py-2 text-gray-700 border-gray-300 hover:bg-gray-100"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all"
                  onClick={confirmPurchase}
                >
                  Buy Phone Number
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      </Container>
    
    
    </>
  );
};

export { TwilioAvailableNumbersTable };
