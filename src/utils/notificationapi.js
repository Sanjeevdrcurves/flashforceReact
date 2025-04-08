// utils/api.js

import axios from 'axios';

const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL; // Ensure this is the correct URL

export const sendNotification = async (userId, notificationSettingID, title, message,triggerEvent,name, notificationType = 'Info') => {
  try {
    const payload = {
      userID: userId,
      notificationSettingID: notificationSettingID,
      title: title,
      message: message,
      notificationType: notificationType,
      status: 'Active',
      createdDate: new Date().toISOString(),
      readDate: new Date().toISOString(),
      archivedDate: new Date().toISOString(),
      createdBy: userId,
      triggerEvent:triggerEvent,
      name:name
    };

    const response = await axios.post(`${API_URL}/Notification/InsertNotification`, payload);
    console.log('Notification sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw new Error('Failed to send notification');
  }
};
