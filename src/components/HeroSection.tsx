import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Search, Calendar } from 'lucide-react';

interface HeroSectionProps {
  onFindMatchClick: () => void;
  onExploreWeddingsClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onFindMatchClick, onExploreWeddingsClick }) => {
  const floatingElements = Array.from({ length: 8 }, (_, i) => i);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Indian Wedding"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50"></div>
      </div>

      {/* Floating Petals */}
      {floatingElements.map((i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-accent rounded-full opacity-70"
          animate={{
            y: [-20, -100, -20],
            x: [0, 30, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 6 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
          style={{
            left: `${10 + i * 10}%`,
            top: `${20 + (i % 3) * 20}%`,
          }}
        />
      ))}

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-8"
        >
          <motion.h1
            className="font-playfair text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            Vivah Bandhan
          </motion.h1>
          
          <motion.p
            className="font-poppins text-xl sm:text-2xl text-white/90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Where Matches Blossom & Traditions Unite
          </motion.p>

          <motion.p
            className="font-poppins text-lg text-white/80 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            Discover your perfect match and celebrate love with authentic Indian wedding experiences
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(233, 30, 99, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onFindMatchClick}
              className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full font-poppins font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Search className="w-5 h-5" />
              <span>Find Your Match</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExploreWeddingsClick}
              className="flex items-center space-x-2 px-8 py-4 bg-white/20 backdrop-blur-md text-white border-2 border-white/30 rounded-full font-poppins font-semibold text-lg hover:bg-white/30 transition-all"
            >
              <Calendar className="w-5 h-5" />
              <span>Explore Weddings</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;