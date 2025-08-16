import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Calendar, Bell, User, Settings, LogOut } from 'lucide-react';
import { authService } from '../../services/authService';
import { notificationService } from '../../services/notificationService';
import MatchesTab from './MatchesTab';
import ChatTab from './ChatTab';
import EventsTab from './EventsTab';
import ProfileTab from './ProfileTab';
import NotificationsTab from './NotificationsTab';
import type { UserProfile } from '../../lib/supabase';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('matches');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const tabs = [
    { id: 'matches', name: 'Matches', icon: Heart },
    { id: 'chat', name: 'Chat', icon: MessageCircle },
    { id: 'events', name: 'Events', icon: Calendar },
    { id: 'notifications', name: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'profile', name: 'Profile', icon: User },
  ];

  useEffect(() => {
    loadUserData();
    loadUnreadCount();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        const profile = await authService.getUserProfile(user.id);
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Load user data error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        const count = await notificationService.getUnreadCount(user.id);
        setUnreadCount(count);
      }
    } catch (error) {
      console.error('Load unread count error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      window.location.reload();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="font-poppins text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-playfair text-xl font-bold text-primary">
                  Vivah Bandhan
                </h1>
                <p className="text-xs text-gray-600 font-poppins">
                  Dashboard
                </p>
              </div>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-poppins font-semibold text-gray-800">
                  {userProfile?.full_name}
                </p>
                <p className="font-poppins text-sm text-gray-600">
                  {userProfile?.aadhaar_verified ? (
                    <span className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    'Unverified'
                  )}
                </p>
              </div>
              
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-poppins font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-primary to-primary-dark text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                    {tab.badge && tab.badge > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {tab.badge > 99 ? '99+' : tab.badge}
                      </span>
                    )}
                  </motion.button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'matches' && <MatchesTab userProfile={userProfile} />}
              {activeTab === 'chat' && <ChatTab userProfile={userProfile} />}
              {activeTab === 'events' && <EventsTab userProfile={userProfile} />}
              {activeTab === 'notifications' && <NotificationsTab userProfile={userProfile} onUnreadCountChange={setUnreadCount} />}
              {activeTab === 'profile' && <ProfileTab userProfile={userProfile} onProfileUpdate={setUserProfile} />}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;