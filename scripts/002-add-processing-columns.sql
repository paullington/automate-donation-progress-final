-- Migration: Add processing status and share tracking tables
-- This script adds the new columns for tracking donation processing status
-- and creates the shares table for tracking social shares

-- Add new columns to donations table (only if they don't exist)
ALTER TABLE public.donations
  ADD COLUMN IF NOT EXISTS transaction_type TEXT,
  ADD COLUMN IF NOT EXISTS is_processed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_duplicate BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS duplicate_of_id INTEGER,
  ADD COLUMN IF NOT EXISTS processing_notes TEXT,
  ADD COLUMN IF NOT EXISTS file_hash TEXT;

-- Create shares table for tracking social shares
CREATE TABLE IF NOT EXISTS public.shares (
  id SERIAL PRIMARY KEY,
  platform TEXT NOT NULL UNIQUE,
  count INTEGER DEFAULT 0,
  last_updated TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Initialize share platforms
INSERT INTO public.shares (platform, count)
  VALUES
    ('whatsapp', 0),
    ('facebook', 0),
    ('twitter', 0),
    ('linkedin', 0),
    ('telegram', 0),
    ('email', 0),
    ('direct', 0)
  ON CONFLICT (platform) DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_donations_is_processed ON public.donations(is_processed);
CREATE INDEX IF NOT EXISTS idx_donations_is_duplicate ON public.donations(is_duplicate);
CREATE INDEX IF NOT EXISTS idx_donations_transaction_type ON public.donations(transaction_type);
CREATE INDEX IF NOT EXISTS idx_donations_donor_email ON public.donations(donor_email);
CREATE INDEX IF NOT EXISTS idx_donations_file_hash ON public.donations(file_hash);

COMMIT;
