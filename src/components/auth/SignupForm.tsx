import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, Calendar, MapPin, Heart, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../services/authService';
import type { SignUpData } from '../../services/authService';

interface SignupFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SignUpData>({
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: 'male',
    religion: '',
    caste: '',
    education: '',
    profession: '',
    locationCity: '',
    locationState: '',
    hobbies: [],
    interests: [],
    bio: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const hobbiesOptions = [
    'Reading', 'Cooking', 'Dancing', 'Singing', 'Traveling', 'Photography',
    'Painting', 'Gardening', 'Yoga', 'Meditation', 'Sports', 'Music',
    'Movies', 'Writing', 'Crafts', 'Fitness'
  ];

  const interestsOptions = [
    'Classical Music', 'Bollywood', 'Spirituality', 'Technology', 'Fashion',
    'Food', 'Adventure', 'Art', 'Literature', 'Science', 'Business',
    'Social Work', 'Environment', 'History', 'Culture', 'Family'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.signUp(formData);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleArrayChange = (field: 'hobbies' | 'interests', value: string) => {
    const currentArray = formData[field];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="font-playfair text-2xl font-bold text-gray-800 text-center mb-6">
        Basic Information
      </h3>

      {/* Full Name */}
      <div>
        <label className="block font-poppins font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
            placeholder="Enter your full name"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block font-poppins font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
            placeholder="Enter your email"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block font-poppins font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
            placeholder="Create a strong password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Phone Number */}
      <div>
        <label className="block font-poppins font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
            placeholder="+91 98765 43210"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="font-playfair text-2xl font-bold text-gray-800 text-center mb-6">
        Personal Details
      </h3>

      {/* Date of Birth */}
      <div>
        <label className="block font-poppins font-medium text-gray-700 mb-2">
          Date of Birth
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
          />
        </div>
      </div>

      {/* Gender */}
      <div>
        <label className="block font-poppins font-medium text-gray-700 mb-2">
          Gender
        </label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Religion */}
      <div>
        <label className="block font-poppins font-medium text-gray-700 mb-2">
          Religion
        </label>
        <select
          name="religion"
          value={formData.religion}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
        >
          <option value="">Select Religion</option>
          <option value="Hindu">Hindu</option>
          <option value="Muslim">Muslim</option>
          <option value="Christian">Christian</option>
          <option value="Sikh">Sikh</option>
          <option value="Buddhist">Buddhist</option>
          <option value="Jain">Jain</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Location */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-poppins font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            name="locationCity"
            value={formData.locationCity}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
            placeholder="Mumbai"
          />
        </div>
        <div>
          <label className="block font-poppins font-medium text-gray-700 mb-2">
            State
          </label>
          <input
            type="text"
            name="locationState"
            value={formData.locationState}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
            placeholder="Maharashtra"
          />
        </div>
      </div>

      {/* Education & Profession */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-poppins font-medium text-gray-700 mb-2">
            Education
          </label>
          <input
            type="text"
            name="education"
            value={formData.education}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
            placeholder="B.Tech"
          />
        </div>
        <div>
          <label className="block font-poppins font-medium text-gray-700 mb-2">
            Profession
          </label>
          <input
            type="text"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
            placeholder="Software Engineer"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="font-playfair text-2xl font-bold text-gray-800 text-center mb-6">
        Interests & Preferences
      </h3>

      {/* Hobbies */}
      <div>
        <label className="block font-poppins font-medium text-gray-700 mb-3">
          Hobbies (Select multiple)
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
          {hobbiesOptions.map((hobby) => (
            <label
              key={hobby}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={formData.hobbies.includes(hobby)}
                onChange={() => handleArrayChange('hobbies', hobby)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="font-poppins text-sm text-gray-700">{hobby}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div>
        <label className="block font-poppins font-medium text-gray-700 mb-3">
          Interests (Select multiple)
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
          {interestsOptions.map((interest) => (
            <label
              key={interest}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={formData.interests.includes(interest)}
                onChange={() => handleArrayChange('interests', interest)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="font-poppins text-sm text-gray-700">{interest}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block font-poppins font-medium text-gray-700 mb-2">
          About Yourself (Optional)
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins resize-none"
          placeholder="Tell us about yourself, your values, and what you're looking for..."
        />
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-2">
            Join Vivah Bandhan
          </h2>
          <p className="font-poppins text-gray-600">
            Create your profile to find your perfect match
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-poppins font-semibold text-sm ${
                  step <= currentStep
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-12 h-1 mx-2 ${
                    step < currentStep ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 font-poppins text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <motion.button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-poppins font-medium hover:bg-gray-50 transition-colors"
              >
                Previous
              </motion.button>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-poppins font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                currentStep === 1 ? 'ml-auto' : ''
              }`}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : currentStep === 3 ? (
                'Create Account'
              ) : (
                'Next'
              )}
            </motion.button>
          </div>
        </form>

        {/* Switch to Login */}
        <div className="mt-8 text-center">
          <p className="font-poppins text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-primary hover:text-primary-dark font-semibold transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SignupForm;