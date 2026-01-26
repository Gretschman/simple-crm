-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(200),
  job_title VARCHAR(100),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_last_name ON contacts(last_name);
CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function before each update
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (MVP - no authentication required)
-- Allow all operations for everyone (public access)
CREATE POLICY "Enable read access for all users" ON contacts
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert access for all users" ON contacts
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON contacts
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete access for all users" ON contacts
  FOR DELETE
  USING (true);
