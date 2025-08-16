import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Shield, Edit3, Save, X } from 'lucide-react';
import { authService } from '../../services/authService';
import AadhaarVerification from '../auth/AadhaarVerification';
import type { UserProfile } from '../../lib/supabase';

interface ProfileTabProps {
  userProfile: UserProfile | null;
  onProfileUpdate: (profile: UserProfile) => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ userProfile, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAadhaarVerification, setShowAadhaarVerification] = useState(false);
  const [editData, setEditData] = useState(userProfile || {} as UserProfile);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    setEditData(userProfile || {} as UserProfile);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!userProfile) return;

    setIsLoading(true);
    try {
      const updatedProfile = await authService.updateProfile(userProfile.id, {
        full_name: editData.full_name,
        bio: editData.bio,
        hobbies: editData.hobbies,
        interests: editData.interests,
        profession: editData.profession,
        education: editData.education,
        location_city: editData.location_city,
        location_state: editData.location_state,
      });
      
      onProfileUpdate(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Update profile error:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData(userProfile || {} as UserProfile);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleArrayChange = (field: 'hobbies' | 'interests', value: string) => {
    const currentArray = editData[field] || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    setEditData({
      ...editData,
      [field]: newArray,
    });
  };

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

  if (!userProfile) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="font-poppins text-gray-600">Profile not found</p>
        </div>
      </div>
    );
  }

  if (showAadhaarVerification) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <AadhaarVerification
          userId={userProfile.id}
          onSuccess={() => {
            setShowAadhaarVerification(false);
            // Refresh profile data
            window.location.reload();
          }}
          onSkip={() => setShowAadhaarVerification(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-primary to-secondary">
          <div className="absolute inset-0 bg-black/20" />
        </div>
        
        <div className="relative px-6 pb-6">
          <div className="flex items-end space-x-6 -mt-16">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
                <div className="w-full h-full bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                  {userProfile.profile_photos.length > 0 ? (
                    <img
                      src={userProfile.profile_photos[0]}
                      alt={userProfile.full_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="font-playfair text-4xl font-bold text-white">
                      {userProfile.full_name.charAt(0)}
                    </span>
                  )}
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-gray-50 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 pt-4">
              <div className="flex items-center justify-between mb-2">
                <h1 className="font-playfair text-3xl font-bold text-gray-800">
                  {userProfile.full_name}
                </h1>
                
                <div className="flex items-center space-x-2">
                  {!userProfile.aadhaar_verified && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAadhaarVerification(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg font-poppins text-sm font-medium hover:bg-green-600 transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Verify Aadhaar</span>
                    </motion.button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={isEditing ? handleCancel : handleEdit}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-poppins text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                    <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                  </motion.button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-gray-600 mb-4">
                <span className="font-poppins text-sm">
                  {userProfile.profession} • {userProfile.location_city}, {userProfile.location_state}
                </span>
                
                {userProfile.aadhaar_verified && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <Shield className="w-4 h-4" />
                    <span className="font-poppins text-sm font-medium">Verified</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div>
            <h3 className="font-playfair text-xl font-bold text-gray-800 mb-4">
              Basic Information
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-poppins text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <p className="font-poppins text-gray-800 capitalize">
                    {userProfile.gender}
                  </p>
                </div>
                
                <div>
                  <label className="block font-poppins text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <p className="font-poppins text-gray-800">
                    {userProfile.date_of_birth ? 
                      new Date(userProfile.date_of_birth).toLocaleDateString('en-IN') : 
                      'Not provided'
                    }
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-poppins text-sm font-medium text-gray-700 mb-1">
                    Religion
                  </label>
                  <p className="font-poppins text-gray-800">
                    {userProfile.religion || 'Not specified'}
                  </p>
                </div>
                
                <div>
                  <label className="block font-poppins text-sm font-medium text-gray-700 mb-1">
                    Caste
                  </label>
                  <p className="font-poppins text-gray-800">
                    {userProfile.caste || 'Not specified'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-poppins text-sm font-medium text-gray-700 mb-1">
                  Education
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="education"
                    value={editData.education || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
                  />
                ) : (
                  <p className="font-poppins text-gray-800">
                    {userProfile.education || 'Not specified'}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-poppins text-sm font-medium text-gray-700 mb-1">
                  Profession
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="profession"
                    value={editData.profession || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
                  />
                ) : (
                  <p className="font-poppins text-gray-800">
                    {userProfile.profession || 'Not specified'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div>
            <h3 className="font-playfair text-xl font-bold text-gray-800 mb-4">
              Personal Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block font-poppins text-sm font-medium text-gray-700 mb-1">
                  About Me
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={editData.bio || ''}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins resize-none"
                    placeholder="Tell others about yourself..."
                  />
                ) : (
                  <p className="font-poppins text-gray-800 leading-relaxed">
                    {userProfile.bio || 'No bio added yet.'}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                  Hobbies
                </label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {hobbiesOptions.map((hobby) => (
                      <label
                        key={hobby}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={editData.hobbies?.includes(hobby) || false}
                          onChange={() => handleArrayChange('hobbies', hobby)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="font-poppins text-sm text-gray-700">{hobby}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {userProfile.hobbies.length > 0 ? (
                      userProfile.hobbies.map((hobby, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full font-poppins text-sm"
                        >
                          {hobby}
                        </span>
                      ))
                    ) : (
                      <p className="font-poppins text-gray-500 text-sm">No hobbies added</p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                  Interests
                </label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {interestsOptions.map((interest) => (
                      <label
                        key={interest}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={editData.interests?.includes(interest) || false}
                          onChange={() => handleArrayChange('interests', interest)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="font-poppins text-sm text-gray-700">{interest}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {userProfile.interests.length > 0 ? (
                      userProfile.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-secondary/10 text-secondary-dark rounded-full font-poppins text-sm"
                        >
                          {interest}
                        </span>
                      ))
                    ) : (
                      <p className="font-poppins text-gray-500 text-sm">No interests added</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Save/Cancel Buttons */}
        {isEditing && (
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-poppins font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-poppins font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* Verification Status */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="font-playfair text-xl font-bold text-gray-800 mb-4">
          Verification Status
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className={`w-6 h-6 ${userProfile.aadhaar_verified ? 'text-green-600' : 'text-gray-400'}`} />
              <div>
                <h4 className="font-poppins font-semibold text-gray-800">
                  Aadhaar Verification
                </h4>
                <p className="font-poppins text-sm text-gray-600">
                  Verify your identity for enhanced security
                </p>
              </div>
            </div>
            
            {userProfile.aadhaar_verified ? (
              <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full font-poppins text-sm font-semibold">
                Verified ✓
              </span>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAadhaarVerification(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg font-poppins text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Verify Now
              </motion.button>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <User className={`w-6 h-6 ${userProfile.phone_verified ? 'text-green-600' : 'text-gray-400'}`} />
              <div>
                <h4 className="font-poppins font-semibold text-gray-800">
                  Phone Verification
                </h4>
                <p className="font-poppins text-sm text-gray-600">
                  {userProfile.phone_number}
                </p>
              </div>
            </div>
            
            <span className={`px-3 py-1 rounded-full font-poppins text-sm font-semibold ${
              userProfile.phone_verified 
                ? 'bg-green-100 text-green-600' 
                : 'bg-yellow-100 text-yellow-600'
            }`}>
              {userProfile.phone_verified ? 'Verified ✓' : 'Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Account Statistics */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="font-playfair text-xl font-bold text-gray-800 mb-4">
          Account Statistics
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-primary/5 rounded-lg">
            <div className="font-playfair text-2xl font-bold text-primary mb-1">
              0
            </div>
            <div className="font-poppins text-sm text-gray-600">
              Profile Views
            </div>
          </div>
          
          <div className="text-center p-4 bg-secondary/5 rounded-lg">
            <div className="font-playfair text-2xl font-bold text-secondary-dark mb-1">
              0
            </div>
            <div className="font-poppins text-sm text-gray-600">
              Matches
            </div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="font-playfair text-2xl font-bold text-green-600 mb-1">
              0
            </div>
            <div className="font-poppins text-sm text-gray-600">
              Conversations
            </div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="font-playfair text-2xl font-bold text-blue-600 mb-1">
              0
            </div>
            <div className="font-poppins text-sm text-gray-600">
              Events Created
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;