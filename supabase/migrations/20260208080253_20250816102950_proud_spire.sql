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

CREATE TABLE IF NOT EXISTS chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  user2_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  status text CHECK (status IN ('active', 'blocked', 'archived')) DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  last_message_at timestamptz DEFAULT now(),
  UNIQUE(user1_id, user2_id)
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  message_text text NOT NULL,
  message_type text CHECK (message_type IN ('text', 'image', 'voice')) DEFAULT 'text',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

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

ALTER TABLE user_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_connections ENABLE ROW LEVEL SECURITY;

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