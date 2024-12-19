/*
  # Add status column to rooms table

  1. Changes
    - Add status column to rooms table with type text and default value 'waiting'
    - Add check constraint to ensure valid status values
    - Add index on status column for better query performance

  2. Security
    - No changes to RLS policies needed
*/

-- Add status column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'rooms' AND column_name = 'status'
  ) THEN
    ALTER TABLE rooms 
    ADD COLUMN status text NOT NULL DEFAULT 'waiting'
    CHECK (status IN ('waiting', 'playing', 'finished'));
  END IF;
END $$;

-- Create index for status column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'rooms' AND indexname = 'idx_rooms_status'
  ) THEN
    CREATE INDEX idx_rooms_status ON rooms(status);
  END IF;
END $$;