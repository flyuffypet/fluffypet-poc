-- Create messages table for realtime chat
-- Based on the existing database schema structure

CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  media_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversations table first (if it doesn't exist from the existing schema)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  participants UUID[] NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint for messages -> conversations
ALTER TABLE messages 
ADD CONSTRAINT fk_messages_conversation_id 
FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);

CREATE INDEX IF NOT EXISTS idx_conversations_participants ON conversations USING GIN(participants);
CREATE INDEX IF NOT EXISTS idx_conversations_booking_id ON conversations(booking_id);
CREATE INDEX IF NOT EXISTS idx_conversations_appointment_id ON conversations(appointment_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their conversations" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND auth.uid() = ANY(conversations.participants)
    )
  );

CREATE POLICY "Users can insert messages in their conversations" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND auth.uid() = ANY(conversations.participants)
    )
  );

CREATE POLICY "Users can update messages in their conversations" ON messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND auth.uid() = ANY(conversations.participants)
    )
  );

-- RLS Policies for conversations
CREATE POLICY "Users can view their conversations" ON conversations
  FOR SELECT USING (
    auth.uid() = ANY(participants)
  );

CREATE POLICY "Users can create conversations they participate in" ON conversations
  FOR INSERT WITH CHECK (
    auth.uid() = ANY(participants)
  );

CREATE POLICY "Participants can update conversations" ON conversations
  FOR UPDATE USING (
    auth.uid() = ANY(participants)
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_messages_updated_at_trigger ON messages;
CREATE TRIGGER update_messages_updated_at_trigger
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_messages_updated_at();

DROP TRIGGER IF EXISTS update_conversations_updated_at_trigger ON conversations;
CREATE TRIGGER update_conversations_updated_at_trigger
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_conversations_updated_at();

-- Create trigger to update conversation last_message_at when new message is added
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations 
  SET last_message_at = NEW.created_at 
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_conversation_last_message_trigger ON messages;
CREATE TRIGGER update_conversation_last_message_trigger
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;

-- Helper function to get or create conversation between users
CREATE OR REPLACE FUNCTION get_or_create_conversation(user1_id UUID, user2_id UUID, conversation_title TEXT DEFAULT 'Direct Message')
RETURNS UUID AS $$
DECLARE
  conversation_id UUID;
BEGIN
  -- Try to find existing conversation between these users (direct message)
  SELECT id INTO conversation_id
  FROM conversations
  WHERE participants @> ARRAY[user1_id, user2_id]
    AND array_length(participants, 1) = 2
    AND booking_id IS NULL
    AND appointment_id IS NULL;
  
  -- If no conversation exists, create one
  IF conversation_id IS NULL THEN
    INSERT INTO conversations (participants, title)
    VALUES (ARRAY[user1_id, user2_id], conversation_title)
    RETURNING id INTO conversation_id;
  END IF;
  
  RETURN conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to create conversation for booking
CREATE OR REPLACE FUNCTION create_booking_conversation(p_booking_id UUID)
RETURNS UUID AS $$
DECLARE
  v_conversation_id UUID;
  v_booking RECORD;
BEGIN
  -- Get booking details
  SELECT owner_id, provider_id INTO v_booking 
  FROM bookings 
  WHERE id = p_booking_id;
  
  IF v_booking IS NULL THEN
    RAISE EXCEPTION 'Booking not found';
  END IF;

  -- Get provider user_id
  SELECT user_id INTO v_booking.provider_user_id 
  FROM provider_profiles 
  WHERE id = v_booking.provider_id;

  -- Create conversation
  INSERT INTO conversations (booking_id, participants, title)
  VALUES (
    p_booking_id, 
    ARRAY[v_booking.owner_id, v_booking.provider_user_id], 
    'Booking Conversation'
  )
  RETURNING id INTO v_conversation_id;

  RETURN v_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to create conversation for appointment
CREATE OR REPLACE FUNCTION create_appointment_conversation(p_appointment_id UUID)
RETURNS UUID AS $$
DECLARE
  v_conversation_id UUID;
  v_appointment RECORD;
BEGIN
  -- Get appointment details
  SELECT owner_id, provider_id INTO v_appointment 
  FROM appointments 
  WHERE id = p_appointment_id;
  
  IF v_appointment IS NULL THEN
    RAISE EXCEPTION 'Appointment not found';
  END IF;

  -- Get provider user_id
  SELECT user_id INTO v_appointment.provider_user_id 
  FROM provider_profiles 
  WHERE id = v_appointment.provider_id;

  -- Create conversation
  INSERT INTO conversations (appointment_id, participants, title)
  VALUES (
    p_appointment_id, 
    ARRAY[v_appointment.owner_id, v_appointment.provider_user_id], 
    'Appointment Conversation'
  )
  RETURNING id INTO v_conversation_id;

  RETURN v_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
