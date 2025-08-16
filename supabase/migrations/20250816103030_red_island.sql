/*
  # Notifications and Admin System

  1. New Tables
    - `notifications` - User notifications
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `type` (text, match/message/event/admin)
      - `title` (text)
      - `message` (text)
      - `data` (jsonb, additional notification data)
      - `is_read` (boolean, default false)
      - `created_at` (timestamp)

    - `admin_users` - Admin management
      - `id` (uuid, primary key, references user_profiles)
      - `role` (text, super_admin/moderator/support)
      - `permissions` (text array)
      - `created_at` (timestamp)

    - `user_reports` - Report system for safety
      - `id` (uuid, primary key)
      - `reporter_id` (uuid, references user_profiles)
      - `reported_user_id` (uuid, references user_profiles)
      - `report_type` (text, fake_profile/harassment/inappropriate_content)
      - `description` (text)
      - `evidence` (text array, image URLs)
      - `status` (text, pending/investigating/resolved/dismissed)
      - `admin_id` (uuid, references admin_users)
      - `admin_notes` (text)
      - `created_at` (timestamp)
      - `resolved_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for user access and admin management
</sql>

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  type text CHECK (type IN ('match', 'message', 'event', 'admin', 'system')) NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
  role text CHECK (role IN ('super_admin', 'moderator', 'support')) NOT NULL,
  permissions text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- User Reports Table
CREATE TABLE IF NOT EXISTS user_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  reported_user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  report_type text CHECK (report_type IN ('fake_profile', 'harassment', 'inappropriate_content', 'spam')) NOT NULL,
  description text NOT NULL,
  evidence text[] DEFAULT '{}',
  status text CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')) DEFAULT 'pending',
  admin_id uuid REFERENCES admin_users(id),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;

-- Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Policies for admin_users
CREATE POLICY "Admins can view admin data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Policies for user_reports
CREATE POLICY "Users can view their own reports"
  ON user_reports
  FOR SELECT
  TO authenticated
  USING (reporter_id = auth.uid());

CREATE POLICY "Users can create reports"
  ON user_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (reporter_id = auth.uid());

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_message text,
  p_data jsonb DEFAULT '{}'
)
RETURNS uuid AS $$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, data)
  VALUES (p_user_id, p_type, p_title, p_message, p_data)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;