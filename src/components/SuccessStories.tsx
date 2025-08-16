import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronLeft, ChevronRight, Quote, Calendar, MapPin } from 'lucide-react';

const SuccessStories = () => {
  const [currentStory, setCurrentStory] = useState(0);

  const stories = [
    {
      id: 1,
      names: 'Priya & Arjun',
      location: 'Mumbai, Maharashtra',
      weddingDate: 'December 2023',
      image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      story: "We met through Vivah Bandhan and instantly connected over our shared love for classical music and travel. What started as a simple conversation turned into the most beautiful journey of our lives. Our families loved each other from the first meeting!",
      quote: "Vivah Bandhan didn't just find us partners, they found us our soulmates. Every ritual, every moment was perfectly planned.",
      matchedIn: '3 weeks',
      ceremony: 'Traditional Maharashtrian Wedding',
    },
    {
      id: 2,
      names: 'Kavya & Rohit',
      location: 'Bangalore, Karnataka',
      weddingDate: 'January 2024',
      image: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      story: "Being software engineers, we were both skeptical about arranged marriages. But Vivah Bandhan's approach was so modern and understanding. They matched us based on our values, dreams, and compatibility. We're grateful for finding each other!",
      quote: "The platform understood what we were looking for better than we did ourselves. Our wedding was a perfect blend of tradition and modernity.",
      matchedIn: '6 weeks',
      ceremony: 'South Indian Temple Wedding',
    },
    {
      id: 3,
      names: 'Ananya & Vikram',
      location: 'Delhi, NCR',
      weddingDate: 'February 2024',
      image: 'https://images.pexels.com/photos/1729931/pexels-photo-1729931.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      story: "Our families had been searching for the perfect match for years. Vivah Bandhan made it happen in just a few weeks! We connected over our passion for art and literature. The wedding planning support was incredible too.",
      quote: "From the first conversation to our dream wedding, every step was magical. We couldn't have asked for a better experience.",
      matchedIn: '4 weeks',
      ceremony: 'Royal Rajasthani Wedding',
    },
    {
      id: 4,
      names: 'Meera & Karthik',
      location: 'Chennai, Tamil Nadu',
      weddingDate: 'March 2024',
      image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      story: "Long-distance seemed impossible until we found each other through Vivah Bandhan. Despite being in different cities, our connection was instant. The platform helped coordinate everything perfectly, and now we're happily married!",
      quote: "Distance means nothing when you find the right person. Vivah Bandhan made our impossible love story possible.",
      matchedIn: '8 weeks',
      ceremony: 'Traditional Tamil Brahmin Wedding',
    },
  ];

  const nextStory = () => {
    setCurrentStory((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setCurrentStory((prev) => (prev - 1 + stories.length) % stories.length);
  };

  return (
    <section id="stories" className="py-20 bg-gradient-to-br from-accent/10 via-white to-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
            Love Stories That Inspire
          </h2>
          <p className="font-poppins text-xl text-gray-600 max-w-2xl mx-auto">
            Real couples, real love stories, real happiness - discover how Vivah Bandhan brings hearts together
          </p>
        </motion.div>

        {/* Story Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStory}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image */}
                <div className="relative h-64 lg:h-auto">
                  <img
                    src={stories[currentStory].image}
                    alt={stories[currentStory].names}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Floating Hearts */}
                  <div className="absolute top-4 right-4">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-8 h-8 bg-primary rounded-full flex items-center justify-center"
                    >
                      <Heart className="w-4 h-4 text-white fill-white" />
                    </motion.div>
                  </div>

                  {/* Names Overlay */}
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-playfair text-2xl font-bold">
                      {stories[currentStory].names}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm opacity-90">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{stories[currentStory].location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{stories[currentStory].weddingDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col justify-center">
                  <div className="mb-6">
                    <Quote className="w-8 h-8 text-primary mb-4" />
                    <p className="font-poppins text-gray-700 text-lg leading-relaxed mb-6">
                      {stories[currentStory].story}
                    </p>
                    <blockquote className="font-playfair text-primary text-xl italic font-medium">
                      "{stories[currentStory].quote}"
                    </blockquote>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                    <div className="text-center">
                      <div className="font-playfair text-2xl font-bold text-primary">
                        {stories[currentStory].matchedIn}
                      </div>
                      <div className="font-poppins text-sm text-gray-600">
                        Time to Match
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-playfair text-lg font-bold text-secondary">
                        {stories[currentStory].ceremony}
                      </div>
                      <div className="font-poppins text-sm text-gray-600">
                        Wedding Style
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button
            onClick={prevStory}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-white transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextStory}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-white transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Story Indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          {stories.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStory(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentStory
                  ? 'bg-primary scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="font-playfair text-3xl font-bold text-gray-800 mb-4">
            Ready to Write Your Love Story?
          </h3>
          <p className="font-poppins text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of couples who found their perfect match through Vivah Bandhan. 
            Your happily ever after is just a click away.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full font-poppins font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Start Your Journey
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-primary text-primary rounded-full font-poppins font-semibold text-lg hover:bg-primary hover:text-white transition-all"
            >
              View More Stories
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SuccessStories;