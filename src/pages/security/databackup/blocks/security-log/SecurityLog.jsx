/* eslint-disable prettier/prettier */
import { useMemo, useEffect, useState } from 'react';
import { DataGrid, DataGridColumnHeader, DataGridColumnVisibility, DataGridRowSelect, DataGridRowSelectAll, KeenIcon, useDataGrid } from '@/components';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { SecurityLogData } from '.';
import axios from 'axios';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
const SecurityLog = () => {

  const [backupDataArr, setBackupData] = useState(null);
  useEffect(() => {
    fetchBackups();
  }, []);

  const ColumnInputFilter = ({
    column
  }) => {
    return <Input placeholder="Filter..." value={column.getFilterValue() ?? ''} onChange={event => column.setFilterValue(event.target.value)} className="h-9 w-full max-w-40" />;
  };

  const fetchBackups = async () => {
    var nietos = [];
    try {
      const response = await axios.get(`${API_URL}/BackupData/GetAllBackupData`);
      console.log('fetchBackups: '+response.data);
      const backupsDataArr = response.data;
      debugger;
      if(backupsDataArr && backupsDataArr.length){
        backupsDataArr.map((backupData, index) => {
          var sVariant = 'text-success';
          if(backupData.status == 'deactive')
            sVariant = 'text-warning';
          var obj = {
            timestamp: backupData.storagePath,
            eventType: {
              icon: {
                name: 'information-4',
                variant: sVariant,
              },
              label: backupData.status,
            },
            actionTaken: backupData.createDate,
            sourceIp: backupData.createBy,
            destinationIp: backupData.createDate,
            severity: {
              label: backupData.sizeInMB+' MB',
              variant: 'badge-primary',
            }
          }
          nietos.push(obj);
        });
      }
      setBackupData(nietos);
      
    } catch (error) {
      console.error('Error fetching backups:', error);
    }
  };
  //fetchBackups();
  
  const columns = useMemo(() => [{
    accessorKey: 'id',
    header: () => <DataGridRowSelectAll />,
    cell: ({
      row
    }) => <DataGridRowSelect row={row} />,
    enableSorting: false,
    enableHiding: false,
    meta: {
      headerClassName: 'w-0'
    }
  }, {
    accessorFn: row => row.timestamp,
    id: 'timestamp',
    header: ({
      column
    }) => <DataGridColumnHeader title='Label' filter={<ColumnInputFilter column={column} />} column={column} />,
    enableSorting: true,
    cell: info => info.getValue(),
    meta: {
      headerClassName: 'min-w-[200px]'
    }
  }, {
    accessorFn: row => row.sourceIp,
    id: 'sourceIp',
    header: ({
      column
    }) => <DataGridColumnHeader title='Created By' column={column} />,
    enableSorting: true,
    cell: info => info.getValue(),
    meta: {
      headerTitle: 'Source IP',
      headerClassName: 'min-w-[130px]'
    }
  }, {
    accessorFn: row => row.actionTaken,
    id: 'actionTaken',
    header: ({
      column
    }) => <DataGridColumnHeader title='Created Date' column={column} />,
    enableSorting: true,
    cell: info => info.getValue(),
    meta: {
      headerTitle: 'Action Taken',
      headerClassName: 'min-w-[200px]'
    }
  }, 

  {
    accessorFn: row => row.eventType,
    id: 'eventType',
    header: ({
      column
    }) => <DataGridColumnHeader title='Status' column={column} />,
    enableSorting: true,
    cell: info => <div className="flex items-center gap-1.5">
            <KeenIcon icon={info.row.original.eventType.icon.name} className={`text-lg ${info.row.original.eventType.icon.variant}`} />
            <span className="leading-none font-semibold text-gray-700">
              {info.row.original.eventType.label}
            </span>
          </div>,
    meta: {
      headerTitle: 'Event Type',
      headerClassName: 'min-w-[200px]'
    }
  },{
    accessorFn: row => row.destinationIp,
    id: 'destinationIp',
    header: ({
      column
    }) => <DataGridColumnHeader title='Expiry Date' column={column} />,
    enableSorting: true,
    cell: info => info.getValue(),
    meta: {
      headerTitle: 'Destination IP',
      headerClassName: 'min-w-[130px]'
    }
  }, {
    accessorFn: row => row.severity,
    id: 'severity',
    header: ({
      column
    }) => <DataGridColumnHeader title='Storage' column={column} />,
    enableSorting: true,
    cell: info => <span className={`badge badge-sm badge-outline ${info.row.original.severity.variant}`}>
            {info.row.original.severity.label}
          </span>,
    meta: {
      headerClassName: 'min-w-[110px]'
    }
  }, {
    id: 'click',
     header: ({
      column
    }) => <DataGridColumnHeader title='Action' column={column} />,
    enableSorting: true,
    cell: () => <button className="btn btn-icon btn-light btn-clear btn-sm">
            <KeenIcon icon="notepad" />
          </button>,
    meta: {
      headerClassName: 'w-[60px]'
    }
  }], []);
  const data = useMemo(() => SecurityLogData, []);
  const handleRowSelection = state => {
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
    const {
      table
    } = useDataGrid();
    return <div className="card-header flex-wrap px-5 py-4 border-b-0">
        <h3 className="card-title">Backup Logs</h3>

        
      </div>;
  };

  // return <DataGrid columns={columns} data={data} rowSelection={true} onRowSelectionChange={handleRowSelection} pagination={{
  //   size: 10
  // }} sorting={[{
  //   id: 'timestamp',
  //   desc: false
  // }]} toolbar={<Toolbar />} layout={{
  //   card: true
  // }} />;
  return (
    <>
    {!!backupDataArr && 
    <DataGrid columns={columns} data={backupDataArr} rowSelection={true} onRowSelectionChange={handleRowSelection} pagination={{
      size: 10
    }} sorting={[{
      id: 'timestamp',
      desc: false
    }]} toolbar={<Toolbar />} layout={{
      card: true
    }} />}
    </>
  );
};
export { SecurityLog };