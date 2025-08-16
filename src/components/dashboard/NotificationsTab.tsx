import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Heart, MessageCircle, Calendar, CheckCircle, Trash2 } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import type { UserProfile, Notification } from '../../lib/supabase';

interface NotificationsTabProps {
  userProfile: UserProfile | null;
  onUnreadCountChange: (count: number) => void;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({ userProfile, onUnreadCountChange }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userProfile) {
      loadNotifications();
      
      // Subscribe to real-time notifications
      const subscription = notificationService.subscribeToNotifications(
        userProfile.id,
        (newNotification) => {
          setNotifications(prev => [newNotification, ...prev]);
          updateUnreadCount();
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [userProfile]);

  const loadNotifications = async () => {
    if (!userProfile) return;

    try {
      const userNotifications = await notificationService.getUserNotifications(userProfile.id);
      setNotifications(userNotifications);
      updateUnreadCount();
    } catch (error) {
      console.error('Load notifications error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUnreadCount = async () => {
    if (!userProfile) return;
    
    try {
      const count = await notificationService.getUnreadCount(userProfile.id);
      onUnreadCountChange(count);
    } catch (error) {
      console.error('Update unread count error:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!userProfile) return;

    try {
      await notificationService.markNotificationAsRead(notificationId, userProfile.id);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
      updateUnreadCount();
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!userProfile) return;

    try {
      await notificationService.markAllNotificationsAsRead(userProfile.id);
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      updateUnreadCount();
    } catch (error) {
      console.error('Mark all as read error:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'match': return Heart;
      case 'message': return MessageCircle;
      case 'event': return Calendar;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'match': return 'text-primary bg-primary/10';
      case 'message': return 'text-blue-600 bg-blue-100';
      case 'event': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString('en-IN');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="font-poppins text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-2">
              Notifications
            </h2>
            <p className="font-poppins text-gray-600">
              {notifications.filter(n => !n.is_read).length} unread notifications
            </p>
          </div>
          
          {notifications.some(n => !n.is_read) && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={markAllAsRead}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-poppins font-medium hover:bg-primary-dark transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark All Read</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-playfair text-xl font-bold text-gray-800 mb-2">
              No Notifications
            </h3>
            <p className="font-poppins text-gray-600">
              You're all caught up! New notifications will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification, index) => {
              const IconComponent = getNotificationIcon(notification.type);
              
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.is_read ? 'bg-blue-50/50' : ''
                  }`}
                  onClick={() => !notification.is_read && markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-poppins font-semibold text-gray-800">
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className="font-poppins text-xs text-gray-500">
                            {formatTime(notification.created_at)}
                          </span>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                      </div>
                      
                      <p className="font-poppins text-gray-600 text-sm leading-relaxed">
                        {notification.message}
                      </p>
                      
                      {/* Action Buttons for specific notification types */}
                      {notification.type === 'match' && notification.data?.matched_user_id && (
                        <div className="mt-3">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-2 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-poppins text-sm font-medium hover:shadow-lg transition-all"
                          >
                            Start Chatting
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsTab;