import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Phone, Video, MoreVertical, Heart } from 'lucide-react';
import { chatService } from '../../services/chatService';
import type { UserProfile, ChatRoom, ChatMessage } from '../../lib/supabase';

interface ChatTabProps {
  userProfile: UserProfile | null;
}

const ChatTab: React.FC<ChatTabProps> = ({ userProfile }) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userProfile) {
      loadChatRooms();
    }
  }, [userProfile]);

  useEffect(() => {
    if (selectedRoom && userProfile) {
      loadMessages(selectedRoom.id);
    }
  }, [selectedRoom, userProfile]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatRooms = async () => {
    if (!userProfile) return;

    try {
      const rooms = await chatService.getChatRooms(userProfile.id);
      setChatRooms(rooms);
    } catch (error) {
      console.error('Load chat rooms error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (roomId: string) => {
    if (!userProfile) return;

    try {
      const roomMessages = await chatService.getChatMessages(roomId, userProfile.id);
      setMessages(roomMessages);
    } catch (error) {
      console.error('Load messages error:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom || !userProfile || isSending) return;

    setIsSending(true);
    try {
      const message = await chatService.sendMessage(
        selectedRoom.id,
        userProfile.id,
        newMessage.trim()
      );
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Update chat room's last message time
      setChatRooms(prev => 
        prev.map(room => 
          room.id === selectedRoom.id 
            ? { ...room, last_message_at: new Date().toISOString() }
            : room
        )
      );
    } catch (error) {
      console.error('Send message error:', error);
    } finally {
      setIsSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getOtherUser = (room: ChatRoom) => {
    if (!userProfile) return null;
    return room.user1_id === userProfile.id ? room.user2 : room.user1;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="font-poppins text-gray-600">Loading your conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[600px] flex">
      {/* Chat Rooms List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-playfair text-xl font-bold text-gray-800">
            Messages
          </h2>
          <p className="font-poppins text-sm text-gray-600">
            {chatRooms.length} conversations
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chatRooms.length === 0 ? (
            <div className="p-6 text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="font-poppins text-gray-600 text-sm">
                No conversations yet. Like someone to start chatting!
              </p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {chatRooms.map((room) => {
                const otherUser = getOtherUser(room);
                if (!otherUser) return null;

                return (
                  <motion.button
                    key={room.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedRoom(room)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedRoom?.id === room.id
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                        <span className="font-playfair font-bold text-white text-lg">
                          {otherUser.full_name.charAt(0)}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-poppins font-semibold text-gray-800 truncate">
                          {otherUser.full_name}
                        </h4>
                        <p className="font-poppins text-sm text-gray-600 truncate">
                          {room.last_message?.message_text || 'Start a conversation...'}
                        </p>
                      </div>
                      
                      <div className="text-xs text-gray-500 font-poppins">
                        {formatTime(room.last_message_at)}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="font-playfair font-bold text-white">
                    {getOtherUser(selectedRoom)?.full_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-poppins font-semibold text-gray-800">
                    {getOtherUser(selectedRoom)?.full_name}
                  </h3>
                  <p className="font-poppins text-sm text-green-600">Online</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-600 hover:text-primary transition-colors"
                >
                  <Phone className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-600 hover:text-primary transition-colors"
                >
                  <Video className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-600 hover:text-primary transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    message.sender_id === userProfile?.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl font-poppins text-sm ${
                      message.sender_id === userProfile?.id
                        ? 'bg-gradient-to-r from-primary to-primary-dark text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}
                  >
                    <p>{message.message_text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender_id === userProfile?.id ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      {formatTime(message.created_at)}
                    </p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
                />
                <motion.button
                  type="submit"
                  disabled={!newMessage.trim() || isSending}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-playfair text-xl font-bold text-gray-800 mb-2">
                Select a Conversation
              </h3>
              <p className="font-poppins text-gray-600">
                Choose a chat to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatTab;