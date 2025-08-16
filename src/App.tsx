import React from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import MatchmakingSection from './components/MatchmakingSection';
import WeddingSection from './components/WeddingSection';
import CulturalSection from './components/CulturalSection';
import SuccessStories from './components/SuccessStories';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <HeroSection />
        <StatsSection />
        <MatchmakingSection />
        <WeddingSection />
        <CulturalSection />
        <SuccessStories />
      </main>
      
      <Footer />
      <Chatbot />
    </div>
  );
}

export default App;
