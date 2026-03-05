import { supabase } from '../config/supabase.js';

// Get all gallery images
export const getAllImages = async (req, res) => {
  try {
    const { category } = req.query;

    let query = supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery images',
      error: error.message
    });
  }
};

// Get single image
export const getImageById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch image',
      error: error.message
    });
  }
};

// Create new image
export const createImage = async (req, res) => {
  try {
    const { src, category, alt } = req.body;

    // Validation
    if (!src || !category || !alt) {
      return res.status(400).json({
        success: false,
        message: 'All fields (src, category, alt) are required'
      });
    }

    if (!['programs', 'events', 'projects'].includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Category must be programs, events, or projects'
      });
    }

    const { data, error } = await supabase
      .from('gallery_images')
      .insert([{
        src,
        category,
        alt
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Image added successfully',
      data: data
    });
  } catch (error) {
    console.error('Error creating image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add image',
      error: error.message
    });
  }
};

// Update image
export const updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { src, category, alt } = req.body;

    const updateData = {};
    if (src !== undefined) updateData.src = src;
    if (category !== undefined) {
      if (!['programs', 'events', 'projects'].includes(category)) {
        return res.status(400).json({
          success: false,
          message: 'Category must be programs, events, or projects'
        });
      }
      updateData.category = category;
    }
    if (alt !== undefined) updateData.alt = alt;

    const { data, error } = await supabase
      .from('gallery_images')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    res.json({
      success: true,
      message: 'Image updated successfully',
      data: data
    });
  } catch (error) {
    console.error('Error updating image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update image',
      error: error.message
    });
  }
};

// Delete image
export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    // First get the image to find its storage path
    const { data: image, error: fetchError } = await supabase
      .from('gallery_images')
      .select('src')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Delete from database
    const { error: dbError } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    // If image is from Supabase Storage (contains supabase.co), delete from storage
    if (image && image.src && image.src.includes('supabase.co')) {
      try {
        // Extract path from URL
        const urlParts = image.src.split('/storage/v1/object/public/afosi-images/');
        if (urlParts.length > 1) {
          const storagePath = urlParts[1];
          await supabase.storage
            .from('afosi-images')
            .remove([storagePath]);
        }
      } catch (storageError) {
        console.error('Error deleting from storage:', storageError);
        // Continue even if storage deletion fails
      }
    }

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
};
