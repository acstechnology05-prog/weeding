import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, MapPin, Clock, Users } from 'lucide-react';
import { culturalService, type RitualInfo } from '../services/culturalService';

interface CulturalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  ritualName: string;
}

const CulturalInfoModal: React.FC<CulturalInfoModalProps> = ({ isOpen, onClose, ritualName }) => {
  const [ritualInfo, setRitualInfo] = useState<RitualInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && ritualName) {
      loadRitualInfo();
    }
  }, [isOpen, ritualName]);

  const loadRitualInfo = async () => {
    setIsLoading(true);
    try {
      const info = await culturalService.getRitualInfo(ritualName);
      setRitualInfo(info);
    } catch (error) {
      console.error('Load ritual info error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <div>
                <h2 className="font-playfair text-2xl font-bold text-gray-800">
                  {ritualInfo?.title || ritualName}
                </h2>
                <p className="font-poppins text-gray-600">
                  Learn about this beautiful tradition
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                <p className="font-poppins text-gray-600">Loading ritual information...</p>
              </div>
            ) : ritualInfo ? (
              <div className="space-y-6">
                {/* Image */}
                {ritualInfo.imageUrl && (
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={ritualInfo.imageUrl}
                      alt={ritualInfo.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Region Badge */}
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-poppins text-sm font-medium">
                    {ritualInfo.region} Tradition
                  </span>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-playfair text-xl font-bold text-gray-800 mb-3">
                    About This Ritual
                  </h3>
                  <p className="font-poppins text-gray-700 leading-relaxed">
                    {ritualInfo.description}
                  </p>
                </div>

                {/* Significance */}
                <div>
                  <h3 className="font-playfair text-xl font-bold text-gray-800 mb-3">
                    Cultural Significance
                  </h3>
                  <p className="font-poppins text-gray-700 leading-relaxed">
                    {ritualInfo.significance}
                  </p>
                </div>

                {/* Steps */}
                {ritualInfo.steps.length > 0 && (
                  <div>
                    <h3 className="font-playfair text-xl font-bold text-gray-800 mb-3">
                      Ritual Steps
                    </h3>
                    <div className="space-y-3">
                      {ritualInfo.steps.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center font-poppins text-sm font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <p className="font-poppins text-gray-700 leading-relaxed">
                            {step}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Modern Context */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-poppins font-semibold text-blue-800 mb-2">
                    💡 Modern Context
                  </h4>
                  <p className="font-poppins text-sm text-blue-700">
                    Today, this ritual continues to be an important part of Indian weddings, 
                    often adapted to modern settings while preserving its cultural essence. 
                    Many couples incorporate both traditional and contemporary elements to 
                    make the ceremony meaningful for all generations.
                  </p>
                </div>

                {/* Related Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-accent/10 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <h4 className="font-poppins font-semibold text-gray-800">
                        Duration
                      </h4>
                    </div>
                    <p className="font-poppins text-sm text-gray-600">
                      Typically 1-3 hours depending on family traditions
                    </p>
                  </div>
                  
                  <div className="bg-secondary/10 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-4 h-4 text-secondary-dark" />
                      <h4 className="font-poppins font-semibold text-gray-800">
                        Participants
                      </h4>
                    </div>
                    <p className="font-poppins text-sm text-gray-600">
                      Family members, close friends, and community elders
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="font-playfair text-xl font-bold text-gray-800 mb-2">
                  Information Not Available
                </h3>
                <p className="font-poppins text-gray-600">
                  We couldn't find detailed information about this ritual at the moment.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CulturalInfoModal;