import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Heart } from 'lucide-react';
import ProfileCard from './ProfileCard';

const MatchmakingSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    age: '',
    religion: '',
    location: '',
    profession: '',
  });

  const profiles = [
    {
      id: 1,
      name: 'Priya Sharma',
      age: 26,
      location: 'Mumbai, Maharashtra',
      profession: 'Software Engineer',
      education: 'B.Tech Computer Science',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      interests: ['Dancing', 'Cooking', 'Travel', 'Music'],
    },
    {
      id: 2,
      name: 'Arjun Patel',
      age: 29,
      location: 'Delhi, NCR',
      profession: 'Doctor',
      education: 'MBBS, MD',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      interests: ['Reading', 'Cricket', 'Photography', 'Yoga'],
    },
    {
      id: 3,
      name: 'Kavya Reddy',
      age: 24,
      location: 'Bangalore, Karnataka',
      profession: 'Marketing Manager',
      education: 'MBA Marketing',
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      interests: ['Art', 'Fitness', 'Movies', 'Gardening'],
    },
    {
      id: 4,
      name: 'Rohit Kumar',
      age: 31,
      location: 'Pune, Maharashtra',
      profession: 'Business Analyst',
      education: 'B.Com, CA',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      interests: ['Finance', 'Swimming', 'Chess', 'Cooking'],
    },
    {
      id: 5,
      name: 'Ananya Singh',
      age: 27,
      location: 'Chennai, Tamil Nadu',
      profession: 'Teacher',
      education: 'M.Ed English',
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      interests: ['Literature', 'Classical Music', 'Painting', 'Volunteering'],
    },
    {
      id: 6,
      name: 'Vikram Gupta',
      age: 28,
      location: 'Hyderabad, Telangana',
      profession: 'Architect',
      education: 'B.Arch',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      interests: ['Design', 'Travel', 'Photography', 'Hiking'],
    },
  ];

  return (
    <section id="matches" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
            Find Your Perfect Match
          </h2>
          <p className="font-poppins text-xl text-gray-600 max-w-2xl mx-auto">
            Discover compatible partners who share your values and dreams
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or profession..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
              />
            </div>

            {/* Age Filter */}
            <select
              value={filters.age}
              onChange={(e) => setFilters({ ...filters, age: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
            >
              <option value="">Age Range</option>
              <option value="20-25">20-25 years</option>
              <option value="26-30">26-30 years</option>
              <option value="31-35">31-35 years</option>
              <option value="36+">36+ years</option>
            </select>

            {/* Location Filter */}
            <select
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
            >
              <option value="">Location</option>
              <option value="mumbai">Mumbai</option>
              <option value="delhi">Delhi</option>
              <option value="bangalore">Bangalore</option>
              <option value="pune">Pune</option>
              <option value="chennai">Chennai</option>
              <option value="hyderabad">Hyderabad</option>
            </select>

            {/* Search Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-poppins font-semibold hover:shadow-lg transition-all"
            >
              <Filter className="w-4 h-4" />
              <span>Search</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {profiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <ProfileCard profile={profile} />
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 border-2 border-primary text-primary rounded-full font-poppins font-semibold hover:bg-primary hover:text-white transition-all"
          >
            Load More Profiles
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default MatchmakingSection;