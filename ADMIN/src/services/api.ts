// Use relative URLs for Vercel serverless functions
const API_BASE_URL = '/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('afosi_admin_token');
};

// Generic fetch wrapper with error handling
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // If unauthorized, clear auth and reload
      if (response.status === 401) {
        localStorage.removeItem('afosi_admin_auth');
        localStorage.removeItem('afosi_admin_token');
        window.location.reload();
      }
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Auth API
export const authAPI = {
  login: (email: string, password: string) => 
    fetchAPI('/auth', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  verify: () => fetchAPI('/auth'),
};

// Opportunities API
export const opportunitiesAPI = {
  getAll: () => fetchAPI('/opportunities'),
  
  getById: (id: string) => fetchAPI(`/opportunities?id=${id}`),
  
  create: (data: {
    title: string;
    type: 'employment' | 'consulting';
    description: string;
    location: string;
    duration: string;
    deadline: string;
  }) => fetchAPI('/opportunities', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: Partial<{
    title: string;
    type: 'employment' | 'consulting';
    description: string;
    location: string;
    duration: string;
    deadline: string;
    manually_disabled: boolean;
  }>) => fetchAPI(`/opportunities?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => fetchAPI(`/opportunities?id=${id}`, {
    method: 'DELETE',
  }),
  
  toggleStatus: (id: string) => fetchAPI(`/opportunities?id=${id}&action=toggle`, {
    method: 'PATCH',
  }),
};

// Gallery API
export const galleryAPI = {
  getAll: (category?: string) => {
    const query = category && category !== 'all' ? `?category=${category}` : '';
    return fetchAPI(`/gallery${query}`);
  },
  
  getById: (id: string) => fetchAPI(`/gallery?id=${id}`),
  
  create: (data: {
    src: string;
    category: 'programs' | 'events' | 'projects';
    alt: string;
  }) => fetchAPI('/gallery', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: Partial<{
    src: string;
    category: 'programs' | 'events' | 'projects';
    alt: string;
  }>) => fetchAPI(`/gallery?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => fetchAPI(`/gallery?id=${id}`, {
    method: 'DELETE',
  }),
};

// Upload API - Direct to Supabase (supports large files)
export const uploadAPI = {
  uploadImage: async (file: File) => {
    // For large files, upload directly to Supabase
    if (file.size > 5 * 1024 * 1024) { // > 5MB
      return uploadDirectToSupabase(file);
    }

    // For small files, use serverless function
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const base64 = await base64Promise;

    const response = await fetchAPI('/upload', {
      method: 'POST',
      body: JSON.stringify({
        file: base64,
        fileName: file.name,
        fileType: file.type
      }),
    });

    return response;
  },

  uploadFile: async (formData: FormData) => {
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    // For large files, upload directly to Supabase
    if (file.size > 5 * 1024 * 1024) { // > 5MB
      return uploadDirectToSupabase(file);
    }

    // For small files, use serverless function
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const base64 = await base64Promise;

    const response = await fetchAPI('/upload', {
      method: 'POST',
      body: JSON.stringify({
        file: base64,
        fileName: file.name,
        fileType: file.type
      }),
    });

    return response;
  },
};

// Direct upload to Supabase for large files (up to 100MB)
async function uploadDirectToSupabase(file: File) {
  const SUPABASE_URL = 'https://pmigmljjnyucethipdtk.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtaWdtbGpqbnl1Y2V0aGlwZHRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTU4NjMsImV4cCI6MjA4NzE5MTg2M30.E-AnMPDiMK6PeMZAIWWtk3gD1nGDMx46RBnHdto8nJc';

  const timestamp = Date.now();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `${timestamp}-${sanitizedFileName}`;

  try {
    // Upload directly to Supabase Storage
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${SUPABASE_URL}/storage/v1/object/afosi-files/${filePath}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: file,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    // Get public URL
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/afosi-files/${filePath}`;

    return {
      success: true,
      data: {
        url: publicUrl,
        path: filePath,
        fileName: sanitizedFileName
      },
      message: 'File uploaded successfully'
    };
  } catch (error: any) {
    console.error('Direct upload error:', error);
    throw new Error(error.message || 'Upload failed');
  }
}

// News API
export const newsAPI = {
  getAll: (params?: { category?: string; is_published?: boolean; limit?: number; offset?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.is_published !== undefined) queryParams.append('is_published', String(params.is_published));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.offset) queryParams.append('offset', String(params.offset));
    
    const query = queryParams.toString();
    return fetchAPI(`/news?admin=all${query ? `&${query}` : ''}`);
  },
  
  getById: (id: string) => fetchAPI(`/news?id=${id}`),
  
  getStats: () => fetchAPI('/news?stats=true'),
  
  create: (data: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image_url?: string;
    category?: string;
    location?: string;
    published_date: string;
    is_published?: boolean;
    featured?: boolean;
    author?: string;
    tags?: string[];
  }) => fetchAPI('/news', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: Partial<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image_url: string;
    category: string;
    location: string;
    published_date: string;
    is_published: boolean;
    featured: boolean;
    author: string;
    tags: string[];
  }>) => fetchAPI(`/news?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => fetchAPI(`/news?id=${id}`, {
    method: 'DELETE',
  }),
  
  togglePublish: (id: string) => fetchAPI(`/news?id=${id}&action=toggle-publish`, {
    method: 'PATCH',
  }),
  
  toggleFeatured: (id: string) => fetchAPI(`/news?id=${id}&action=toggle-featured`, {
    method: 'PATCH',
  }),
};

// Projects API
export const projectsAPI = {
  getAll: (params?: { featured?: boolean; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.featured !== undefined) queryParams.append('featured', String(params.featured));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    
    const query = queryParams.toString();
    return fetchAPI(`/projects${query ? `?${query}` : ''}`);
  },
  
  getById: (id: string) => fetchAPI(`/projects?id=${id}`),
  
  create: (data: {
    title: string;
    description: string;
    image_url?: string;
    icon?: string;
    beneficiaries?: string;
    duration?: string;
    highlights?: string[];
    link?: string;
    is_external?: boolean;
    is_featured?: boolean;
    display_order?: number;
  }) => fetchAPI('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: Partial<{
    title: string;
    description: string;
    image_url: string;
    icon: string;
    beneficiaries: string;
    duration: string;
    highlights: string[];
    link: string;
    is_external: boolean;
    is_featured: boolean;
    display_order: number;
  }>) => fetchAPI(`/projects?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => fetchAPI(`/projects?id=${id}`, {
    method: 'DELETE',
  }),
  
  toggleFeatured: (id: string) => fetchAPI(`/projects?id=${id}&action=toggle-featured`, {
    method: 'PATCH',
  }),
};
