import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Camera, Music, Palette, Play, X } from 'lucide-react';

const CulturalSection = () => {
  const [selectedRitual, setSelectedRitual] = useState<number | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const rituals = [
    {
      id: 1,
      name: 'Haldi Ceremony',
      description: 'Sacred turmeric paste application for purification and glow',
      icon: '🌟',
      color: 'from-yellow-400 to-orange-400',
      animation: 'Gentle circular motions applying golden turmeric paste',
    },
    {
      id: 2,
      name: 'Mehendi Art',
      description: 'Intricate henna designs symbolizing joy and spiritual awakening',
      icon: '🎨',
      color: 'from-green-400 to-emerald-400',
      animation: 'Delicate henna patterns flowing across hands',
    },
    {
      id: 3,
      name: 'Sangeet Dance',
      description: 'Joyful celebration with music, dance, and family bonding',
      icon: '💃',
      color: 'from-pink-400 to-purple-400',
      animation: 'Energetic dance moves with colorful dupatta swirls',
    },
    {
      id: 4,
      name: 'Garland Exchange',
      description: 'Sacred flower garland exchange between bride and groom',
      icon: '🌸',
      color: 'from-rose-400 to-pink-400',
      animation: 'Graceful exchange of fragrant flower garlands',
    },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section id="culture" className="py-20 bg-gradient-to-br from-accent/5 via-white to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
            Cultural Immersion
          </h2>
          <p className="font-poppins text-xl text-gray-600 max-w-2xl mx-auto">
            Explore and experience the rich traditions of Indian weddings
          </p>
        </motion.div>

        {/* AR Dress-Up Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-playfair text-3xl font-bold text-gray-800 mb-4">
                Virtual Dress-Up Experience
              </h3>
              <p className="font-poppins text-gray-600 mb-6">
                Upload your photo and see yourself in traditional Indian wedding attire. 
                Experience the beauty of different regional costumes.
              </p>
              
              <div className="space-y-4">
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-center w-full px-6 py-4 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <Camera className="w-6 h-6 text-primary mr-2" />
                  <span className="font-poppins text-primary font-medium">
                    Upload Your Photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </motion.label>
                
                <div className="grid grid-cols-2 gap-3">
                  {['Lehenga', 'Saree', 'Sherwani', 'Kurta'].map((outfit) => (
                    <motion.button
                      key={outfit}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary rounded-lg font-poppins font-medium hover:from-primary/20 hover:to-secondary/20 transition-all"
                    >
                      {outfit}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-accent/20 to-secondary/20 rounded-2xl flex items-center justify-center overflow-hidden">
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
                    <p className="font-poppins text-gray-600">
                      Your virtual try-on will appear here
                    </p>
                  </div>
                )}
              </div>
              
              {/* Overlay for traditional attire preview */}
              {uploadedImage && (
                <div className="absolute inset-0 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                    <p className="font-poppins text-sm text-gray-700">
                      Traditional attire overlay coming soon!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Interactive Ritual Icons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="font-playfair text-3xl font-bold text-gray-800 text-center mb-12">
            Sacred Wedding Rituals
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rituals.map((ritual, index) => (
              <motion.div
                key={ritual.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedRitual(ritual.id)}
                  className={`bg-gradient-to-br ${ritual.color} p-8 rounded-2xl shadow-lg cursor-pointer text-white text-center relative overflow-hidden`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="w-full h-full bg-repeat" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }} />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="text-4xl mb-4">{ritual.icon}</div>
                    <h4 className="font-playfair text-xl font-bold mb-2">
                      {ritual.name}
                    </h4>
                    <p className="font-poppins text-sm opacity-90">
                      {ritual.description}
                    </p>
                    
                    <motion.div
                      className="mt-4 flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Play className="w-5 h-5" />
                      <span className="ml-2 font-poppins text-sm">Watch Animation</span>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Ceremony Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="font-playfair text-3xl font-bold text-gray-800 text-center mb-12">
            Wedding Ceremony Timeline
          </h3>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary to-secondary rounded-full" />
            
            <div className="space-y-12">
              {[
                { time: 'Day 1', event: 'Engagement & Ring Ceremony', icon: '💍' },
                { time: 'Day 2', event: 'Mehendi & Haldi Ceremony', icon: '🌿' },
                { time: 'Day 3', event: 'Sangeet & Dance Night', icon: '🎵' },
                { time: 'Day 4', event: 'Wedding Ceremony', icon: '👰' },
                { time: 'Day 5', event: 'Reception & Celebration', icon: '🎉' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <div className="bg-gradient-to-r from-accent/10 to-secondary/10 rounded-lg p-4">
                      <h4 className="font-playfair text-xl font-bold text-gray-800 mb-2">
                        {item.event}
                      </h4>
                      <p className="font-poppins text-primary font-semibold">
                        {item.time}
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative z-10 w-16 h-16 bg-white border-4 border-primary rounded-full flex items-center justify-center text-2xl shadow-lg">
                    {item.icon}
                  </div>
                  
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Ritual Animation Modal */}
      <AnimatePresence>
        {selectedRitual && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedRitual(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-playfair text-2xl font-bold text-gray-800">
                  {rituals.find(r => r.id === selectedRitual)?.name}
                </h3>
                <button
                  onClick={() => setSelectedRitual(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="aspect-square bg-gradient-to-br from-accent/20 to-secondary/20 rounded-lg mb-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {rituals.find(r => r.id === selectedRitual)?.icon}
                  </div>
                  <p className="font-poppins text-gray-600">
                    {rituals.find(r => r.id === selectedRitual)?.animation}
                  </p>
                </div>
              </div>
              
              <p className="font-poppins text-gray-700 text-center">
                {rituals.find(r => r.id === selectedRitual)?.description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CulturalSection;