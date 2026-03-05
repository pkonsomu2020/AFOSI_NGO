const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  verify: () => fetchAPI('/auth/verify'),
};

// Opportunities API
export const opportunitiesAPI = {
  getAll: () => fetchAPI('/opportunities'),
  
  getById: (id: string) => fetchAPI(`/opportunities/${id}`),
  
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
  }>) => fetchAPI(`/opportunities/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => fetchAPI(`/opportunities/${id}`, {
    method: 'DELETE',
  }),
  
  toggleStatus: (id: string) => fetchAPI(`/opportunities/${id}/toggle`, {
    method: 'PATCH',
  }),
};

// Gallery API
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
  }) => fetchAPI('/gallery', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: Partial<{
    src: string;
    category: 'programs' | 'events' | 'projects';
    alt: string;
  }>) => fetchAPI(`/gallery/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => fetchAPI(`/gallery/${id}`, {
    method: 'DELETE',
  }),
};

// Upload API
export const uploadAPI = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${API_BASE_URL}/upload`;
    const token = getAuthToken();
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        // Don't set Content-Type header - browser will set it with boundary
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      return data;
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  },

  uploadFile: async (formData: FormData) => {
    const url = `${API_BASE_URL}/upload`;
    const token = getAuthToken();
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        // Don't set Content-Type header - browser will set it with boundary
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      return data;
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  },
};

// News API
export const newsAPI = {
  getAll: (params?: { category?: string; is_published?: boolean; limit?: number; offset?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.is_published !== undefined) queryParams.append('is_published', String(params.is_published));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.offset) queryParams.append('offset', String(params.offset));
    
    const query = queryParams.toString();
    return fetchAPI(`/news/admin/all${query ? `?${query}` : ''}`);
  },
  
  getById: (id: string) => fetchAPI(`/news/admin/${id}`),
  
  getStats: () => fetchAPI('/news/admin/stats'),
  
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
  }) => fetchAPI('/news/admin', {
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
  }>) => fetchAPI(`/news/admin/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => fetchAPI(`/news/admin/${id}`, {
    method: 'DELETE',
  }),
  
  togglePublish: (id: string) => fetchAPI(`/news/admin/${id}/toggle-publish`, {
    method: 'PATCH',
  }),
  
  toggleFeatured: (id: string) => fetchAPI(`/news/admin/${id}/toggle-featured`, {
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
  }>) => fetchAPI(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => fetchAPI(`/projects/${id}`, {
    method: 'DELETE',
  }),
  
  toggleFeatured: (id: string) => fetchAPI(`/projects/${id}/toggle-featured`, {
    method: 'PATCH',
  }),
};
