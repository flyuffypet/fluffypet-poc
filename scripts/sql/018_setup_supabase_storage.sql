-- Create storage bucket for media files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  false,
  52428800, -- 50MB
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
) ON CONFLICT (id) DO NOTHING;

-- RLS Policies for storage
CREATE POLICY "Users can upload their own files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'media' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'media' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'media' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'media' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Update pet_media table to include storage information
ALTER TABLE pet_media 
ADD COLUMN IF NOT EXISTS storage_bucket TEXT DEFAULT 'media',
ADD COLUMN IF NOT EXISTS storage_path TEXT,
ADD COLUMN IF NOT EXISTS public_url TEXT;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_pet_media_storage_path ON pet_media(storage_path);
CREATE INDEX IF NOT EXISTS idx_pet_media_bucket ON pet_media(storage_bucket);

-- Function to cleanup storage when media record is deleted
CREATE OR REPLACE FUNCTION cleanup_storage_on_media_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Log the cleanup (storage cleanup happens via RLS)
  INSERT INTO audit_logs (
    table_name,
    operation,
    old_data,
    user_id,
    timestamp
  ) VALUES (
    'pet_media',
    'DELETE',
    row_to_json(OLD),
    auth.uid(),
    NOW()
  );
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for cleanup
DROP TRIGGER IF EXISTS trigger_cleanup_storage_on_media_delete ON pet_media;
CREATE TRIGGER trigger_cleanup_storage_on_media_delete
  AFTER DELETE ON pet_media
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_storage_on_media_delete();
