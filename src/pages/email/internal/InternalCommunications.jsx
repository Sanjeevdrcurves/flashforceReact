import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import axios from "axios";
import { FaSearch, FaTags, FaTrash, FaArchive, FaEye, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

const InternalCommunications = () => {
  const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
  const [comms, setComms] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {userId,companyId}=useSelector(state=>state.AuthReducerKey);
  const objectTypeArr =  {
    117: "Email",
    115: "Call"
};

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // Waits for 500ms before setting the search term

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    fetchEmails();
  }, [page, debouncedSearch, filter]);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/email/fetch-communications`, {
        params: { pageNumber: page, pageSize, debouncedSearch, filter, userId },
      });
      setComms(response.data.communications);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching emails", error);
    }
    setLoading(false);
  };

  const toggleEmailSelection = (id) => {
    setSelectedEmails((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action) => {
    if (selectedEmails.length === 0) return;
    try {
      await axios.post(`${API_URL}/email/bulk-action`, { action, emailIds: selectedEmails });
      fetchEmails();
      setSelectedEmails([]);
    } catch (error) {
      console.error("Error performing bulk action", error);
    }
  };

  const openDrawer = (email) => {
    setSelectedEmail(email);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedEmail(null), 300);
  };

  return (
    <div className="flex bg-gray-100 p-2">
      {/* Sidebar - Email List */}
      <div className="border-r overflow-hidden bg-white flex flex-col grow">
        {/* Header Section */}
        <div className="flex items-center justify-between bg-white p-4 shadow-md border-b">
          <h2 className="text-lg font-semibold">Communications</h2>
          <div className="flex gap-3 items-center">
            {/* Search Bar */}
            <div className="relative w-64">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search communications..."
                className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* Filter Dropdown */}
            <select
              className="p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              
              onChange={(e) => setFilter(e.target.value? "ObjectTypeID="+e.target.value : "")}
            >
              <option value="">All</option>
              <option value="117">Emails</option>
              <option value="115">Calls</option>
              <option value="116">SMS</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {/* <div className="flex justify-between p-4 bg-white border-b">
          <button className="text-gray-600 hover:text-red-500" onClick={() => handleBulkAction("delete")}>
            <FaTrash /> Delete
          </button>
          <button className="text-gray-600 hover:text-blue-500" onClick={() => handleBulkAction("read")}>
            <FaEye /> Mark as Read
          </button>
          <button className="text-gray-600 hover:text-green-500" onClick={() => handleBulkAction("archive")}>
            <FaArchive /> Archive
          </button>
        </div> */}

        {/* Email List - Expanded & Scrollable */}
        
        <div className="overflow-auto">
        {loading ? (
            <div className="flex justify-center items-center h-32 text-lg font-semibold">Loading emails...</div>
          ) : (
            <table className="w-full border-collapse border border-gray-200 table-fixed" >
                <thead>
                <tr className="bg-gray-100">
                    <th className="p-2 border border-gray-200"  style={{ width: "5px" }}>
                    <input type="checkbox" />
                    </th>
                    <th className="p-2 border border-gray-200 text-left" style={{ width: "20px" }}>Type</th>
                    <th className="p-2 border border-gray-200 text-left" style={{ width: "50px" }}>Sender</th>
                    <th className="p-2 border border-gray-200 text-left w-30" style={{ width: "100px" }}>Subject</th>
                    <th className="p-2 border border-gray-200 text-left" style={{ width: "20px" }}>Status</th>
                    <th className="p-2 border border-gray-200 text-left" style={{ width: "60px" }}>Received Date</th>
                </tr>
                </thead>
                <tbody>
                {comms.map((email) => (
                    <tr
                    key={email.communicationId}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => openDrawer(email)}
                    >
                    <td className="p-2 border border-gray-200" style={{ width: "5px" }}>
                        <input
                        type="checkbox"
                        className="w-5 h-5"
                        checked={selectedEmails.includes(email.communicationId)}
                        onChange={(e) => {
                            e.stopPropagation();
                            toggleEmailSelection(email.communicationId);
                        }}
                        />
                    </td>
                    <td className="p-2 border border-gray-200 w-30 truncate" style={{ width: "20px" }}>{objectTypeArr[email.objectTypeID]}</td>
                    <td className="p-2 border border-gray-200" style={{ width: "50px" }}>
                      {email.sender.includes('<') 
                        ? email.sender.split('<')[0].trim()
                        : email.sender}
                    </td>
                    <td className="p-2 border border-gray-200 w-30 truncate" style={{ width: "100px" }}>{email.subject}</td>
                    <td className="p-2 border border-gray-200 w-30 truncate" style={{ width: "20px" }}>{email.status}</td>
                    <td className="p-2 border border-gray-200 text-gray-500" style={{ width: "60px" }}>
                        {new Date(email.createdAt).toLocaleString()}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            )}
        </div>

        {/* Pagination Controls */}
        <div className="p-4 flex justify-between border-t">
          <button
            className="p-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            <FaChevronLeft /> Prev
          </button>
          <span className="p-2">Page {page} of {totalPages}</span>
          <button
            className="p-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Right Side Drawer */}
      <div
        className={`shadow-[0_0_35px_rgba(0,0,0,0.25)] fixed right-0 h-full w-3/5 bg-white shadow-lg transition-transform transform ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-100">
          <h3 className="text-lg font-bold">Email Preview</h3>
          <button className="text-gray-600 hover:text-red-500" onClick={closeDrawer}>
            <FaTimes size={20} />
          </button>
        </div>

        {/* Email Content */}
        <div className="p-4 overflow-y-auto h-full">
          {selectedEmail ? (
            <div>
              <h3 className="text-xl font-bold mb-2">{selectedEmail.subject}</h3>
              <p className="text-gray-700 mb-2">From: {selectedEmail.sender}</p>
              <p className="text-gray-500 mb-2">{new Date(selectedEmail.createdAt).toLocaleString()}</p>
              <div className="border p-4 bg-gray-50 shadow-sm rounded-lg">
                {/* <div dangerouslySetInnerHTML={{ __html: selectedEmail.body }} /> */}
                <iframe
            
            srcDoc={selectedEmail.body}
            style={{
              border: "none",
              display: "block",
              width: "100%",
              minWidth: "300px",
              aspectRatio: "16/9",
              maxWidth: "100%",
              transition: "height 0.3s ease-in-out", // Smooth expand/collapse effect
            }}
            title="Email Preview"
          />
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Select an email to view its content</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InternalCommunications;
