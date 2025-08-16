import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface UserProfile {
  id: string;
  aadhaar_number?: string;
  aadhaar_verified: boolean;
  phone_number: string;
  phone_verified: boolean;
  full_name: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  religion?: string;
  caste?: string;
  education?: string;
  profession?: string;
  location_city?: string;
  location_state?: string;
  hobbies: string[];
  interests: string[];
  bio?: string;
  profile_photos: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserMatch {
  id: string;
  user_id: string;
  matched_user_id: string;
  compatibility_score: number;
  match_factors: Record<string, any>;
  status: 'pending' | 'liked' | 'disliked' | 'mutual';
  created_at: string;
  matched_user?: UserProfile;
}

export interface ChatRoom {
  id: string;
  user1_id: string;
  user2_id: string;
  status: 'active' | 'blocked' | 'archived';
  created_at: string;
  last_message_at: string;
  user1?: UserProfile;
  user2?: UserProfile;
  last_message?: ChatMessage;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  message_text: string;
  message_type: 'text' | 'image' | 'voice';
  is_read: boolean;
  created_at: string;
  sender?: UserProfile;
}

export interface WeddingEvent {
  id: string;
  organizer_id: string;
  event_type: 'wedding' | 'haldi' | 'sangeet' | 'mehendi' | 'reception' | 'engagement';
  title: string;
  description?: string;
  event_date: string;
  event_time: string;
  venue_name: string;
  venue_address: string;
  city: string;
  state: string;
  ticket_price: number;
  max_capacity: number;
  current_bookings: number;
  event_images: string[];
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'cancelled';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  organizer?: UserProfile;
}

export interface EventTicket {
  id: string;
  event_id: string;
  buyer_id: string;
  ticket_quantity: number;
  total_amount: number;
  booking_status: 'pending' | 'confirmed' | 'cancelled' | 'refunded';
  payment_id?: string;
  qr_code?: string;
  created_at: string;
  event?: WeddingEvent;
  buyer?: UserProfile;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'match' | 'message' | 'event' | 'admin' | 'system';
  title: string;
  message: string;
  data: Record<string, any>;
  is_read: boolean;
  created_at: string;
}