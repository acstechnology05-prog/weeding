import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, IndianRupee, Clock } from 'lucide-react';

interface WeddingEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  price: number;
  capacity: number;
  booked: number;
  image: string;
  description: string;
  ceremonies: string[];
}

interface WeddingCardProps {
  event: WeddingEvent;
}

const WeddingCard: React.FC<WeddingCardProps> = ({ event }) => {
  const [isHovered, setIsHovered] = useState(false);

  const availableSpots = event.capacity - event.booked;
  const bookingPercentage = (event.booked / event.capacity) * 100;

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full font-poppins font-semibold text-sm">
          ₹{event.price.toLocaleString()}
        </div>

        {/* Booking Status */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between text-white mb-2">
            <span className="font-poppins text-sm">
              {availableSpots} spots left
            </span>
            <span className="font-poppins text-sm">
              {Math.round(bookingPercentage)}% booked
            </span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-2">
            <motion.div
              className="bg-secondary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${bookingPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-playfair text-2xl font-bold text-gray-800 mb-2">
          {event.title}
        </h3>
        
        <p className="font-poppins text-gray-600 mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="font-poppins text-sm">{event.date}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-poppins text-sm">{event.time}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="font-poppins text-sm">{event.venue}, {event.location}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="w-4 h-4 text-primary" />
            <span className="font-poppins text-sm">{event.booked}/{event.capacity} guests</span>
          </div>
        </div>

        {/* Ceremonies */}
        <div className="mb-6">
          <h4 className="font-poppins font-semibold text-gray-800 mb-2">Ceremonies</h4>
          <div className="flex flex-wrap gap-2">
            {event.ceremonies.map((ceremony, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-accent/20 text-primary text-xs rounded-full font-poppins"
              >
                {ceremony}
              </span>
            ))}
          </div>
        </div>

        {/* Book Now Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 rounded-full font-poppins font-semibold transition-all ${
            availableSpots > 0
              ? 'bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={availableSpots === 0}
        >
          {availableSpots > 0 ? (
            <span className="flex items-center justify-center space-x-2">
              <IndianRupee className="w-4 h-4" />
              <span>Book Now</span>
            </span>
          ) : (
            'Fully Booked'
          )}
        </motion.button>
      </div>

      {/* Hover Effect - Quick Book Button */}
      <motion.div
        className="absolute inset-0 bg-primary/95 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: isHovered ? 'auto' : 'none' }}
      >
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: isHovered ? 1 : 0.8, 
            opacity: isHovered ? 1 : 0 
          }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="px-8 py-4 bg-white text-primary rounded-full font-poppins font-bold text-lg hover:bg-gray-100 transition-colors"
        >
          Quick Book - ₹{event.price.toLocaleString()}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default WeddingCard;