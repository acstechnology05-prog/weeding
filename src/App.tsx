import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from './hooks/useAuth';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import MatchmakingSection from './components/MatchmakingSection';
import WeddingSection from './components/WeddingSection';
import CulturalSection from './components/CulturalSection';
import SuccessStories from './components/SuccessStories';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Dashboard from './components/dashboard/Dashboard';
import AuthModal from './components/auth/AuthModal';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { user, userProfile, isLoading, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Show dashboard for authenticated users
  if (isAuthenticated && userProfile) {
    return <Dashboard />;
  }

  // Show landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-white">
      <Header 
        onLoginClick={() => {
          setAuthMode('login');
          setShowAuthModal(true);
        }}
        onSignupClick={() => {
          setAuthMode('signup');
          setShowAuthModal(true);
        }}
      />
      
      <main>
        <HeroSection 
          onFindMatchClick={() => {
            setAuthMode('signup');
            setShowAuthModal(true);
          }}
          onExploreWeddingsClick={() => {
            setAuthMode('signup');
            setShowAuthModal(true);
          }}
        />
        <StatsSection />
        <MatchmakingSection />
        <WeddingSection />
        <CulturalSection />
        <SuccessStories />
      </main>
      
      <Footer />
      <Chatbot />
      
      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          window.location.reload(); // Refresh to load dashboard
        }}
        initialMode={authMode}
      />
    </div>
  );
}

export default App;
