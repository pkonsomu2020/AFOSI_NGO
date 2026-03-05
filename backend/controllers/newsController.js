import { supabase } from '../config/supabase.js';

// Get all published news (public)
export const getAllNews = async (req, res) => {
  try {
    const { category, featured, limit = 10, offset = 0 } = req.query;
    
    let query = supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .order('published_date', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    if (offset) {
      query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news',
      error: error.message
    });
  }
};

// Get all news (admin - includes unpublished)
export const getAllNewsAdmin = async (req, res) => {
  try {
    const { category, is_published, limit = 50, offset = 0 } = req.query;
    
    let query = supabase
      .from('news')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (is_published !== undefined) {
      query = query.eq('is_published', is_published === 'true');
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    if (offset) {
      query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching news (admin):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news',
      error: error.message
    });
  }
};

// Get single news by slug
export const getNewsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    // Increment view count
    await supabase
      .from('news')
      .update({ views: data.views + 1 })
      .eq('id', data.id);

    res.json({
      success: true,
      data: { ...data, views: data.views + 1 }
    });
  } catch (error) {
    console.error('Error fetching news by slug:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news article',
      error: error.message
    });
  }
};

// Get single news by ID (admin)
export const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching news by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news article',
      error: error.message
    });
  }
};

// Create news article
export const createNews = async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      image_url,
      category,
      location,
      published_date,
      is_published,
      featured,
      author,
      tags
    } = req.body;

    // Validation
    if (!title || !slug || !excerpt || !content || !published_date) {
      return res.status(400).json({
        success: false,
        message: 'Title, slug, excerpt, content, and published date are required'
      });
    }

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('news')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A news article with this slug already exists'
      });
    }

    const { data, error } = await supabase
      .from('news')
      .insert([{
        title,
        slug,
        excerpt,
        content,
        image_url,
        category: category || 'general',
        location,
        published_date,
        is_published: is_published !== undefined ? is_published : true,
        featured: featured || false,
        author,
        tags: tags || []
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'News article created successfully',
      data: data
    });
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create news article',
      error: error.message
    });
  }
};

// Update news article
export const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If slug is being updated, check if it's unique
    if (updateData.slug) {
      const { data: existing } = await supabase
        .from('news')
        .select('id')
        .eq('slug', updateData.slug)
        .neq('id', id)
        .single();

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'A news article with this slug already exists'
        });
      }
    }

    const { data, error } = await supabase
      .from('news')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    res.json({
      success: true,
      message: 'News article updated successfully',
      data: data
    });
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update news article',
      error: error.message
    });
  }
};

// Delete news article
export const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'News article deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete news article',
      error: error.message
    });
  }
};

// Toggle publish status
export const togglePublishStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Get current status
    const { data: current, error: fetchError } = await supabase
      .from('news')
      .select('is_published')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Toggle status
    const { data, error } = await supabase
      .from('news')
      .update({ is_published: !current.is_published })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Publish status toggled successfully',
      data: data
    });
  } catch (error) {
    console.error('Error toggling publish status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle publish status',
      error: error.message
    });
  }
};

// Toggle featured status
export const toggleFeaturedStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Get current status
    const { data: current, error: fetchError } = await supabase
      .from('news')
      .select('featured')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Toggle status
    const { data, error } = await supabase
      .from('news')
      .update({ featured: !current.featured })
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

// Get news statistics
export const getNewsStats = async (req, res) => {
  try {
    const { data: allNews, error: allError } = await supabase
      .from('news')
      .select('id, is_published, views, category');

    if (allError) throw allError;

    const stats = {
      total: allNews.length,
      published: allNews.filter(n => n.is_published).length,
      unpublished: allNews.filter(n => !n.is_published).length,
      totalViews: allNews.reduce((sum, n) => sum + (n.views || 0), 0),
      byCategory: {}
    };

    // Count by category
    allNews.forEach(news => {
      const cat = news.category || 'general';
      stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching news stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news statistics',
      error: error.message
    });
  }
};
