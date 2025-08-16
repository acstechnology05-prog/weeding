import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, IndianRupee, Users, Camera } from 'lucide-react';
import { eventService } from '../../services/eventService';
import type { UserProfile } from '../../lib/supabase';
import type { CreateEventData } from '../../services/eventService';

interface CreateEventModalProps {
  userProfile: UserProfile | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ userProfile, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CreateEventData>({
    eventType: 'wedding',
    title: '',
    description: '',
    eventDate: '',
    eventTime: '',
    venueName: '',
    venueAddress: '',
    city: '',
    state: '',
    ticketPrice: 0,
    maxCapacity: 100,
    eventImages: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const eventTypes = [
    { value: 'wedding', label: 'Wedding Ceremony', emoji: '💒' },
    { value: 'haldi', label: 'Haldi Ceremony', emoji: '🌟' },
    { value: 'sangeet', label: 'Sangeet Night', emoji: '💃' },
    { value: 'mehendi', label: 'Mehendi Ceremony', emoji: '🎨' },
    { value: 'reception', label: 'Reception Party', emoji: '🎉' },
    { value: 'engagement', label: 'Engagement', emoji: '💍' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    setIsLoading(true);
    setError('');

    try {
      await eventService.createEvent(userProfile.id, formData);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    });
  };

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
            <div>
              <h2 className="font-playfair text-2xl font-bold text-gray-800">
                Create Wedding Event
              </h2>
              <p className="font-poppins text-gray-600">
                Share your special moments with the community
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-poppins text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Event Type */}
            <div>
              <label className="block font-poppins font-medium text-gray-700 mb-3">
                Event Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {eventTypes.map((type) => (
                  <motion.label
                    key={type.value}
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.eventType === type.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="eventType"
                      value={type.value}
                      checked={formData.eventType === type.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-xl">{type.emoji}</span>
                    <span className="font-poppins text-sm font-medium text-gray-700">
                      {type.label}
                    </span>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block font-poppins font-medium text-gray-700 mb-2">
                Event Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
                placeholder="e.g., Priya & Arjun's Wedding Celebration"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-poppins font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins resize-none"
                placeholder="Describe your event, traditions, and what guests can expect..."
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-poppins font-medium text-gray-700 mb-2">
                  Event Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
                  />
                </div>
              </div>
              
              <div>
                <label className="block font-poppins font-medium text-gray-700 mb-2">
                  Event Time
                </label>
                <input
                  type="time"
                  name="eventTime"
                  value={formData.eventTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
                />
              </div>
            </div>

            {/* Venue Details */}
            <div className="space-y-4">
              <div>
                <label className="block font-poppins font-medium text-gray-700 mb-2">
                  Venue Name
                </label>
                <input
                  type="text"
                  name="venueName"
                  value={formData.venueName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
                  placeholder="e.g., Grand Ballroom, Heritage Hotel"
                />
              </div>
              
              <div>
                <label className="block font-poppins font-medium text-gray-700 mb-2">
                  Venue Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <textarea
                    name="venueAddress"
                    value={formData.venueAddress}
                    onChange={handleChange}
                    required
                    rows={2}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins resize-none"
                    placeholder="Complete venue address with landmarks"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
                  placeholder="City"
                />
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
                  placeholder="State"
                />
              </div>
            </div>

            {/* Pricing and Capacity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-poppins font-medium text-gray-700 mb-2">
                  Ticket Price (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    name="ticketPrice"
                    value={formData.ticketPrice}
                    onChange={handleChange}
                    min="0"
                    step="100"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <label className="block font-poppins font-medium text-gray-700 mb-2">
                  Max Capacity
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    name="maxCapacity"
                    value={formData.maxCapacity}
                    onChange={handleChange}
                    min="1"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
                    placeholder="100"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block font-poppins font-medium text-gray-700 mb-2">
                Event Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="font-poppins text-gray-600 text-sm">
                  Upload event photos (Coming soon)
                </p>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-6">
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-poppins font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </motion.button>
              
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-poppins font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating...</span>
                  </div>
                ) : (
                  'Create Event'
                )}
              </motion.button>
            </div>
          </form>

          {/* Info Box */}
          <div className="mx-6 mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-poppins font-semibold text-blue-800 mb-2">
              📋 Event Approval Process
            </h4>
            <ul className="font-poppins text-sm text-blue-700 space-y-1">
              <li>• Your event will be reviewed by our admin team</li>
              <li>• Approval typically takes 24-48 hours</li>
              <li>• You'll receive an email confirmation once approved</li>
              <li>• Only approved events will be visible to other users</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateEventModal;