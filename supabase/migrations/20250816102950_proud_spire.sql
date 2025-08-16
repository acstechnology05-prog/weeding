/*
  # Matchmaking and Chat System

  1. New Tables
    - `user_matches` - Store match recommendations and compatibility scores
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `matched_user_id` (uuid, references user_profiles)
      - `compatibility_score` (integer, 0-100)
      - `match_factors` (jsonb, stores matching criteria)
      - `status` (text, pending/liked/disliked/mutual)
      - `created_at` (timestamp)

    - `chat_rooms` - Chat sessions between users
      - `id` (uuid, primary key)
      - `user1_id` (uuid, references user_profiles)
      - `user2_id` (uuid, references user_profiles)
      - `status` (text, active/blocked/archived)
      - `created_at` (timestamp)
      - `last_message_at` (timestamp)

    - `chat_messages` - Individual chat messages
      - `id` (uuid, primary key)
      - `room_id` (uuid, references chat_rooms)
      - `sender_id` (uuid, references user_profiles)
      - `message_text` (text)
      - `message_type` (text, text/image/voice)
      - `is_read` (boolean, default false)
      - `created_at` (timestamp)

    - `user_connections` - Track user connections and communication frequency
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `connected_user_id` (uuid, references user_profiles)
      - `connection_strength` (integer, 1-10)
      - `last_interaction` (timestamp)
      - `total_messages` (integer, default 0)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for users to access their own data
    - Prevent unauthorized access to other users' conversations
</sql>

-- User Matches Table
CREATE TABLE IF NOT EXISTS user_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  matched_user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  compatibility_score integer CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
  match_factors jsonb DEFAULT '{}',
  status text CHECK (status IN ('pending', 'liked', 'disliked', 'mutual')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, matched_user_id)
);

-- Chat Rooms Table
CREATE TABLE IF NOT EXISTS chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  user2_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  status text CHECK (status IN ('active', 'blocked', 'archived')) DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  last_message_at timestamptz DEFAULT now(),
  UNIQUE(user1_id, user2_id)
);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  message_text text NOT NULL,
  message_type text CHECK (message_type IN ('text', 'image', 'voice')) DEFAULT 'text',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- User Connections Table
CREATE TABLE IF NOT EXISTS user_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  connected_user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  connection_strength integer CHECK (connection_strength >= 1 AND connection_strength <= 10) DEFAULT 1,
  last_interaction timestamptz DEFAULT now(),
  total_messages integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, connected_user_id)
);

-- Enable RLS
ALTER TABLE user_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_connections ENABLE ROW LEVEL SECURITY;

-- Policies for user_matches
CREATE POLICY "Users can view their own matches"
  ON user_matches
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR matched_user_id = auth.uid());

CREATE POLICY "Users can update their match status"
  ON user_matches
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Policies for chat_rooms
CREATE POLICY "Users can view their chat rooms"
  ON chat_rooms
  FOR SELECT
  TO authenticated
  USING (user1_id = auth.uid() OR user2_id = auth.uid());

CREATE POLICY "Users can create chat rooms"
  ON chat_rooms
  FOR INSERT
  TO authenticated
  WITH CHECK (user1_id = auth.uid() OR user2_id = auth.uid());

-- Policies for chat_messages
CREATE POLICY "Users can view messages in their rooms"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_rooms 
      WHERE id = room_id 
      AND (user1_id = auth.uid() OR user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their rooms"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM chat_rooms 
      WHERE id = room_id 
      AND (user1_id = auth.uid() OR user2_id = auth.uid())
    )
  );

-- Policies for user_connections
CREATE POLICY "Users can view their connections"
  ON user_connections
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR connected_user_id = auth.uid());

CREATE POLICY "Users can manage their connections"
  ON user_connections
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());