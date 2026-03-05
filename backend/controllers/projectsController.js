import { supabase } from '../config/supabase.js';

// Get project by slug (public)
export const getProjectBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
      error: error.message
    });
  }
};

// Get all projects (public)
export const getAllProjects = async (req, res) => {
  try {
    const { featured, limit } = req.query;
    
    let query = supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
};

// Get single project by ID
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
      error: error.message
    });
  }
};

// Create new project (admin)
export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      image_url,
      icon,
      beneficiaries,
      duration,
      highlights,
      link,
      is_external,
      is_featured,
      display_order,
      has_subpage,
      excerpt,
      full_content,
      slug
    } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    // Generate slug if not provided
    const projectSlug = slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const { data, error } = await supabase
      .from('projects')
      .insert([{
        title,
        description,
        image_url,
        icon: icon || 'Lightbulb',
        beneficiaries,
        duration,
        highlights: highlights || [],
        link,
        is_external: is_external || false,
        is_featured: is_featured || false,
        display_order: display_order || 0,
        has_subpage: has_subpage || false,
        excerpt: excerpt || description.substring(0, 200) + '...',
        full_content: full_content || description,
        slug: projectSlug
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: data
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
};

// Update project (admin)
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: data
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message
    });
  }
};

// Delete project (admin)
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
};

// Toggle featured status (admin)
export const toggleFeaturedStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Get current status
    const { data: current, error: fetchError } = await supabase
      .from('projects')
      .select('is_featured')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Toggle status
    const { data, error } = await supabase
      .from('projects')
      .update({ is_featured: !current.is_featured })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Featured status toggled successfully',
      data: data
    });
  } catch (error) {
    console.error('Error toggling featured status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle featured status',
      error: error.message
    });
  }
};
