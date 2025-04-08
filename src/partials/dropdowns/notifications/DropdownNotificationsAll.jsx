import { useEffect, useRef, useState } from 'react';
import { getHeight } from '@/utils';
import { useViewport } from '@/hooks';
import { useSelector } from 'react-redux';
import { DropdownNotificationsItem5 } from './items';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const DropdownNotificationsAll = () => {
  const footerRef = useRef(null);
  const [listHeight, setListHeight] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [viewportHeight] = useViewport();
  const offset = 300;
  
  const { userId } = useSelector((state) => state.AuthReducerKey);

  useEffect(() => {
    if (footerRef.current) {
      const footerHeight = getHeight(footerRef.current);
      const availableHeight = viewportHeight - footerHeight - offset;
      setListHeight(availableHeight);
    }
  }, [viewportHeight]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${API_URL}/Notification/user/${userId}`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setNotifications(data);
        } else {
          console.error('Unexpected response format:', data);
          setNotifications([]);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      }
    };
  
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const handleArchiveAll = async () => {
    try {
      const response = await fetch(`${API_URL}/Notification/archive?userId=${userId}`, {
        method: 'PUT',
      });
      const result = await response.text();
      toast.success(result);
      setNotifications([]); // Clear notifications after archiving
    } catch (error) {
      console.error('Error archiving notifications:', error);
      toast.error('Error archiving notifications.');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const payload = {
        userID: userId,
        status: "Read",
        createdBy: userId,
      };

      const response = await fetch(`${API_URL}/Notification/UpdateNotification`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.text();
      if (response.ok) {
        toast.success(result);
        // Update the UI by setting all notifications to read status
        setNotifications((prev) =>
          prev.map((notification) => ({ ...notification, status: "Read" }))
        );
      } else {
        toast.error('Failed to update notifications');
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      toast.error('Error marking notifications as read.');
    }
  };

  const buildList = () => {
    if (!Array.isArray(notifications) || notifications.length === 0) {
      return <p className="text-center text-gray-500 p-4">No notifications found</p>;
    }
  
    return (
      <div className="flex flex-col gap-5 pt-3 pb-4 divider-y divider-gray-200">
        {notifications.map((notification) => (
          <div key={notification.notificationID}>
            <DropdownNotificationsItem5 
              userName={notification.userName} 
              avatar={notification.imageName}
              badgeColor="badge-info" 
              description={notification.message} 
              day={notification.title}
              link={notification.title} 
              date={notification.notificationDateTime}
              info={notification.notificationType}
              status={notification.status} 
            />
            <div className="border-b border-b-gray-200"></div>
          </div>
        ))}
      </div>
    );
  };
  
  const buildFooter = () => {
    return (
      <>
        <div className="border-b border-b-gray-200"></div>
        <div className="grid grid-cols-2 p-5 gap-2.5">
          <button className="btn btn-sm btn-light justify-center" onClick={handleArchiveAll}>
            Archive all
          </button>
          <button className="btn btn-sm btn-light justify-center" onClick={handleMarkAllAsRead}>
            Mark all as read
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="grow">
      <div className="scrollable-y-auto" style={{ maxHeight: `${listHeight}px` }}>
        {buildList()}
      </div>
      <div ref={footerRef}>{buildFooter()}</div>
    </div>
  );
};

export { DropdownNotificationsAll };
