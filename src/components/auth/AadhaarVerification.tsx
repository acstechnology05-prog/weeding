import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService';

interface AadhaarVerificationProps {
  userId: string;
  onSuccess: () => void;
  onSkip: () => void;
}

const AadhaarVerification: React.FC<AadhaarVerificationProps> = ({ userId, onSuccess, onSkip }) => {
  const [step, setStep] = useState(1); // 1: Enter Aadhaar, 2: Enter OTP
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAadhaarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate Aadhaar number format
      if (!/^\d{12}$/.test(aadhaarNumber)) {
        throw new Error('Please enter a valid 12-digit Aadhaar number');
      }

      // Get user's phone number
      const userProfile = await authService.getUserProfile(userId);
      if (!userProfile?.phone_number) {
        throw new Error('Phone number not found. Please update your profile.');
      }

      // Send OTP to registered mobile number
      await authService.verifyAadhaar(aadhaarNumber, userProfile.phone_number);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Aadhaar verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!/^\d{6}$/.test(otp)) {
        throw new Error('Please enter a valid 6-digit OTP');
      }

      await authService.confirmAadhaarOTP(aadhaarNumber, otp, userId);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-2">
            Aadhaar Verification
          </h2>
          <p className="font-poppins text-gray-600">
            Verify your identity for a secure and trusted experience
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-poppins font-semibold text-blue-800 mb-1">
                Why Aadhaar Verification?
              </h4>
              <ul className="font-poppins text-sm text-blue-700 space-y-1">
                <li>• Ensures one account per person</li>
                <li>• Prevents fake profiles</li>
                <li>• Builds trust in our community</li>
                <li>• Your data is encrypted and secure</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 font-poppins text-sm flex items-center space-x-2"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Step 1: Enter Aadhaar Number */}
        {step === 1 && (
          <form onSubmit={handleAadhaarSubmit} className="space-y-6">
            <div>
              <label className="block font-poppins font-medium text-gray-700 mb-2">
                Aadhaar Number
              </label>
              <input
                type="text"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, '').substring(0, 12))}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins text-center text-lg tracking-wider"
                placeholder="XXXX XXXX XXXX"
                maxLength={12}
              />
              <p className="font-poppins text-xs text-gray-500 mt-2">
                Enter your 12-digit Aadhaar number
              </p>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading || aadhaarNumber.length !== 12}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-poppins font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                'Send OTP'
              )}
            </motion.button>
          </form>
        )}

        {/* Step 2: Enter OTP */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <Phone className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-playfair text-xl font-bold text-gray-800 mb-2">
                Enter OTP
              </h3>
              <p className="font-poppins text-gray-600 text-sm">
                We've sent a 6-digit OTP to your registered mobile number
              </p>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>

              <motion.button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-poppins font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying OTP...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Verify & Complete</span>
                  </div>
                )}
              </motion.button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-2 text-gray-600 font-poppins text-sm hover:text-gray-800 transition-colors"
              >
                Change Aadhaar Number
              </button>
            </form>
          </div>
        )}

        {/* Skip Option */}
        <div className="mt-8 text-center">
          <button
            onClick={onSkip}
            className="font-poppins text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Skip for now (You can verify later)
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AadhaarVerification;