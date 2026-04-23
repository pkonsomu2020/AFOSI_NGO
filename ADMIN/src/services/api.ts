// Use relative URLs - proxied to backend via nginx on cPanel, or serverless on Vercel
const API_BASE_URL = '/api';

const getAuthToken = () => localStorage.getItem('afosi_admin_token');

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
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  verify: () => fetchAPI('/auth/verify'),
};

// Opportunities API - backend uses /:id path params
export const opportunitiesAPI = {
  getAll: () => fetchAPI('/opportunities'),
  getById: (id: string) => fetchAPI(`/opportunities/${id}`),
  getBySlug: (slug: string) => fetchAPI(`/opportunities/slug/${slug}`),
  create: (data: {
    title: string;
    type: 'employment' | 'consulting';
    description: string;
    location: string;
    duration: string;
    deadline: string;
    slug?: string;
    full_description?: string;
    apply_link?: string;
  }) => fetchAPI('/opportunities', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<{
    title: string;
    type: 'employment' | 'consulting';
    description: string;
    location: string;
    duration: string;
    deadline: string;
    manually_disabled: boolean;
    slug: string;
    full_description: string;
    apply_link: string;
  }>) => fetchAPI(`/opportunities/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI(`/opportunities/${id}`, { method: 'DELETE' }),
  toggleStatus: (id: string) => fetchAPI(`/opportunities/${id}/toggle`, { method: 'PATCH' }),
};

// Gallery API - backend uses /:id path params
export const galleryAPI = {
  getAll: (category?: string) => {
    const query = category && category !== 'all' ? `?category=${category}` : '';
    return fetchAPI(`/gallery${query}`);
  },
  getById: (id: string) => fetchAPI(`/gallery/${id}`),
  create: (data: {
    src: string;
    category: 'programs' | 'events' | 'projects';
    alt: string;
  }) => fetchAPI('/gallery', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<{
    src: string;
    category: 'programs' | 'events' | 'projects';
    alt: string;
  }>) => fetchAPI(`/gallery/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI(`/gallery/${id}`, { method: 'DELETE' }),
};

// News API - backend uses /admin/* protected routes
export const newsAPI = {
  getAll: () => fetchAPI('/news/admin/all'),
  getById: (id: string) => fetchAPI(`/news/admin/${id}`),
  getStats: () => fetchAPI('/news/admin/stats'),
  create: (data: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image_url?: string;
    pdf_url?: string;
    category?: string;
    location?: string;
    published_date: string;
    is_published?: boolean;
    featured?: boolean;
    author?: string;
    tags?: string[];
  }) => fetchAPI('/news/admin', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image_url: string;
    pdf_url: string;
    category: string;
    location: string;
    published_date: string;
    is_published: boolean;
    featured: boolean;
    author: string;
    tags: string[];
  }>) => fetchAPI(`/news/admin/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI(`/news/admin/${id}`, { method: 'DELETE' }),
  togglePublish: (id: string) => fetchAPI(`/news/admin/${id}/toggle-publish`, { method: 'PATCH' }),
  toggleFeatured: (id: string) => fetchAPI(`/news/admin/${id}/toggle-featured`, { method: 'PATCH' }),
};

// Projects API - backend uses /:id path params
export const projectsAPI = {
  getAll: (params?: { featured?: boolean; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.featured !== undefined) queryParams.append('featured', String(params.featured));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    const query = queryParams.toString();
    return fetchAPI(`/projects${query ? `?${query}` : ''}`);
  },
  getById: (id: string) => fetchAPI(`/projects/${id}`),
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
  }) => fetchAPI('/projects', { method: 'POST', body: JSON.stringify(data) }),
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
  }>) => fetchAPI(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI(`/projects/${id}`, { method: 'DELETE' }),
  toggleFeatured: (id: string) => fetchAPI(`/projects/${id}/toggle-featured`, { method: 'PATCH' }),
};

// Direct upload to Supabase Storage (supports up to 100MB)
// Routes to correct bucket based on file type
async function uploadDirectToSupabase(file: File, bucket: string = 'afosi-images') {
  const SUPABASE_URL = 'https://pmigmljjnyucethipdtk.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtaWdtbGpqbnl1Y2V0aGlwZHRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTU4NjMsImV4cCI6MjA4NzE5MTg2M30.E-AnMPDiMK6PeMZAIWWtk3gD1nGDMx46RBnHdto8nJc';

  const timestamp = Date.now();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `${timestamp}-${sanitizedFileName}`;

  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${bucket}/${filePath}`,
    {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` },
      body: file,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Upload failed');
  }

  return {
    success: true,
    data: {
      url: `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${filePath}`,
      path: filePath,
      fileName: sanitizedFileName
    },
    message: 'File uploaded successfully'
  };
}

// Upload API - routes to correct bucket by context
export const uploadAPI = {
  // Gallery images → afosi-images
  uploadImage: async (file: File) => uploadDirectToSupabase(file, 'afosi-images'),

  // Generic upload - detects bucket by file type and context
  uploadFile: async (formData: FormData, context: 'news' | 'projects' | 'gallery' = 'news') => {
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');
    const bucket = context === 'projects' ? 'afosi-projects' : context === 'gallery' ? 'afosi-images' : 'afosi-news';
    return uploadDirectToSupabase(file, bucket);
  },

  // Explicit bucket uploads
  uploadNewsFile: async (file: File) => uploadDirectToSupabase(file, 'afosi-news'),
  uploadProjectImage: async (file: File) => uploadDirectToSupabase(file, 'afosi-projects'),
};
