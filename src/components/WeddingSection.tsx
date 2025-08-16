import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Filter } from 'lucide-react';
import WeddingCard from './WeddingCard';

const WeddingSection = () => {
  const weddingEvents = [
    {
      id: 1,
      title: 'Royal Rajasthani Wedding',
      date: 'March 15, 2024',
      time: '6:00 PM - 11:00 PM',
      venue: 'City Palace',
      location: 'Udaipur, Rajasthan',
      price: 15000,
      capacity: 200,
      booked: 150,
      image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      description: 'Experience the grandeur of a traditional Rajasthani wedding with royal ceremonies and authentic cultural performances.',
      ceremonies: ['Mehendi', 'Sangeet', 'Haldi', 'Wedding', 'Reception'],
    },
    {
      id: 2,
      title: 'South Indian Temple Wedding',
      date: 'March 22, 2024',
      time: '9:00 AM - 2:00 PM',
      venue: 'Meenakshi Temple',
      location: 'Madurai, Tamil Nadu',
      price: 12000,
      capacity: 300,
      booked: 180,
      image: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      description: 'Witness the sacred rituals of a traditional South Indian wedding in the divine ambiance of an ancient temple.',
      ceremonies: ['Ganesha Puja', 'Kanyadaan', 'Saptapadi', 'Mangalsutra'],
    },
    {
      id: 3,
      title: 'Punjabi Destination Wedding',
      date: 'April 5, 2024',
      time: '4:00 PM - 12:00 AM',
      venue: 'Heritage Resort',
      location: 'Goa',
      price: 20000,
      capacity: 150,
      booked: 120,
      image: 'https://images.pexels.com/photos/1729931/pexels-photo-1729931.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      description: 'Celebrate love with vibrant Punjabi traditions in a beautiful beachside destination wedding.',
      ceremonies: ['Jaggo', 'Chooda', 'Anand Karaj', 'Vidaai'],
    },
    {
      id: 4,
      title: 'Bengali Cultural Wedding',
      date: 'April 12, 2024',
      time: '7:00 AM - 1:00 PM',
      venue: 'Cultural Center',
      location: 'Kolkata, West Bengal',
      price: 10000,
      capacity: 250,
      booked: 200,
      image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      description: 'Immerse yourself in the rich cultural heritage of Bengal with traditional rituals and authentic cuisine.',
      ceremonies: ['Gaye Holud', 'Subho Drishti', 'Mala Badal', 'Sindoor Daan'],
    },
    {
      id: 5,
      title: 'Gujarati Garden Wedding',
      date: 'April 20, 2024',
      time: '5:00 PM - 11:00 PM',
      venue: 'Botanical Gardens',
      location: 'Ahmedabad, Gujarat',
      price: 8000,
      capacity: 180,
      booked: 100,
      image: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      description: 'Celebrate amidst nature with traditional Gujarati customs in a beautiful garden setting.',
      ceremonies: ['Pithi', 'Garba', 'Phere', 'Vidaai'],
    },
    {
      id: 6,
      title: 'Maharashtrian Traditional Wedding',
      date: 'May 3, 2024',
      time: '8:00 AM - 3:00 PM',
      venue: 'Heritage Hall',
      location: 'Pune, Maharashtra',
      price: 11000,
      capacity: 220,
      booked: 160,
      image: 'https://images.pexels.com/photos/1729931/pexels-photo-1729931.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      description: 'Experience the warmth of Maharashtrian traditions with authentic rituals and delicious cuisine.',
      ceremonies: ['Haldi', 'Antarpat', 'Saptapadi', 'Mangalashtak'],
    },
  ];

  return (
    <section id="weddings" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
            Wedding Experiences
          </h2>
          <p className="font-poppins text-xl text-gray-600 max-w-2xl mx-auto">
            Immerse yourself in authentic Indian wedding traditions from different cultures
          </p>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-50 rounded-2xl p-6 mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins">
              <option value="">All Regions</option>
              <option value="north">North India</option>
              <option value="south">South India</option>
              <option value="west">West India</option>
              <option value="east">East India</option>
            </select>
            
            <select className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins">
              <option value="">Price Range</option>
              <option value="0-10000">₹0 - ₹10,000</option>
              <option value="10000-15000">₹10,000 - ₹15,000</option>
              <option value="15000-20000">₹15,000 - ₹20,000</option>
              <option value="20000+">₹20,000+</option>
            </select>
            
            <select className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins">
              <option value="">Date</option>
              <option value="march">March 2024</option>
              <option value="april">April 2024</option>
              <option value="may">May 2024</option>
            </select>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-poppins font-semibold hover:shadow-lg transition-all"
            >
              <Filter className="w-4 h-4" />
              <span>Filter Events</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Wedding Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {weddingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <WeddingCard event={event} />
            </motion.div>
          ))}
        </div>

        {/* Interactive Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-accent/10 to-secondary/10 rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <h3 className="font-playfair text-3xl font-bold text-gray-800 mb-4">
              Explore Wedding Locations
            </h3>
            <p className="font-poppins text-gray-600">
              Discover beautiful venues across India for your perfect wedding experience
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                <p className="font-poppins text-gray-600">Interactive Map Coming Soon</p>
                <p className="font-poppins text-sm text-gray-500 mt-2">
                  Click on pins to explore wedding venues and book tickets
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WeddingSection;