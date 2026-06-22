-- Run this ONCE against your production database (e.g. in the Neon SQL Editor)
-- before the first deployment, so the donation upload endpoint has a table to
-- write to. Safe to re-run: it only creates objects if they don't already exist.

CREATE TABLE IF NOT EXISTS public.donations (
  id                  SERIAL PRIMARY KEY,
  donor_name          TEXT,
  donor_email         TEXT,
  receipt_file_name   TEXT        NOT NULL,
  receipt_pathname    TEXT        NOT NULL,
  receipt_url         TEXT,
  amount              TEXT,
  notes               TEXT,
  created_at          TIMESTAMP   NOT NULL DEFAULT now(),
  updated_at          TIMESTAMP   NOT NULL DEFAULT now()
);

-- Speeds up the admin dashboard, which lists newest donations first.
CREATE INDEX IF NOT EXISTS donations_created_at_idx
  ON public.donations (created_at DESC);
