import { supabase } from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';

// Upload file (image or PDF) to Supabase Storage with retry logic
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const file = req.file;
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    
    // Determine folder based on file type
    const isPdf = file.mimetype === 'application/pdf';
    const folder = isPdf ? 'newsletters' : 'gallery';
    const filePath = `${folder}/${fileName}`;

    console.log(`Uploading ${isPdf ? 'PDF' : 'image'}: ${file.originalname} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

    // Upload to Supabase Storage with retry logic
    let uploadData, uploadError;
    let retries = 3;
    
    while (retries > 0) {
      const result = await supabase.storage
        .from('afosi-images')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
          cacheControl: '3600'
        });

      uploadData = result.data;
      uploadError = result.error;

      if (!uploadError) {
        break; // Success
      }

      // If it's a network error, retry
      if (uploadError.message?.includes('fetch failed') || 
          uploadError.message?.includes('timeout') ||
          uploadError.status === 502) {
        retries--;
        if (retries > 0) {
          console.log(`Upload failed, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
          continue;
        }
      }
      
      // If it's not a network error or we're out of retries, break
      break;
    }

    if (uploadError) {
      console.error('Upload error:', uploadError);
      
      // Provide more helpful error messages
      if (uploadError.status === 502) {
        throw new Error('Supabase server is temporarily unavailable. Please try again in a moment.');
      } else if (uploadError.message?.includes('timeout')) {
        throw new Error('Upload timed out. The file may be too large or your connection is slow.');
      } else if (uploadError.message?.includes('fetch failed')) {
        throw new Error('Network connection failed. Please check your internet connection.');
      } else {
        throw uploadError;
      }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('afosi-images')
      .getPublicUrl(filePath);

    console.log(`Upload successful: ${publicUrl}`);

    res.status(201).json({
      success: true,
      message: `${isPdf ? 'PDF' : 'Image'} uploaded successfully`,
      url: publicUrl,
      data: {
        url: publicUrl,
        path: filePath,
        fileName: fileName,
        type: isPdf ? 'pdf' : 'image'
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      error: error.message
    });
  }
};

// Delete file from Supabase Storage
export const deleteFile = async (req, res) => {
  try {
    const { path } = req.body;

    if (!path) {
      return res.status(400).json({
        success: false,
        message: 'File path is required'
      });
    }

    // Delete from Supabase Storage
    const { error } = await supabase.storage
      .from('afosi-images')
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      throw error;
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file',
      error: error.message
    });
  }
};
