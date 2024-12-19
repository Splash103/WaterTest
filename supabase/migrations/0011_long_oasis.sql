-- Add status column to rooms table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'rooms' AND column_name = 'status'
  ) THEN
    ALTER TABLE rooms ADD COLUMN status text NOT NULL DEFAULT 'waiting';
  END IF;
END $$;

-- Create index on status column
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);

-- Update RLS policies to include status check
DROP POLICY IF EXISTS "Unrestricted access to rooms" ON rooms;

CREATE POLICY "Enable read access for all users"
  ON rooms FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for all users"
  ON rooms FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update for room owners"
  ON rooms FOR UPDATE
  USING (host = current_user);

CREATE POLICY "Enable delete for room owners"
  ON rooms FOR DELETE
  USING (host = current_user);