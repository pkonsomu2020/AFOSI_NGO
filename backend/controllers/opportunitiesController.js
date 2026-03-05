import { supabase } from '../config/supabase.js';

// Get all opportunities
export const getAllOpportunities = async (req, res) => {
  try {
    console.log('📥 Fetching opportunities from Supabase...');
    
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }

    console.log(`✅ Successfully fetched ${data?.length || 0} opportunities`);

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error fetching opportunities:', {
      message: error.message,
      details: error.stack,
      hint: error.hint || '',
      code: error.code || ''
    });
    
    // Provide more helpful error messages
    let errorMessage = 'Failed to fetch opportunities';
    if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
      errorMessage = 'Connection timeout - please check your internet connection and try again';
    } else if (error.message.includes('ENOTFOUND')) {
      errorMessage = 'Cannot reach Supabase - please check your internet connection';
    } else if (error.message.includes('fetch failed')) {
      errorMessage = 'Network error - please check your internet connection and firewall settings';
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get single opportunity
export const getOpportunityById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch opportunity',
      error: error.message
    });
  }
};

// Create new opportunity
export const createOpportunity = async (req, res) => {
  try {
    const { title, type, description, location, duration, deadline } = req.body;

    // Validation
    if (!title || !type || !description || !location || !duration || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (!['employment', 'consulting'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either employment or consulting'
      });
    }

    const { data, error } = await supabase
      .from('opportunities')
      .insert([{
        title,
        type,
        description,
        location,
        duration,
        deadline,
        manually_disabled: false
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Opportunity created successfully',
      data: data
    });
  } catch (error) {
    console.error('Error creating opportunity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create opportunity',
      error: error.message
    });
  }
};

// Update opportunity
export const updateOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, description, location, duration, deadline, manually_disabled } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (type !== undefined) updateData.type = type;
    if (description !== undefined) updateData.description = description;
    if (location !== undefined) updateData.location = location;
    if (duration !== undefined) updateData.duration = duration;
    if (deadline !== undefined) updateData.deadline = deadline;
    if (manually_disabled !== undefined) updateData.manually_disabled = manually_disabled;

    const { data, error } = await supabase
      .from('opportunities')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    res.json({
      success: true,
      message: 'Opportunity updated successfully',
      data: data
    });
  } catch (error) {
    console.error('Error updating opportunity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update opportunity',
      error: error.message
    });
  }
};

// Delete opportunity
export const deleteOpportunity = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('opportunities')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Opportunity deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting opportunity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete opportunity',
      error: error.message
    });
  }
};

// Toggle opportunity status
export const toggleOpportunityStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // First get the current status
    const { data: current, error: fetchError } = await supabase
      .from('opportunities')
      .select('manually_disabled')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Toggle the status
    const { data, error } = await supabase
      .from('opportunities')
      .update({ manually_disabled: !current.manually_disabled })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Opportunity status toggled successfully',
      data: data
    });
  } catch (error) {
    console.error('Error toggling opportunity status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle opportunity status',
      error: error.message
    });
  }
};
