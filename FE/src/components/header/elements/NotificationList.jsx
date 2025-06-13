import React, { useEffect, useState } from 'react';
import { notificationService } from '@/services/notification_service';
import './NotificationList.css';

const NotificationList = ({ isOpen, onClose, handleMarkAllAsRead }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  const clickMarkAllAsRead = async () => {
    try {
      handleMarkAllAsRead();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="notification-list">
      <div className="notification-header">
        <h3>Thông báo</h3>
        <div className="notification-actions">
          <button 
            onClick={() => clickMarkAllAsRead()} 
            className="mark-all-read"
            title="Đánh dấu đã đọc"
          >
            <i className="fas fa-check" />
          </button>
          <button onClick={onClose} className="close-btn">
            <i className="far fa-times" />
          </button>
        </div>
      </div>
      <div className="notification-items">
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : notifications.length === 0 ? (
          <div className="no-notifications">Không có thông báo mới</div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <div className="notification-content">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                <span className="notification-time">
                  {new Date(notification.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationList; 