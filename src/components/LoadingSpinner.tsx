import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center">
        {/* Mandala Spinner */}
        <motion.div
          className="w-20 h-20 mx-auto mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full text-primary"
            fill="currentColor"
          >
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
            <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="50" r="5" fill="currentColor" />
            
            {/* Petals */}
            {Array.from({ length: 8 }).map((_, i) => (
              <g key={i} transform={`rotate(${i * 45} 50 50)`}>
                <ellipse cx="50" cy="20" rx="3" ry="8" fill="currentColor" opacity="0.6" />
                <ellipse cx="50" cy="30" rx="2" ry="6" fill="currentColor" opacity="0.4" />
              </g>
            ))}
          </svg>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        >
          <h2 className="font-playfair text-2xl font-bold text-primary mb-2">
            Vivah Bandhan
          </h2>
          <p className="font-poppins text-gray-600">
            Preparing your perfect match...
          </p>
        </motion.div>

        {/* Floating Elements */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-accent rounded-full"
            animate={{
              y: [-10, -30, -10],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            style={{
              left: `${45 + i * 2}%`,
              top: `${60 + (i % 2) * 5}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;