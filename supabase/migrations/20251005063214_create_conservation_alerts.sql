/*
  # Create Conservation Alerts and Fish Breeding Seasons Schema

  1. New Tables
    - `fish_species`
      - `id` (uuid, primary key)
      - `name` (text)
      - `scientific_name` (text)
      - `status` (text) - conservation status
      - `breeding_months` (integer array) - months when breeding occurs
      - `description` (text)
      - `image_url` (text)
      - `threat_level` (text)
      - `created_at` (timestamptz)
    
    - `conservation_alerts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `fish_species_id` (uuid, references fish_species)
      - `alert_type` (text) - breeding_season, endangered, etc.
      - `message` (text)
      - `is_read` (boolean)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public can read fish species data
    - Users can manage their own alerts
*/

-- Create fish_species table
CREATE TABLE IF NOT EXISTS fish_species (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  scientific_name text,
  status text DEFAULT 'stable',
  breeding_months integer[] DEFAULT ARRAY[]::integer[],
  description text DEFAULT '',
  image_url text,
  threat_level text DEFAULT 'low',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE fish_species ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fish species are viewable by everyone"
  ON fish_species FOR SELECT
  TO public
  USING (true);

-- Create conservation_alerts table
CREATE TABLE IF NOT EXISTS conservation_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  fish_species_id uuid REFERENCES fish_species(id) ON DELETE CASCADE,
  alert_type text NOT NULL DEFAULT 'breeding_season',
  message text NOT NULL,
  is_read boolean DEFAULT false,
  latitude numeric,
  longitude numeric,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE conservation_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conservation alerts"
  ON conservation_alerts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conservation alerts"
  ON conservation_alerts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conservation alerts"
  ON conservation_alerts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own conservation alerts"
  ON conservation_alerts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert sample fish species data with breeding seasons
INSERT INTO fish_species (name, scientific_name, status, breeding_months, description, threat_level) VALUES
('Atlantic Bluefin Tuna', 'Thunnus thynnus', 'endangered', ARRAY[4,5,6], 'Large migratory fish, critically endangered due to overfishing', 'critical'),
('Atlantic Cod', 'Gadus morhua', 'vulnerable', ARRAY[1,2,3], 'Important commercial fish species with depleted populations', 'high'),
('European Sea Bass', 'Dicentrarchus labrax', 'stable', ARRAY[3,4,5,6], 'Popular sport and food fish, breeding in spring and summer', 'medium'),
('Red Snapper', 'Lutjanus campechanus', 'vulnerable', ARRAY[5,6,7,8,9], 'Reef-dwelling species with long breeding season', 'high'),
('Yellowfin Tuna', 'Thunnus albacares', 'near_threatened', ARRAY[1,2,3,11,12], 'Important commercial species breeding mostly in winter', 'medium'),
('Sockeye Salmon', 'Oncorhynchus nerka', 'stable', ARRAY[7,8,9], 'Anadromous species returning to freshwater to spawn', 'medium'),
('Grouper', 'Epinephelus spp.', 'endangered', ARRAY[4,5,6,7], 'Slow-growing reef fish vulnerable to overfishing', 'critical'),
('Mahi-Mahi', 'Coryphaena hippurus', 'stable', ARRAY[1,2,3,4,5,10,11,12], 'Fast-growing pelagic fish with extended breeding', 'low'),
('Swordfish', 'Xiphias gladius', 'stable', ARRAY[1,2,3,9,10,11,12], 'Large predatory fish breeding year-round in warm waters', 'medium'),
('Haddock', 'Melanogrammus aeglefinus', 'vulnerable', ARRAY[2,3,4], 'Cold-water species with spring breeding season', 'high')
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_conservation_alerts_user_id ON conservation_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_conservation_alerts_created_at ON conservation_alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_fish_species_breeding_months ON fish_species USING GIN(breeding_months);
