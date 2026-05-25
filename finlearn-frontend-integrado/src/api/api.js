const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Erro na requisição: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export { API_BASE_URL };
