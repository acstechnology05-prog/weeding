/*
  # Wedding Events and Ticketing System

  1. New Tables
    - `wedding_events` - User-created wedding events
      - `id` (uuid, primary key)
      - `organizer_id` (uuid, references user_profiles)
      - `event_type` (text, wedding/haldi/sangeet/mehendi/reception)
      - `title` (text)
      - `description` (text)
      - `event_date` (date)
      - `event_time` (time)
      - `venue_name` (text)
      - `venue_address` (text)
      - `city` (text)
      - `state` (text)
      - `ticket_price` (decimal)
      - `max_capacity` (integer)
      - `current_bookings` (integer, default 0)
      - `event_images` (text array)
      - `status` (text, draft/pending_approval/approved/rejected/cancelled)
      - `admin_notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `event_tickets` - Ticket bookings for events
      - `id` (uuid, primary key)
      - `event_id` (uuid, references wedding_events)
      - `buyer_id` (uuid, references user_profiles)
      - `ticket_quantity` (integer)
      - `total_amount` (decimal)
      - `booking_status` (text, pending/confirmed/cancelled/refunded)
      - `payment_id` (text)
      - `qr_code` (text)
      - `created_at` (timestamp)

    - `event_requests` - Admin approval system
      - `id` (uuid, primary key)
      - `event_id` (uuid, references wedding_events)
      - `requester_id` (uuid, references user_profiles)
      - `request_type` (text, create_event/modify_event/cancel_event)
      - `request_data` (jsonb)
      - `status` (text, pending/approved/rejected)
      - `admin_id` (uuid, references user_profiles)
      - `admin_comments` (text)
      - `created_at` (timestamp)
      - `processed_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for event management
    - Ensure users can only manage their own events
</sql>

-- Wedding Events Table
CREATE TABLE IF NOT EXISTS wedding_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  event_type text CHECK (event_type IN ('wedding', 'haldi', 'sangeet', 'mehendi', 'reception', 'engagement')) NOT NULL,
  title text NOT NULL,
  description text,
  event_date date NOT NULL,
  event_time time NOT NULL,
  venue_name text NOT NULL,
  venue_address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  ticket_price decimal(10,2) DEFAULT 0,
  max_capacity integer DEFAULT 100,
  current_bookings integer DEFAULT 0,
  event_images text[] DEFAULT '{}',
  status text CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected', 'cancelled')) DEFAULT 'draft',
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Event Tickets Table
CREATE TABLE IF NOT EXISTS event_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES wedding_events(id) ON DELETE CASCADE,
  buyer_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  ticket_quantity integer DEFAULT 1,
  total_amount decimal(10,2) NOT NULL,
  booking_status text CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'refunded')) DEFAULT 'pending',
  payment_id text,
  qr_code text,
  created_at timestamptz DEFAULT now()
);

-- Event Requests Table
CREATE TABLE IF NOT EXISTS event_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES wedding_events(id) ON DELETE CASCADE,
  requester_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  request_type text CHECK (request_type IN ('create_event', 'modify_event', 'cancel_event')) NOT NULL,
  request_data jsonb DEFAULT '{}',
  status text CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  admin_id uuid REFERENCES user_profiles(id),
  admin_comments text,
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

-- Enable RLS
ALTER TABLE wedding_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_requests ENABLE ROW LEVEL SECURITY;

-- Policies for wedding_events
CREATE POLICY "Users can view approved events"
  ON wedding_events
  FOR SELECT
  TO authenticated
  USING (status = 'approved' OR organizer_id = auth.uid());

CREATE POLICY "Users can create their own events"
  ON wedding_events
  FOR INSERT
  TO authenticated
  WITH CHECK (organizer_id = auth.uid());

CREATE POLICY "Users can update their own events"
  ON wedding_events
  FOR UPDATE
  TO authenticated
  USING (organizer_id = auth.uid());

-- Policies for event_tickets
CREATE POLICY "Users can view their own tickets"
  ON event_tickets
  FOR SELECT
  TO authenticated
  USING (buyer_id = auth.uid());

CREATE POLICY "Users can book tickets"
  ON event_tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (buyer_id = auth.uid());

-- Policies for event_requests
CREATE POLICY "Users can view their own requests"
  ON event_requests
  FOR SELECT
  TO authenticated
  USING (requester_id = auth.uid());

CREATE POLICY "Users can create requests"
  ON event_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (requester_id = auth.uid());

-- Function to update event booking count
CREATE OR REPLACE FUNCTION update_event_bookings()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.booking_status = 'confirmed' THEN
    UPDATE wedding_events 
    SET current_bookings = current_bookings + NEW.ticket_quantity
    WHERE id = NEW.event_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.booking_status != 'confirmed' AND NEW.booking_status = 'confirmed' THEN
      UPDATE wedding_events 
      SET current_bookings = current_bookings + NEW.ticket_quantity
      WHERE id = NEW.event_id;
    ELSIF OLD.booking_status = 'confirmed' AND NEW.booking_status != 'confirmed' THEN
      UPDATE wedding_events 
      SET current_bookings = current_bookings - NEW.ticket_quantity
      WHERE id = NEW.event_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger for booking count updates
CREATE TRIGGER update_event_bookings_trigger
  AFTER INSERT OR UPDATE ON event_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_event_bookings();