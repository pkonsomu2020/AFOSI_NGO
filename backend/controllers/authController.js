import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Login endpoint
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Fetch admin user from Supabase
    const { data: adminUser, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (fetchError || !adminUser) {
      console.error('Admin user not found:', fetchError);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Compare password with stored hash
    const isValidPassword = await bcrypt.compare(password, adminUser.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login timestamp
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', adminUser.id);

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        email: adminUser.email,
        fullName: adminUser.full_name,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Verify token endpoint
export const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    res.json({
      success: true,
      message: 'Token is valid',
      data: decoded
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Middleware to protect routes
export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};
