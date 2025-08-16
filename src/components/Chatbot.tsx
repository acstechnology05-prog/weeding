import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Heart, Calendar, Sparkles, User } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Namaste! 🙏 I'm here to help you find your perfect match or plan your dream wedding. How can I assist you today?",
      isBot: true,
    },
  ]);
  const [inputText, setInputText] = useState('');

  const quickActions = [
    { icon: Heart, text: 'Find Matches', action: 'matches' },
    { icon: Calendar, text: 'Book Wedding', action: 'wedding' },
    { icon: Sparkles, text: 'Learn Rituals', action: 'rituals' },
    { icon: User, text: 'Success Stories', action: 'stories' },
  ];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: inputText,
      isBot: false,
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputText),
        isBot: true,
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const getBotResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('match') || message.includes('profile')) {
      return "I'd be happy to help you find your perfect match! 💕 What are your preferences for age, location, and profession? I can show you compatible profiles right away.";
    } else if (message.includes('wedding') || message.includes('book')) {
      return "Wonderful! 🎉 We have amazing wedding experiences across India. Are you interested in a specific region like Rajasthani, South Indian, or Punjabi weddings? I can show you available dates and venues.";
    } else if (message.includes('ritual') || message.includes('culture')) {
      return "Indian wedding rituals are so beautiful! ✨ Would you like to learn about Mehendi, Haldi, Sangeet, or the main wedding ceremony? I can explain the significance and show you virtual demonstrations.";
    } else if (message.includes('story') || message.includes('success')) {
      return "Our success stories are truly heartwarming! 💖 We've helped over 1,200 couples find their soulmates. Would you like to read some recent love stories or see testimonials from happy couples?";
    } else {
      return "I'm here to help with matchmaking, wedding bookings, cultural information, and success stories. What would you like to explore? 😊";
    }
  };

  const handleQuickAction = (action: string) => {
    const actionMessages = {
      matches: "I'd love to help you find your perfect match! What's your preferred age range and location?",
      wedding: "Let's plan your dream wedding! Which type of Indian wedding ceremony interests you most?",
      rituals: "Indian wedding rituals are fascinating! Which ceremony would you like to learn about first?",
      stories: "Our couples have amazing love stories! Would you like to read about recent matches or long-term success stories?",
    };

    const userMessage = {
      id: messages.length + 1,
      text: quickActions.find(qa => qa.action === action)?.text || '',
      isBot: false,
    };

    const botMessage = {
      id: messages.length + 2,
      text: actionMessages[action as keyof typeof actionMessages],
      isBot: true,
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full shadow-lg z-40 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        animate={isOpen ? {} : { 
          boxShadow: [
            "0 0 0 0 rgba(233, 30, 99, 0.4)",
            "0 0 0 20px rgba(233, 30, 99, 0)",
          ]
        }}
        transition={isOpen ? {} : { duration: 2, repeat: Infinity }}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-playfair font-bold">Vivah Assistant</h3>
                <p className="text-xs opacity-90">Always here to help</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl font-poppins text-sm ${
                      message.isBot
                        ? 'bg-gray-100 text-gray-800 rounded-bl-sm'
                        : 'bg-gradient-to-r from-primary to-primary-dark text-white rounded-br-sm'
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-2 mb-4">
                {quickActions.map((action) => (
                  <motion.button
                    key={action.action}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuickAction(action.action)}
                    className="flex items-center space-x-2 p-2 bg-accent/10 text-primary rounded-lg font-poppins text-xs hover:bg-accent/20 transition-colors"
                  >
                    <action.icon className="w-3 h-3" />
                    <span>{action.text}</span>
                  </motion.button>
                ))}
              </div>

              {/* Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent font-poppins text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;