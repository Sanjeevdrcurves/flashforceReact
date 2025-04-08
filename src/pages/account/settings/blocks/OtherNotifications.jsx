import React, { useEffect, useState } from "react";
import axios from "axios";
import { CardNotification } from "@/partials/cards";
import { useSelector } from "react-redux";

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const OtherNotifications = () => {
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
          (notification) => notification.notificationCategory === "Uncategorized"
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
        <h3 className="card-title">Other Notifications</h3>
        <div className="flex items-center gap-2">
          <label className="switch">
            <input className="order-2" type="checkbox" value="1" name="check" readOnly />
            <span className="switch-label order-1">Team-Wide Alerts</span>
          </label>
        </div>
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

export { OtherNotifications };
