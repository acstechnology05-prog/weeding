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

ALTER TABLE wedding_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_requests ENABLE ROW LEVEL SECURITY;

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

CREATE TRIGGER update_event_bookings_trigger
  AFTER INSERT OR UPDATE ON event_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_event_bookings();