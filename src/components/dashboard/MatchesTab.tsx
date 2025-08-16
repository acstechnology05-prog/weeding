import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, X, Filter, Sparkles, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { matchingService } from '../../services/matchingService';
import type { UserProfile, UserMatch } from '../../lib/supabase';

interface MatchesTabProps {
  userProfile: UserProfile | null;
}

const MatchesTab: React.FC<MatchesTabProps> = ({ userProfile }) => {
  const [matches, setMatches] = useState<UserMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    ageRange: [21, 35] as [number, number],
    religion: '',
    education: '',
    profession: '',
    locationCity: '',
  });

  useEffect(() => {
    if (userProfile) {
      loadMatches();
    }
  }, [userProfile]);

  const loadMatches = async () => {
    if (!userProfile) return;
    
    try {
      setIsLoading(true);
      let matchData = await matchingService.getRecommendedMatches(userProfile.id);
      
      // If no matches exist, generate new ones
      if (matchData.length === 0) {
        matchData = await matchingService.generateMatches(userProfile.id);
      }
      
      setMatches(matchData);
    } catch (error) {
      console.error('Load matches error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (matchId: string, matchedUserId: string) => {
    if (!userProfile) return;

    try {
      const result = await matchingService.likeProfile(userProfile.id, matchedUserId);
      
      // Remove from current matches
      setMatches(prev => prev.filter(m => m.matched_user_id !== matchedUserId));
      
      if (result.mutual) {
        // Show mutual match celebration
        alert('🎉 It\'s a mutual match! You can now start chatting.');
      }
    } catch (error) {
      console.error('Like profile error:', error);
    }
  };

  const handleDislike = async (matchId: string, matchedUserId: string) => {
    if (!userProfile) return;

    try {
      await matchingService.dislikeProfile(userProfile.id, matchedUserId);
      setMatches(prev => prev.filter(m => m.matched_user_id !== matchedUserId));
    } catch (error) {
      console.error('Dislike profile error:', error);
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="font-poppins text-gray-600">Finding your perfect matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-2">
              Your Matches
            </h2>
            <p className="font-poppins text-gray-600">
              {matches.length} compatible profiles found
            </p>
          </div>
          
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-primary text-primary rounded-lg font-poppins font-medium hover:bg-primary hover:text-white transition-all"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadMatches}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-poppins font-medium hover:shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Refresh</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="font-playfair text-xl font-bold text-gray-800 mb-4">
            Filter Preferences
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.religion}
              onChange={(e) => setFilters({ ...filters, religion: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
            >
              <option value="">All Religions</option>
              <option value="Hindu">Hindu</option>
              <option value="Muslim">Muslim</option>
              <option value="Christian">Christian</option>
              <option value="Sikh">Sikh</option>
            </select>
            
            <select
              value={filters.education}
              onChange={(e) => setFilters({ ...filters, education: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
            >
              <option value="">All Education</option>
              <option value="High School">High School</option>
              <option value="Bachelor's">Bachelor's</option>
              <option value="Master's">Master's</option>
              <option value="PhD">PhD</option>
            </select>
            
            <input
              type="text"
              placeholder="City"
              value={filters.locationCity}
              onChange={(e) => setFilters({ ...filters, locationCity: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
            />
          </div>
        </motion.div>
      )}

      {/* Matches Grid */}
      {matches.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="font-playfair text-2xl font-bold text-gray-800 mb-2">
            No Matches Yet
          </h3>
          <p className="font-poppins text-gray-600 mb-6">
            We're working on finding your perfect matches. Check back soon!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadMatches}
            className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-poppins font-semibold"
          >
            Generate New Matches
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Profile Image */}
              <div className="relative h-64">
                <img
                  src={match.matched_user?.profile_photos[0] || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop'}
                  alt={match.matched_user?.full_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Compatibility Score */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="font-poppins font-bold text-primary">
                    {match.compatibility_score}% Match
                  </span>
                </div>

                {/* Basic Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-playfair text-xl font-bold mb-1">
                    {match.matched_user?.full_name}
                    {match.matched_user?.date_of_birth && (
                      <span className="text-lg font-normal">
                        , {calculateAge(match.matched_user.date_of_birth)}
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center space-x-1 text-white/90 text-sm">
                    <MapPin className="w-3 h-3" />
                    <span className="font-poppins">
                      {match.matched_user?.location_city}, {match.matched_user?.location_state}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  {match.matched_user?.profession && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Briefcase className="w-4 h-4 text-primary" />
                      <span className="font-poppins text-sm">{match.matched_user.profession}</span>
                    </div>
                  )}
                  
                  {match.matched_user?.education && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      <span className="font-poppins text-sm">{match.matched_user.education}</span>
                    </div>
                  )}
                </div>

                {/* Common Interests */}
                {match.match_factors?.common_interests?.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-poppins font-semibold text-gray-800 mb-2">
                      Common Interests
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {match.match_factors.common_interests.slice(0, 3).map((interest: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-poppins"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDislike(match.id, match.matched_user_id)}
                    className="flex-1 flex items-center justify-center space-x-2 py-3 border border-gray-300 text-gray-600 rounded-lg font-poppins font-medium hover:bg-gray-50 transition-all"
                  >
                    <X className="w-4 h-4" />
                    <span>Pass</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLike(match.id, match.matched_user_id)}
                    className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-poppins font-medium hover:shadow-lg transition-all"
                  >
                    <Heart className="w-4 h-4" />
                    <span>Like</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchesTab;