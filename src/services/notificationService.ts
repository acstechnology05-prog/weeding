import { supabase } from '../lib/supabase';
import type { Notification } from '../lib/supabase';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

class NotificationService {
  private vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

  // Initialize push notifications
  async initializePushNotifications(): Promise<string | null> {
    try {
      // Request permission
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        console.log('Notification permission denied');
        return null;
      }

      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: this.vapidKey,
      });

      if (token) {
        console.log('FCM Token:', token);
        return token;
      } else {
        console.log('No registration token available');
        return null;
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  // Listen for foreground messages
  onForegroundMessage(callback: (payload: any) => void) {
    return onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      callback(payload);
      
      // Show browser notification
      if (payload.notification) {
        new Notification(payload.notification.title || 'Vivah Bandhan', {
          body: payload.notification.body,
          icon: '/vite.svg',
          badge: '/vite.svg',
        });
      }
    });
  }

  // Send push notification via backend
  async sendPushNotification(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, any>
  ): Promise<void> {
    try {
      // This would typically be handled by your backend
      // For now, we'll create a local notification
      await this.createNotification(userId, 'system', title, body, data);
      
      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon: '/vite.svg',
          badge: '/vite.svg',
        });
      }
    } catch (error) {
      console.error('Send push notification error:', error);
    }
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get user notifications error:', error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Mark notification as read error:', error);
      throw error;
    }
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Mark all notifications as read error:', error);
      throw error;
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Get unread count error:', error);
      return 0;
    }
  }

  async createNotification(
    userId: string,
    type: 'match' | 'message' | 'event' | 'admin' | 'system',
    title: string,
    message: string,
    data: Record<string, any> = {}
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message,
          data,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Create notification error:', error);
      throw error;
    }
  }

  // Real-time subscription for notifications
  subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    return supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as Notification);
        }
      )
      .subscribe();
  }
}

export const notificationService = new NotificationService();