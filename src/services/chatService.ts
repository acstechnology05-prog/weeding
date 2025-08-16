import { supabase } from '../lib/supabase';
import type { ChatRoom, ChatMessage, UserConnection } from '../lib/supabase';

class ChatService {
  async getChatRooms(userId: string): Promise<ChatRoom[]> {
    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select(`
          *,
          user1:user_profiles!user1_id(*),
          user2:user_profiles!user2_id(*),
          last_message:chat_messages(*)
        `)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .eq('status', 'active')
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      return data?.map(room => ({
        ...room,
        last_message: room.last_message?.[0] || null,
      })) || [];
    } catch (error) {
      console.error('Get chat rooms error:', error);
      throw error;
    }
  }

  async getChatMessages(roomId: string, userId: string): Promise<ChatMessage[]> {
    try {
      // Verify user has access to this room
      const { data: room, error: roomError } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('id', roomId)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .single();

      if (roomError || !room) throw new Error('Unauthorized access to chat room');

      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          sender:user_profiles!sender_id(full_name, profile_photos)
        `)
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Mark messages as read
      await this.markMessagesAsRead(roomId, userId);

      return data || [];
    } catch (error) {
      console.error('Get chat messages error:', error);
      throw error;
    }
  }

  async sendMessage(roomId: string, senderId: string, messageText: string, messageType: 'text' | 'image' | 'voice' = 'text'): Promise<ChatMessage> {
    try {
      // Verify user has access to this room
      const { data: room, error: roomError } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('id', roomId)
        .or(`user1_id.eq.${senderId},user2_id.eq.${senderId}`)
        .single();

      if (roomError || !room) throw new Error('Unauthorized access to chat room');

      // Insert message
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: roomId,
          sender_id: senderId,
          message_text: messageText,
          message_type: messageType,
        })
        .select(`
          *,
          sender:user_profiles!sender_id(full_name, profile_photos)
        `)
        .single();

      if (error) throw error;

      // Update room's last message time
      await supabase
        .from('chat_rooms')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', roomId);

      // Update user connections
      const otherUserId = room.user1_id === senderId ? room.user2_id : room.user1_id;
      await this.updateConnection(senderId, otherUserId);

      // Send notification to other user
      await this.sendMessageNotification(otherUserId, senderId, messageText);

      return data;
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }

  async requestChatAccess(requesterId: string, targetUserId: string): Promise<ChatRoom> {
    try {
      // Check if chat room already exists
      const { data: existingRoom } = await supabase
        .from('chat_rooms')
        .select('*')
        .or(`and(user1_id.eq.${requesterId},user2_id.eq.${targetUserId}),and(user1_id.eq.${targetUserId},user2_id.eq.${requesterId})`)
        .single();

      if (existingRoom) {
        return existingRoom;
      }

      // Create new chat room
      const { data, error } = await supabase
        .from('chat_rooms')
        .insert({
          user1_id: requesterId,
          user2_id: targetUserId,
          status: 'active',
        })
        .select(`
          *,
          user1:user_profiles!user1_id(*),
          user2:user_profiles!user2_id(*)
        `)
        .single();

      if (error) throw error;

      // Send notification to target user
      const { data: requesterProfile } = await supabase
        .from('user_profiles')
        .select('full_name')
        .eq('id', requesterId)
        .single();

      await supabase
        .from('notifications')
        .insert({
          user_id: targetUserId,
          type: 'message',
          title: 'New Chat Request',
          message: `${requesterProfile?.full_name} wants to start a conversation with you!`,
          data: { chat_room_id: data.id, requester_id: requesterId },
        });

      return data;
    } catch (error) {
      console.error('Request chat access error:', error);
      throw error;
    }
  }

  async getConnections(userId: string): Promise<UserConnection[]> {
    try {
      const { data, error } = await supabase
        .from('user_connections')
        .select(`
          *,
          connected_user:user_profiles!connected_user_id(*)
        `)
        .eq('user_id', userId)
        .order('connection_strength', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get connections error:', error);
      throw error;
    }
  }

  private async updateConnection(userId: string, connectedUserId: string) {
    try {
      const { data: existingConnection } = await supabase
        .from('user_connections')
        .select('*')
        .eq('user_id', userId)
        .eq('connected_user_id', connectedUserId)
        .single();

      if (existingConnection) {
        // Update existing connection
        await supabase
          .from('user_connections')
          .update({
            connection_strength: Math.min(existingConnection.connection_strength + 1, 10),
            last_interaction: new Date().toISOString(),
            total_messages: existingConnection.total_messages + 1,
          })
          .eq('id', existingConnection.id);
      } else {
        // Create new connection
        await supabase
          .from('user_connections')
          .insert({
            user_id: userId,
            connected_user_id: connectedUserId,
            connection_strength: 1,
            last_interaction: new Date().toISOString(),
            total_messages: 1,
          });
      }
    } catch (error) {
      console.error('Update connection error:', error);
    }
  }

  private async markMessagesAsRead(roomId: string, userId: string) {
    try {
      await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('room_id', roomId)
        .neq('sender_id', userId)
        .eq('is_read', false);
    } catch (error) {
      console.error('Mark messages as read error:', error);
    }
  }

  private async sendMessageNotification(userId: string, senderId: string, messageText: string) {
    try {
      const { data: senderProfile } = await supabase
        .from('user_profiles')
        .select('full_name')
        .eq('id', senderId)
        .single();

      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'message',
          title: 'New Message',
          message: `${senderProfile?.full_name}: ${messageText.substring(0, 50)}${messageText.length > 50 ? '...' : ''}`,
          data: { sender_id: senderId, room_id: '' },
        });
    } catch (error) {
      console.error('Send message notification error:', error);
    }
  }

  async blockUser(userId: string, blockedUserId: string) {
    try {
      // Update chat room status to blocked
      await supabase
        .from('chat_rooms')
        .update({ status: 'blocked' })
        .or(`and(user1_id.eq.${userId},user2_id.eq.${blockedUserId}),and(user1_id.eq.${blockedUserId},user2_id.eq.${userId})`);

      // Update match status to disliked
      await supabase
        .from('user_matches')
        .update({ status: 'disliked' })
        .or(`and(user_id.eq.${userId},matched_user_id.eq.${blockedUserId}),and(user_id.eq.${blockedUserId},matched_user_id.eq.${userId})`);

    } catch (error) {
      console.error('Block user error:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();