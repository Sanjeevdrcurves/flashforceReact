import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/utils';
import { DataGrid, DataGridColumnHeader, KeenIcon, useDataGrid, DataGridRowSelectAll, DataGridRowSelect } from '@/components';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { Connections } from '../../account/home/user-profile';
import { SessionUser } from './SessionUser';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const ComplianceMonitoring = () => {
  
  const {userId, companyId} = useSelector(state => state.AuthReducerKey);
  const [complianceData, setComplianceData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCompliance = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/ComplianceReport/GetAllComplianceReports?companyId=${companyId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const formattedData = response.data.map((item) => ({
        id: item.complianceReportId,
        reportType: item.reportType,
        generatedAt: item.generatedAt,
        createdBy: item.createdBy,
        createdDate: item.createdDate,
      }));
      setComplianceData(formattedData);
    } catch (error) {
      // toast(`Connection Error`, {
      //   description: `An error occurred while fetching data. Please try again later`,
      //   action: {
      //     label: 'Ok',
      //     onClick: () => console.log('Ok'),
      //   },
      // });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompliance();
  }, []);

  const ColumnInputFilter = ({ column }) => {
    return (
      <Input
        placeholder="Filter..."
        value={column.getFilterValue() ?? ''}
        onChange={(event) => column.setFilterValue(event.target.value)}
        className="h-9 w-full max-w-40"
      />
    );
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: () => <DataGridRowSelectAll />,
        cell: ({ row }) => <DataGridRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        meta: { headerClassName: 'w-0' },
      },
      {
        accessorKey: 'reportType',
        header: ({ column }) => (
          <DataGridColumnHeader title="Report Name" filter={<ColumnInputFilter column={column} />} column={column} />
        ),
        enableSorting: true,
        cell: ({ row }) => <span>{row.original.reportType}</span>,
        meta: { className: 'min-w-[300px]', cellClassName: 'text-gray-800 font-normal' },
      },
      {
        accessorKey: 'createdBy',
        header: ({ column }) => <DataGridColumnHeader title="Generated By" column={column} />,
        enableSorting: true,
        cell: ({ row }) => <span>{row.original.createdBy}</span>,
        meta: { headerClassName: 'min-w-[180px]' },
      },
      {
        accessorKey: 'generatedAt',
        header: ({ column }) => <DataGridColumnHeader title="Generated Date & Time" column={column} />,
        enableSorting: true,
        cell: ({ row }) => <span>{new Date(row.original.generatedAt).toLocaleString()}</span>,
        meta: { headerClassName: 'min-w-[180px]' },
      },
     
    ],
    []
  );

  const handleRowSelection = (state) => {
    const selectedRowIds = Object.keys(state);
    if (selectedRowIds.length > 0) {
      toast(`Total ${selectedRowIds.length} are selected.`, {
        description: `Selected row IDs: ${selectedRowIds}`,
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo'),
        },
      });
    }
  };

  const Toolbar = () => {
    const { table } = useDataGrid();
    const [searchInput, setSearchInput] = useState('');

    return (
      <div className="card-header flex-wrap gap-2 border-b-0 px-5" >
        <h3 className="card-title font-medium text-sm">
          Showing {complianceData.length} reports
        </h3>
        <div className="flex flex-wrap gap-2 lg:gap-5">
          <div className="flex">
            <label className="input input-sm">
              <KeenIcon icon="magnifier" />
              <input
                type="text"
                placeholder="Search reports"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Select defaultValue="active">
              <SelectTrigger className="w-28" size="sm">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="w-32">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <button className="btn btn-sm btn-outline btn-primary">
              <KeenIcon icon="setting-4" /> Filters
            </button>
          </div>
        </div>
      </div>

    );
  };

  return (
    <div className="p-4" id='ComplianceMonitoring'>
      <h1 className="text-xl font-bold mb-4">Compliance Monitoring Dashboard</h1>
     
      <DataGrid
        columns={columns}
        serverSide={false}
        data={complianceData}
        rowSelection={true}
        onRowSelectionChange={handleRowSelection}
        pagination={{ size: 5 }}
        sorting={[
          {
            id: 'reportType',
            desc: false,
          },
        ]}
        toolbar={<Toolbar />}
        layout={{
          card: true,
        }}
        loading={loading}
      />
        

    </div>

  );
};

export default ComplianceMonitoring;
