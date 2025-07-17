-- Create products table for supermarket inventory tracking
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255),
  category VARCHAR(255),
  keywords TEXT,
  line_number INTEGER NOT NULL,
  rack_number INTEGER NOT NULL,
  section VARCHAR(10), -- Additional sub-section like A, B, C, etc.
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_products_brand ON products USING gin(to_tsvector('english', brand));
CREATE INDEX IF NOT EXISTS idx_products_category ON products USING gin(to_tsvector('english', category));
CREATE INDEX IF NOT EXISTS idx_products_keywords ON products USING gin(to_tsvector('english', keywords));
CREATE INDEX IF NOT EXISTS idx_products_location ON products (line_number, rack_number, section);
