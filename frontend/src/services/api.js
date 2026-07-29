/**
 * api.js
 *
 * All HTTP calls to the backend. The token is read from localStorage on each
 * call so it's always fresh after login/logout.
 *
 * AI-generated content is NOT sanitized here — that is done at render time by
 * the component layer (see sanitize.js) so we have a single enforcement point.
 */

const BASE = import.meta.env.VITE_API_BASE_URL || '';

async function request(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      data?.error ||
      (Array.isArray(data?.errors) ? data.errors.map((e) => e.msg).join(', ') : null) ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

function getToken() {
  return localStorage.getItem('asw_token');
}

// ─── Auth ─────────────────────────────────────────────────────────────────
export const authApi = {
  register: (username, email, password) =>
    request('POST', '/api/auth/register', { username, email, password }),

  login: (email, password) =>
    request('POST', '/api/auth/login', { email, password }),
};

// ─── Stories ──────────────────────────────────────────────────────────────
export const storyApi = {
  listStories: () =>
    request('GET', '/api/story', null, getToken()),

  generate: (theme, genre, plotBeats, segmentCount) =>
    request(
      'POST',
      '/api/story/generate',
      { theme, genre, plotBeats, segmentCount },
      getToken()
    ),

  getStory: (storyId) =>
    request('GET', `/api/story/${storyId}`, null, getToken()),

  steer: (storyId, segmentId, instruction) =>
    request(
      'POST',
      `/api/story/${storyId}/segment/${segmentId}/steer`,
      { instruction },
      getToken()
    ),
};
