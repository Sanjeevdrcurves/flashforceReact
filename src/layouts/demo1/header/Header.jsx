import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Container } from '@/components/container';
import { MegaMenu } from '../mega-menu';
import { HeaderLogo, HeaderTopbar } from './';
import { Breadcrumbs, useDemo1Layout } from '../';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';


const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
const NotificationBanner = ({ message, actionText, onActionClick, onClose, type = 'warning' }) => {
  return (
    <div className={clsx(
      'w-full text-center p-2 text-sm font-medium flex justify-center items-center relative',
      type === 'warning' ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white'
    )}>
      <span>{message}</span>
      {actionText && (
        <button 
          onClick={onActionClick} 
          className="ml-2 px-3 py-1 text-sm font-semibold bg-white text-black rounded"
        >
          {actionText}
        </button>
      )}
      <button
        className="absolute right-4 text-lg font-bold"
        onClick={onClose}
      >
        ❌
      </button>
    </div>
  );
};

const Header = () => {
  const { headerSticky } = useDemo1Layout();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null); // Changed from array to single notification
  
  const { userId } = useSelector((state) => state.AuthReducerKey);

  useEffect(() => {
    if (headerSticky) {
      document.body.setAttribute('data-sticky-header', 'on');
    } else {
      document.body.removeAttribute('data-sticky-header');
    }
  }, [headerSticky]);

  // Fetch notifications for the current user
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${API_URL}/Notification/user/${userId}`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const dangerNotification = data.find(
            (notif) => notif.notificationType === "Danger" && notif.status === "Active"
          );
          setNotification(dangerNotification || null);
        } else {
          console.error('Unexpected response format:', data);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  // Mark a single notification as read and remove it from the list.
  const handleNotificationClick = async (notificationId) => {
    try {
      const payload = {
        notificationID: notificationId,
        status: "Read",
        createdBy: userId,
      };

      const response = await fetch(`${API_URL}/Notification/UpdateNotification`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.text();
      if (response.ok) {
        // toast.success(result);
        setNotification(null); // Hide banner after marking as read
      } else {
        toast.error('Failed to update notification');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Error marking notification as read.');
    }
  };

  return (
    <header className={clsx(
      'header fixed top-0 z-10 start-0 end-0 flex flex-col shrink-0 bg-[--tw-page-bg] dark:bg-[--tw-page-bg-dark]',
      headerSticky && 'shadow-sm'
    )}>
      {/* Show banner only if notification exists */}
      {notification && (
        <NotificationBanner 
          message={notification.message} 
          actionText={notification.title === "Payment Processing" ? "Pay Now" : null}
          onClose={() => handleNotificationClick(notification.notificationID)}
          onActionClick={() => {
            handleNotificationClick(notification.notificationID);
            navigate('/billing/paymentmethods');
          }}
        />
      )}

      <Container className="flex justify-between items-stretch lg:gap-4">
        <HeaderLogo />
        {pathname.includes('/account') ? <Breadcrumbs /> : <MegaMenu />}
        <HeaderTopbar />
      </Container>
    </header>
  );
};

export { Header };
