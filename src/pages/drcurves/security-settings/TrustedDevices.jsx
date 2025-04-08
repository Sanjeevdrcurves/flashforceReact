import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n';
import { KeenIcon, Menu, MenuItem, MenuToggle } from '@/components';
import { toAbsoluteUrl } from '@/utils/Assets';
import { useEffect, useState } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
const TrustedDevices = ({ url }) => {
  const compId = 1;
  const { isRTL } = useLanguage();
  const [tables, settables] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5); // Default visible items

  const fetch_user_session = async () => {
    try {
      const response = await axios.get(`${API_URL}/TrustedDevice/GetAllTrustedDevicesByCompanyId/${compId}`);
      const updatedData = response.data.map((item, index) => ({
        ...item,
        avatar: `300-${(index % 6) + 1}.png`, // Add avatar dynamically if not present
      }));
      settables(updatedData);
    } catch (error) {
      console.error('Error fetching session data:', error);
    }
  };

  useEffect(() => {
    fetch_user_session();
  }, []);

  const renderItem = (table, index) => {
    return (
      <tr key={index}>
        <td>
          <div className="flex items-center grow gap-2.5">
            <img
              src={toAbsoluteUrl(`/media/avatars/${table.avatar}`)}
              className="rounded-full size-9 shrink-0"
              alt={table.deviceName || 'Device Avatar'}
            />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-900 mb-px">
                {table.deviceName}
              </span>
              <span className="text-xs font-normal text-gray-700 leading-3">
                {table.browserName}
              </span>
            </div>
          </div>
        </td>
        <td className="py-2 text-end">{table.location || 'Unknown'}</td>
        <td className="py-2 text-end">{table.activeTime || 'No recent activity'}</td>
        <td className="text-end">
          <Menu className="inline-flex">
            <MenuItem
              toggle="dropdown"
              trigger="click"
              dropdownProps={{
                placement: isRTL() ? 'bottom-start' : 'bottom-end',
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: isRTL() ? [0, -10] : [0, 10], // [skid, distance]
                    },
                  },
                ],
              }}
            >
              <MenuToggle className="btn btn-sm btn-icon btn-light btn-clear">
                <KeenIcon icon="dots-vertical" />
              </MenuToggle>
            </MenuItem>
          </Menu>
        </td>
      </tr>
    );
  };

  return (
    <div className="card min-w-full">
      <div className="card-header">
        <h3 className="card-title">Trusted Devices</h3>
      </div>
      <div className="card-table scrollable-x-auto">
        <div className="scrollable-auto">
          <table className="table align-middle text-2sm text-gray-600">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-start font-normal min-w-48 py-2.5">Device</th>
                <th className="text-end font-medium min-w-20 py-2.5">Location</th>
                <th className="text-end font-medium min-w-20 py-2.5">Active Time</th>
                <th className="min-w-16"></th>
              </tr>
            </thead>
            <tbody>
              {tables.slice(0, visibleCount).map((table, index) => renderItem(table, index))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card-footer justify-center">
        {visibleCount < tables.length && (
          <button
            className="btn btn-link"
            onClick={() => setVisibleCount((prev) => Math.min(prev + 5, tables.length))}
          >
            View More {Math.min(5, tables.length - visibleCount)}
          </button>
        )}
      </div>
    </div>
  );
};

export { TrustedDevices };
