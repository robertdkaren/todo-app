const API_BASE = `http://${window.location.hostname}:8002/api`;

async function getCsrfToken() {
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? match[1] : '';
}

async function request(endpoint, options = {}) {
  const csrfToken = await getCsrfToken();

  const config = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken && { 'X-CSRFToken': csrfToken }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw { status: response.status, ...error };
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  login: (username, password) =>
    request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  logout: () =>
    request('/auth/logout/', { method: 'POST' }),

  me: () =>
    request('/auth/me/'),

  getTodos: () =>
    request('/todos/'),

  createTodo: (todo) =>
    request('/todos/', {
      method: 'POST',
      body: JSON.stringify(todo),
    }),

  getPreferences: () =>
    request('/preferences/'),

  updatePreferences: (preferences) =>
    request('/preferences/', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    }),

  reorderTodos: (order) =>
    request('/todos/reorder/', {
      method: 'POST',
      body: JSON.stringify({ order }),
    }),
};
