import React, { useEffect, useState } from "react";
import axios from "axios";
import { Fragment } from 'react';
import { Container } from '@/components/container';
import { Toolbar, ToolbarHeading } from '@/partials/toolbar';
import { KeenIcon } from '@/components';
import { Navbar, NavbarActions, NavbarDropdown } from '@/partials/navbar';
import { useSelector } from 'react-redux';
import { sendNotification } from '@/utils/notificationapi';

import { toast } from 'sonner';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
 
const Notifications = () => {
  const {userId,companyId}=useSelector(state=>state.AuthReducerKey)
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from the API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/NotificationSettings/GetAllNotificationSettings/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            // params: {
            //   UserId: User_Id,  // Pass UserId as a query parameter
            // },
          }
        );
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Group notifications by category
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const category = notification.notificationCategory || "Uncategorized";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(notification);
    return groups;
  }, {});

  // Handle the checkbox change and update notification status
// Handle the checkbox change and update notification status
const handleStatusChange = async (settingID, newStatus) => {
  try {
    // Update status locally first
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.settingID === settingID
          ? { ...notification, notificationStatus: newStatus }
          : notification
      )
    );

    // Send the update to the backend
    const response = await axios.put(
      `${API_URL}/NotificationSettings/UpdateNotificationSetting`,
      {
        settingID: settingID,
        notificationStatus: Boolean(newStatus),
        UserId: userId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    // Show success notification if API response status is "Success"
    if (response.data.status === "Success") {
      toast.success("Notification status updated successfully!");


// Send Notification
await sendNotification(
  userId,
   62, // Assuming 61 is the notification setting ID
   'User modifies notification settings',
   'Notification settings updated successfully',
   '10',
 ''
 );

    } else {
      toast.error("Failed to update notification status.");
    }
  } catch (error) {
    console.error("Error updating notification status:", error);
    toast.error("An error occurred while updating the notification status.");
  }
};


  // Render notifications grouped by category
  return (
    <Fragment>
     <Container>
         <Toolbar>
            <ToolbarHeading>
              <h1 className="text-xl font-medium leading-none text-gray-900">Notification Settings</h1>
              <p className="mt-1 text-sm text-gray-600">
              Effortless organization for streamlined operations.
            </p>
            </ToolbarHeading>
          </Toolbar>
     
    <div className="notifications-container" id="notification">
      {loading ? (
        <p>Loading...</p>
      ) : (
        Object.entries(groupedNotifications).map(([category, categoryNotifications]) => (
          <div key={category} className="category-group mb-5">
            <h3 className="category-title font-bold text-lg text-gray-900 mb-3">
              {category}
            </h3>
            {categoryNotifications.map((notification) => (
              <div
                key={notification.settingID}
                className="card-group flex items-center justify-between py-4 gap-2.5"
              >
                <div className="flex items-center gap-3.5">
                  
                  <div className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-1.5 leading-none font-medium text-sm text-gray-900">
                      {notification.notificationName}
                    </span>
                    <span className="text-2sm text-gray-700">
                      {notification.notificationDescription}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-2.5">
                    <div className="switch switch-sm">
                      <input
                        type="checkbox"
                        checked={notification.notificationStatus === true}
                        onChange={() =>
                          handleStatusChange(
                            notification.settingID,
                            !notification.notificationStatus
                          )
                        }
                      />
                    </div>
                    <label>Notification Status</label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
     </Container>
    </Fragment>
  );
};

export default Notifications;


