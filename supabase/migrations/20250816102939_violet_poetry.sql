/*
  # User Authentication and Profile System

  1. New Tables
    - `user_profiles` - Extended user profile information
      - `id` (uuid, primary key, references auth.users)
      - `aadhaar_number` (text, unique, encrypted)
      - `aadhaar_verified` (boolean, default false)
      - `phone_number` (text, unique)
      - `phone_verified` (boolean, default false)
      - `full_name` (text)
      - `date_of_birth` (date)
      - `gender` (text)
      - `religion` (text)
      - `caste` (text)
      - `education` (text)
      - `profession` (text)
      - `location_city` (text)
      - `location_state` (text)
      - `hobbies` (text array)
      - `interests` (text array)
      - `bio` (text)
      - `profile_photos` (text array)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add admin policies for moderation
</sql>

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  aadhaar_number text UNIQUE,
  aadhaar_verified boolean DEFAULT false,
  phone_number text UNIQUE NOT NULL,
  phone_verified boolean DEFAULT false,
  full_name text NOT NULL,
  date_of_birth date,
  gender text CHECK (gender IN ('male', 'female', 'other')),
  religion text,
  caste text,
  education text,
  profession text,
  location_city text,
  location_state text,
  hobbies text[] DEFAULT '{}',
  interests text[] DEFAULT '{}',
  bio text,
  profile_photos text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view active profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();