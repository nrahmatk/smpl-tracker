-- Migrate aisle_line to line_number and add section column
-- This script updates the existing table structure

-- Add the new column if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS section VARCHAR(10);

-- Add line_number column if it doesn't exist and copy data from aisle_line
DO $$
BEGIN
    -- Check if line_number column exists, if not add it and migrate data
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'line_number') THEN
        ALTER TABLE products ADD COLUMN line_number INTEGER;
        UPDATE products SET line_number = aisle_line WHERE line_number IS NULL;
        ALTER TABLE products ALTER COLUMN line_number SET NOT NULL;
        
        -- Drop the old column
        ALTER TABLE products DROP COLUMN IF EXISTS aisle_line;
    END IF;
END $$;

-- Update indexes
DROP INDEX IF EXISTS idx_products_location;
CREATE INDEX IF NOT EXISTS idx_products_location ON products (line_number, rack_number, section);
