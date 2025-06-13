import { Notification } from "./api";
import apiClient from "./data_config";

// api/notifications, GET} route +1ms
// [Nest] 15168  - 06/11/2025, 5:52:22 PM     LOG [RouterExplorer] Mapped {/api/notifications/unread-count, GET} route +0ms
// [Nest] 15168  - 06/11/2025, 5:52:22 PM     LOG [RouterExplorer] Mapped {/api/notifications/:id/mark-as-read, POST} route +1ms
// [Nest] 15168  - 06/11/2025, 5:52:22 PM     LOG [RouterExplorer] Mapped {/api/notifications/mark-all-as-read,
class NotificationService {
  async getNotifications() {
    try {
      const response = await apiClient.get(`${Notification}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  async getUnreadCount() {
    try {
      const response = await apiClient.get(`${Notification}/unread-count`);
      return response.data;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      throw error;
    }
  }

  async markAsRead(notificationId) {
    try {
      const response = await apiClient.post(
        `${Notification}/${notificationId}/mark-as-read`
      );
      return response.data;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  async markAllAsRead() {
    try {
      const response = await apiClient.post(`${Notification}/mark-all-as-read`);
      return response.data;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
