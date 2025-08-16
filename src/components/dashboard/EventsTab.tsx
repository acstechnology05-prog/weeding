import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, MapPin, Users, IndianRupee, Clock, Ticket } from 'lucide-react';
import { eventService } from '../../services/eventService';
import CreateEventModal from './CreateEventModal';
import type { UserProfile, WeddingEvent, EventTicket } from '../../lib/supabase';

interface EventsTabProps {
  userProfile: UserProfile | null;
}

const EventsTab: React.FC<EventsTabProps> = ({ userProfile }) => {
  const [activeSubTab, setActiveSubTab] = useState('browse');
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [userEvents, setUserEvents] = useState<WeddingEvent[]>([]);
  const [userTickets, setUserTickets] = useState<EventTicket[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const subTabs = [
    { id: 'browse', name: 'Browse Events', icon: Calendar },
    { id: 'my-events', name: 'My Events', icon: Plus },
    { id: 'my-tickets', name: 'My Tickets', icon: Ticket },
  ];

  useEffect(() => {
    loadData();
  }, [userProfile, activeSubTab]);

  const loadData = async () => {
    if (!userProfile) return;

    try {
      setIsLoading(true);
      
      if (activeSubTab === 'browse') {
        const approvedEvents = await eventService.getApprovedEvents();
        setEvents(approvedEvents);
      } else if (activeSubTab === 'my-events') {
        const myEvents = await eventService.getUserEvents(userProfile.id);
        setUserEvents(myEvents);
      } else if (activeSubTab === 'my-tickets') {
        const tickets = await eventService.getUserTickets(userProfile.id);
        setUserTickets(tickets);
      }
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookTicket = async (eventId: string, quantity: number = 1) => {
    if (!userProfile) return;

    try {
      await eventService.bookTicket(eventId, userProfile.id, quantity);
      alert('🎟️ Ticket booked successfully! Check your tickets tab.');
      
      // Refresh events to update booking count
      if (activeSubTab === 'browse') {
        loadData();
      }
    } catch (error: any) {
      alert(error.message || 'Booking failed. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending_approval': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderBrowseEvents = () => (
    <div className="space-y-6">
      {events.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="font-playfair text-xl font-bold text-gray-800 mb-2">
            No Events Available
          </h3>
          <p className="font-poppins text-gray-600">
            Check back soon for upcoming wedding events!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={event.event_images[0] || 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full font-poppins font-semibold text-sm">
                  ₹{event.ticket_price.toLocaleString()}
                </div>
                <div className="absolute top-4 left-4 bg-primary/90 text-white px-3 py-1 rounded-full font-poppins text-xs capitalize">
                  {event.event_type}
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-playfair text-xl font-bold text-gray-800 mb-2">
                  {event.title}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-poppins text-sm">
                      {new Date(event.event_date).toLocaleDateString('en-IN')} at {event.event_time}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-poppins text-sm">
                      {event.venue_name}, {event.city}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="font-poppins text-sm">
                      {event.current_bookings}/{event.max_capacity} guests
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm font-poppins text-gray-600">
                    {event.max_capacity - event.current_bookings} spots left
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBookTicket(event.id)}
                    disabled={event.current_bookings >= event.max_capacity}
                    className="px-4 py-2 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-poppins font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Book Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderMyEvents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-playfair text-2xl font-bold text-gray-800">
            My Events
          </h3>
          <p className="font-poppins text-gray-600">
            Manage your wedding events and celebrations
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-poppins font-semibold hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Create Event</span>
        </motion.button>
      </div>

      {userEvents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <Plus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="font-playfair text-xl font-bold text-gray-800 mb-2">
            No Events Created
          </h3>
          <p className="font-poppins text-gray-600 mb-6">
            Create your first wedding event and invite guests!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-poppins font-semibold"
          >
            Create Your First Event
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-playfair text-xl font-bold text-gray-800">
                    {event.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-poppins font-semibold ${getStatusColor(event.status)}`}>
                    {event.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-poppins text-sm">
                      {new Date(event.event_date).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="font-poppins text-sm">
                      {event.current_bookings}/{event.max_capacity} booked
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <IndianRupee className="w-4 h-4 text-primary" />
                    <span className="font-poppins text-sm">
                      ₹{(event.current_bookings * event.ticket_price).toLocaleString()} revenue
                    </span>
                  </div>
                </div>

                {event.status === 'draft' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => eventService.submitEventForApproval(event.id, userProfile!.id)}
                    className="w-full py-2 bg-primary text-white rounded-lg font-poppins font-medium hover:bg-primary-dark transition-colors"
                  >
                    Submit for Approval
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderMyTickets = () => (
    <div className="space-y-6">
      <h3 className="font-playfair text-2xl font-bold text-gray-800">
        My Tickets
      </h3>

      {userTickets.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="font-playfair text-xl font-bold text-gray-800 mb-2">
            No Tickets Booked
          </h3>
          <p className="font-poppins text-gray-600">
            Browse events and book tickets to attend amazing weddings!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {userTickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-2xl p-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-playfair text-xl font-bold text-gray-800 mb-2">
                    {ticket.event?.title}
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-poppins text-sm">
                          {ticket.event && new Date(ticket.event.event_date).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-poppins text-sm">
                          {ticket.event?.event_time}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-poppins text-sm">
                          {ticket.event?.venue_name}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="font-poppins text-sm">
                          {ticket.ticket_quantity} ticket(s)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="font-poppins">
                      <span className="text-2xl font-bold text-primary">
                        ₹{ticket.total_amount.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-600 ml-2">
                        ({ticket.ticket_quantity} × ₹{ticket.event?.ticket_price.toLocaleString()})
                      </span>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-poppins font-semibold ${
                      ticket.booking_status === 'confirmed' ? 'text-green-600 bg-green-100' :
                      ticket.booking_status === 'pending' ? 'text-yellow-600 bg-yellow-100' :
                      'text-red-600 bg-red-100'
                    }`}>
                      {ticket.booking_status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* QR Code */}
                {ticket.booking_status === 'confirmed' && (
                  <div className="ml-6 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                      <div className="text-xs font-mono text-gray-600 break-all p-2">
                        QR
                      </div>
                    </div>
                    <p className="font-poppins text-xs text-gray-500">
                      Show at venue
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {subTabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg font-poppins font-medium transition-all ${
                activeSubTab === tab.id
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={activeSubTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="font-poppins text-gray-600">Loading...</p>
            </div>
          </div>
        ) : (
          <>
            {activeSubTab === 'browse' && renderBrowseEvents()}
            {activeSubTab === 'my-events' && renderMyEvents()}
            {activeSubTab === 'my-tickets' && renderMyTickets()}
          </>
        )}
      </motion.div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateEventModal
          userProfile={userProfile}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
};

export default EventsTab;