const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.afosi.org/api';

// ── Safe response parser ────────────────────────────────────────────────────────
// The server occasionally returns plain-text errors (e.g. "Too many requests")
// instead of JSON. Calling .json() on those throws a SyntaxError that surfaces
// as the confusing "Unexpected token 'T'" crash. This helper always reads the
// raw text first, then tries to parse it – so we always get a clean error.
async function safeParseJSON(response: Response): Promise<any> {
  const text = await response.text();
  if (!text || text.trim() === '') return null;
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(text.trim());
  }
}

// ── Exponential backoff retry ───────────────────────────────────────────────────
// On HTTP 429 (Too Many Requests) we wait and retry up to MAX_RETRIES times.
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

async function fetchWithRetry(
  url: string,
  config: RequestInit,
  attempt = 0
): Promise<Response> {
  const response = await fetch(url, config);

  if (response.status === 429 && attempt < MAX_RETRIES) {
    const retryAfter = response.headers.get('Retry-After');
    const delay = retryAfter
      ? parseInt(retryAfter, 10) * 1000
      : BASE_DELAY_MS * Math.pow(2, attempt); // 1 s → 2 s → 4 s

    console.warn(`[API] Rate limited. Retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return fetchWithRetry(url, config, attempt + 1);
  }

  return response;
}

// ── Core fetch wrapper ────────────────────────────────────────────────────────
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
    const response = await fetchWithRetry(url, config);
    const data = await safeParseJSON(response);

    if (!response.ok) {
      throw new Error(
        (data && (data.message || data.error)) ||
        `Request failed with status ${response.status}`
      );
    }

    return data;
  } catch (error: any) {
    // Provide a friendlier message for rate-limit errors
    if (
      error.message &&
      (error.message.toLowerCase().includes('too many') ||
        error.message.toLowerCase().includes('rate limit'))
    ) {
      throw new Error('Too many requests. Please wait a moment and try again.');
    }
    console.error('API Error:', error);
    throw error;
  }
}

// Opportunities API
export const opportunitiesAPI = {
  getAll: () => fetchAPI('/opportunities'),
  getById: (id: string) => fetchAPI(`/opportunities/${id}`),
  getBySlug: (slug: string) => fetchAPI(`/opportunities/slug/${slug}`),
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
