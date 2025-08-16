import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import AadhaarVerification from './AadhaarVerification';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'aadhaar'>(initialMode);
  const [newUserId, setNewUserId] = useState<string | null>(null);

  const handleSignupSuccess = (userId?: string) => {
    if (userId) {
      setNewUserId(userId);
      setMode('aadhaar');
    } else {
      onSuccess();
    }
  };

  const handleAadhaarSuccess = () => {
    onSuccess();
  };

  const handleAadhaarSkip = () => {
    onSuccess();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            {mode === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <LoginForm
                  onSuccess={onSuccess}
                  onSwitchToSignup={() => setMode('signup')}
                />
              </motion.div>
            )}

            {mode === 'signup' && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <SignupForm
                  onSuccess={handleSignupSuccess}
                  onSwitchToLogin={() => setMode('login')}
                />
              </motion.div>
            )}

            {mode === 'aadhaar' && newUserId && (
              <motion.div
                key="aadhaar"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <AadhaarVerification
                  userId={newUserId}
                  onSuccess={handleAadhaarSuccess}
                  onSkip={handleAadhaarSkip}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;