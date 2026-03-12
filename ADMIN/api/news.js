import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { id, admin, stats, action } = req.query;

    // GET all news (admin)
    if (req.method === 'GET' && admin === 'all') {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_date', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ success: true, data: data || [] });
    }

    // GET stats
    if (req.method === 'GET' && stats === 'true') {
      const { data, error } = await supabase
        .from('news')
        .select('id, is_published, featured');

      if (error) throw error;

      const statsData = {
        total: data.length,
        published: data.filter(n => n.is_published).length,
        featured: data.filter(n => n.featured).length
      };

      return res.status(200).json({ success: true, data: statsData });
    }

    // GET single news
    if (req.method === 'GET' && id) {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }

    // POST create news
    if (req.method === 'POST') {
      const { data, error } = await supabase
        .from('news')
        .insert([req.body])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json({ success: true, data });
    }

    // PUT update news
    if (req.method === 'PUT' && id) {
      const { data, error } = await supabase
        .from('news')
        .update(req.body)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }

    // PATCH toggle publish
    if (req.method === 'PATCH' && id && action === 'toggle-publish') {
      const { data: current, error: fetchError } = await supabase
        .from('news')
        .select('is_published')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const { data, error } = await supabase
        .from('news')
        .update({ is_published: !current.is_published })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }

    // PATCH toggle featured
    if (req.method === 'PATCH' && id && action === 'toggle-featured') {
      const { data: current, error: fetchError } = await supabase
        .from('news')
        .select('featured')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const { data, error } = await supabase
        .from('news')
        .update({ featured: !current.featured })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }

    // DELETE news
    if (req.method === 'DELETE' && id) {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}
