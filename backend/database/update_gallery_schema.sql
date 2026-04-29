-- Update gallery_images table to match frontend requirements

-- Add new columns
ALTER TABLE gallery_images 
ADD COLUMN IF NOT EXISTS title VARCHAR(255),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS image_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

-- Copy data from old columns to new columns
UPDATE gallery_images 
SET 
  title = alt,
  description = alt,
  image_url = src
WHERE image_url IS NULL;

-- Update category values to match frontend expectations
-- Map: programs -> Programs, events -> Events, projects -> Projects
UPDATE gallery_images SET category = 'Programs' WHERE category = 'programs';
UPDATE gallery_images SET category = 'Events' WHERE category = 'events';
UPDATE gallery_images SET category = 'Projects' WHERE category = 'projects';

-- Update the CHECK constraint to allow new category values
ALTER TABLE gallery_images DROP CONSTRAINT IF EXISTS gallery_images_category_check;
ALTER TABLE gallery_images ADD CONSTRAINT gallery_images_category_check 
  CHECK (category IN ('Programs', 'Community', 'Youth', 'Events', 'Environment', 'Partners', 'Projects'));

-- Make image_url NOT NULL after data migration
ALTER TABLE gallery_images ALTER COLUMN image_url SET NOT NULL;

-- Create index on featured column for faster queries
CREATE INDEX IF NOT EXISTS idx_gallery_featured ON gallery_images(featured);

-- Note: Keep src and alt columns for backward compatibility with admin panel
-- They will be synced with image_url and description
