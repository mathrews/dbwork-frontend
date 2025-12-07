/*
  # Create customers table

  1. New Tables
    - `customers`
      - `id` (uuid, primary key) - Unique identifier for each customer
      - `name` (text) - Customer full name
      - `email` (text) - Customer email address
      - `phone` (text) - Customer phone number
      - `company` (text) - Company name
      - `created_at` (timestamptz) - Timestamp of record creation
      - `updated_at` (timestamptz) - Timestamp of last update

  2. Security
    - Enable RLS on `customers` table
    - Add policies for public access (for demo purposes)
    - Anyone can view, insert, update, and delete customers
*/

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  company text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view customers"
  ON customers
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert customers"
  ON customers
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update customers"
  ON customers
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete customers"
  ON customers
  FOR DELETE
  USING (true);