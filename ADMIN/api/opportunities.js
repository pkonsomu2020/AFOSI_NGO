import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { id, action } = req.query;

    // GET all opportunities
    if (req.method === 'GET' && !id) {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.status(200).json({
        success: true,
        data: data || []
      });
    }

    // GET single opportunity
    if (req.method === 'GET' && id) {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return res.status(200).json({
        success: true,
        data
      });
    }

    // POST create opportunity
    if (req.method === 'POST') {
      const { data, error } = await supabase
        .from('opportunities')
        .insert([req.body])
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({
        success: true,
        data
      });
    }

    // PUT update opportunity
    if (req.method === 'PUT' && id) {
      const { data, error } = await supabase
        .from('opportunities')
        .update(req.body)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({
        success: true,
        data
      });
    }

    // PATCH toggle status
    if (req.method === 'PATCH' && id && action === 'toggle') {
      // Get current status
      const { data: current, error: fetchError } = await supabase
        .from('opportunities')
        .select('manually_disabled')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Toggle status
      const { data, error } = await supabase
        .from('opportunities')
        .update({ manually_disabled: !current.manually_disabled })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({
        success: true,
        data
      });
    }

    // DELETE opportunity
    if (req.method === 'DELETE' && id) {
      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: 'Deleted successfully'
      });
    }

    res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
