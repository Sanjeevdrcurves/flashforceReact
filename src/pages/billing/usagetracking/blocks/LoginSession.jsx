/* eslint-disable prettier/prettier */
import React, { useState, useMemo, useEffect } from 'react';
import { DataGrid } from '@/components';
import { Input } from '@/components/ui/input';
import { Toaster, toast } from 'sonner';
import { useSelector } from 'react-redux';

const LoginSession = ({ timeFilter,selectedCompanyId }) => {
    const [sessions, setSessions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const { userId, companyId } = useSelector((state) => state.AuthReducerKey);

    const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

    // Fetch login sessions
    const fetchSessions = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/Session/GetAllSessions/${selectedCompanyId}/${userId}?timeFilter=${timeFilter}`);
            const data = await response.json();
            setSessions(data || []);
        } catch (error) {
            toast.error('Failed to fetch login sessions!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, [timeFilter,selectedCompanyId]);

    // Filter sessions based on the search term
    const filteredSessions = useMemo(() => {
        if (!searchTerm) return sessions;
        return sessions.filter((session) =>
            session.locationName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, sessions]);

    // Define columns for the DataGrid
    const columns = useMemo(
        () => [
            {
                accessorKey: 'locationName',
                header: 'Location',
                cell: ({ row }) => <span>{row.original.locationName}</span>,
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => (
                    <span
                        className={`text-white px-2 py-1 rounded-full text-xs ${row.original.status.toLowerCase() === 'success'
                                ? 'bg-blue-500'
                                : row.original.status.toLowerCase() === 'failed'
                                    ? 'bg-red-500'
                                    : 'bg-blue-500'
                            }`}
                    >
                        {row.original.status}
                    </span>
                ),
            },
            {
                accessorKey: 'device',
                header: 'Device',
                cell: ({ row }) => <span>{row.original.device}</span>,
            },
            {
                accessorKey: 'ipAddress',
                header: 'IP Address',
                cell: ({ row }) => <span>{row.original.ipAddress}</span>,
            },
            {
                accessorKey: 'time',
                header: 'Time',
                cell: ({ row }) => <span>{row.original.time}</span>,
            },
        ],
        []
    );

    return (
        <div className='p-3'>
            <div className="card-header flex justify-between items-center">
                <h3 className="card-title text-lg font-semibold">Login Sessions</h3>
            </div>
            <Toaster />

            {/* Search Input */}
            {/* <div className="toolbar mb-4 flex flex-col sm:flex-row gap-2 items-center">
        <Input
          placeholder="Search by Location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div> */}

            {/* DataGrid */}
            <DataGrid
                columns={columns}
                data={filteredSessions}
                pagination={{ size: 5 }}
                loading={loading}
            />
        </div>
    );
};

export { LoginSession };
