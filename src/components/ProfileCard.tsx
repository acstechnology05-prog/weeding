import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Briefcase, GraduationCap, Eye } from 'lucide-react';

interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  profession: string;
  education: string;
  image: string;
  interests: string[];
}

interface ProfileCardProps {
  profile: Profile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      className="relative w-full h-96 perspective-1000"
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsFlipped(true)}
      onHoverEnd={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative w-full h-full preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Front of Card */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-lg">
          <img
            src={profile.image}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          
          {/* Like Button */}
          <motion.button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-md"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
          >
            <Heart
              className={`w-5 h-5 ${
                isLiked ? 'text-primary fill-primary' : 'text-white'
              } transition-colors`}
            />
          </motion.button>

          {/* Basic Info */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="font-playfair text-2xl font-bold mb-1">
              {profile.name}, {profile.age}
            </h3>
            <div className="flex items-center space-x-1 text-white/90">
              <MapPin className="w-4 h-4" />
              <span className="font-poppins text-sm">{profile.location}</span>
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-gradient-to-br from-white to-accent/10 shadow-lg border border-gray-100 p-6 flex flex-col justify-between rotate-y-180">
          <div>
            <h3 className="font-playfair text-2xl font-bold text-gray-800 mb-4">
              {profile.name}
            </h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2 text-gray-600">
                <Briefcase className="w-4 h-4 text-primary" />
                <span className="font-poppins text-sm">{profile.profession}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-600">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span className="font-poppins text-sm">{profile.education}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-poppins text-sm">{profile.location}</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-poppins font-semibold text-gray-800 mb-2">Interests</h4>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-poppins"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center space-x-2 w-full py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full font-poppins font-semibold hover:shadow-lg transition-all"
          >
            <Eye className="w-4 h-4" />
            <span>View Profile</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Match Notification */}
      {isLiked && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-pulse-glow z-10"
        >
          <Heart className="w-4 h-4 text-white fill-white" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProfileCard;