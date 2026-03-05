import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Please check your backend/.env file');
  throw new Error('Missing Supabase environment variables');
}

console.log('✅ Supabase URL configured:', supabaseUrl);

// Create Supabase client with extended timeout and retry logic
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  },
  global: {
    headers: {
      'x-client-info': 'afosi-backend'
    },
    fetch: (url, options = {}) => {
      // Add timeout and retry logic
      const timeout = 30000; // 30 seconds
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      return fetch(url, {
        ...options,
        signal: controller.signal,
        // Add keepalive for better connection handling
        keepalive: true
      })
        .then(response => {
          clearTimeout(timeoutId);
          return response;
        })
        .catch(error => {
          clearTimeout(timeoutId);
          if (error.name === 'AbortError') {
            console.error('❌ Supabase request timeout after 30s');
            throw new Error('Request timeout - please check your internet connection');
          }
          throw error;
        });
    }
  },
  db: {
    schema: 'public'
  }
});

// Test connection on startup
(async () => {
  try {
    console.log('🔄 Testing Supabase connection...');
    const { data, error } = await supabase
      .from('opportunities')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error.message);
      console.error('Please check:');
      console.error('1. Your internet connection');
      console.error('2. Supabase URL is correct');
      console.error('3. Supabase service key is valid');
      console.error('4. Firewall is not blocking the connection');
    } else {
      console.log('✅ Supabase connection successful!');
    }
  } catch (error) {
    console.error('❌ Supabase connection error:', error.message);
    console.error('The backend will continue running, but database operations may fail.');
  }
})();
