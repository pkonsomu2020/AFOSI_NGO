const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Generic fetch wrapper with error handling
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Opportunities API
export const opportunitiesAPI = {
  getAll: () => fetchAPI('/opportunities'),
  
  getById: (id: string) => fetchAPI(`/opportunities/${id}`),
};

// Gallery API
export const galleryAPI = {
  getAll: (category?: string) => {
    const query = category && category !== 'all' ? `?category=${category}` : '';
    return fetchAPI(`/gallery${query}`);
  },
  
  getById: (id: string) => fetchAPI(`/gallery/${id}`),
};

// News API
export const newsAPI = {
  getAll: (params?: { category?: string; featured?: boolean; limit?: number; offset?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.featured !== undefined) queryParams.append('featured', String(params.featured));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.offset) queryParams.append('offset', String(params.offset));
    
    const query = queryParams.toString();
    return fetchAPI(`/news${query ? `?${query}` : ''}`);
  },
  
  getBySlug: (slug: string) => fetchAPI(`/news/slug/${slug}`),
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
};
