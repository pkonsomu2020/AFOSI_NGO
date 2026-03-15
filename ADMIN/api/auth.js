import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const JWT_SECRET = process.env.JWT_SECRET || 'afosi-ngo-super-secret-jwt-key-2026';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return res.status(200).json({ success: true, data: decoded });
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
      }

      // Fetch admin user
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (error || !adminUser) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      // Compare password with bcrypt hash
      const isValid = await bcrypt.compare(password, adminUser.password_hash);
      if (!isValid) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', adminUser.id);

      // Generate JWT
      const token = jwt.sign(
        { id: adminUser.id, email: adminUser.email, role: adminUser.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        success: true,
        data: {
          token,
          email: adminUser.email,
          fullName: adminUser.full_name,
          role: adminUser.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
