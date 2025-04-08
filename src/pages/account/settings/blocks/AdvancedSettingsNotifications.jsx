// import { KeenIcon } from '@/components';
// import { toAbsoluteUrl } from '@/utils/Assets';
// import { CommonHexagonBadge } from '@/partials/common';
// const AdvancedSettingsNotifications = () => {
//   const items = [{
//     title: 'Email',
//     description: 'Tailor Your Email Preferences.',
//     badge: <KeenIcon icon="sms" className="text-xl text-gray-500" />
//   }];
//   const renderItem = (item, index) => {
//     return <div key={index} className="flex items-center justify-between flex-wrap grow border border-gray-200 rounded-xl gap-2 px-3.5 py-2.5">
//         <div className="flex items-center flex-wrap gap-3.5">
//           <CommonHexagonBadge stroke="stroke-gray-300" fill="fill-gray-100" size="size-[50px]" badge={item.badge} />

//           <div className="flex flex-col">
//             <a href="#" className="text-sm font-medium text-gray-900 hover:text-primary-active mb-px">
//               {item.title}
//             </a>
//             <span className="text-2sm text-gray-700">{item.description}</span>
//           </div>
//         </div>

//         <label className="switch switch-sm">
//           <input type="checkbox" defaultChecked value="1" readOnly />
//         </label>
//       </div>;
//   };
//   return <div className="card">
//       <div className="card-header" id="advanced_settings_notifications">
//         <h3 className="card-title">Notifications</h3>
//       </div>
//       <div className="card-body lg:py-7.5">
//         <div className="flex flex-wrap items-center gap-5 mb-5 lg:mb-7">
//           {items.map((item, index) => {
//           return renderItem(item, index);
//         })}
//         </div>

//         <div className="flex flex-col gap-3.5 mb-7">
//           <span className="text-md font-medium text-gray-900 pb-0.5">Desktop notifications</span>

//           <div className="flex flex-col items-start gap-4">
//             <label className="radio-group">
//               <input className="radio" name="desktop_notification" type="radio" value="1" readOnly />
//               <span className="radio-label radio-label-sm">All new messages (Recommended)</span>
//             </label>
//             <label className="radio-group">
//               <input className="radio" name="desktop_notification" type="radio" value="2" readOnly />
//               <span className="radio-label radio-label-sm">Direct @mentions</span>
//             </label>
//             <label className="radio-group">
//               <input className="radio" name="desktop_notification" type="radio" value="3" readOnly />
//               <span className="radio-label radio-label-sm">Disabled</span>
//             </label>
//           </div>
//         </div>

//         <div className="flex flex-col gap-3.5 mb-7">
//           <span className="text-md font-medium text-gray-900 pb-0.5">Email notifications</span>

//           <div className="flex flex-col items-start gap-4">
//             <label className="radio-group">
//               <input className="radio" name="email_notification" type="radio" value="1" readOnly />
//               <span className="radio-label radio-label-sm">All new messages and statuses</span>
//             </label>
//             <label className="radio-group">
//               <input className="radio" name="email_notification" type="radio" value="2" readOnly />
//               <span className="radio-label radio-label-sm text-gray-800 font-medium">
//                 AUnread messages and statuses
//               </span>
//             </label>
//             <label className="radio-group">
//               <input className="radio" name="email_notification" type="radio" value="3" readOnly />
//               <span className="radio-label radio-label-sm">Disabled</span>
//             </label>
//           </div>
//         </div>

//         <div className="flex flex-col gap-3.5">
//           <span className="text-md font-medium text-gray-900 pb-0.5">Subscriptions</span>

//           <label className="checkbox-group">
//             <input className="checkbox" name="check" type="checkbox" value="1" readOnly />
//             <span className="checkbox-label checkbox-label-sm">
//               Automatically subscribe to tasks you create
//             </span>
//           </label>
//         </div>

//         <div className="flex justify-end">
//           <button className="btn btn-primary">Save Changes</button>
//         </div>
//       </div>
//     </div>;
// };
// export { AdvancedSettingsNotifications };

import React, { useEffect, useState } from "react";
import axios from "axios";
import { CardNotification } from "@/partials/cards";
import { useSelector } from "react-redux";

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const AdvancedSettingsNotifications = () => {
  const user = useSelector((state) => state.AuthReducerKey);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.userId) return;

    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${API_URL}/NotificationSettings/GetAllNotificationSettings/${user.userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        const filteredNotifications = response.data.filter(
          (notification) => notification.notificationCategory != "Uncategorized"
        );
        setNotifications(filteredNotifications);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user?.userId]);
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
      await axios.put(
        `${API_URL}/NotificationSettings/UpdateNotificationSetting`,
        {
          settingID: settingID,
          notificationStatus: Boolean(newStatus),
          userID:user.userId
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  };
  const renderItem = (notification, index) => (
    <CardNotification
      key={`notification-${index}`}
      icon={notification.icon || "bell"}
      title={notification.notificationName}
      description={notification.notificationDescription}
      actions={
        <div className="switch switch-sm">
          <input
            type="checkbox"
            checked={notification.notificationStatus === true}
            onChange={() =>
              handleStatusChange(
                notification.settingID,
                !notification.notificationStatus
              )}
          />
        </div>
      }
    />
  );

  return (
    <div className="card mt-6">
      <div className="card-header gap-2">
        <h3 className="card-title"> Notifications</h3>
        {/* <div className="flex items-center gap-2">
          <label className="switch">
            <input className="order-2" type="checkbox" value="1" name="check" readOnly />
            <span className="switch-label order-1">Team-Wide Alerts</span>
          </label>
        </div> */}
      </div>

      <div id="notifications_cards">
        {loading ? (
          <p>Loading notifications...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : notifications.length > 0 ? (
          notifications.map((notification, index) => renderItem(notification, index))
        ) : (
          <p>No uncategorized notifications available.</p>
        )}
      </div>
    </div>
  );
};

export { AdvancedSettingsNotifications };
