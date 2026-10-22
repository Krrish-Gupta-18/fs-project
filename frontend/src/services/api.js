import { fetchConversations as fetchMockConversations, loginUser as mockLogin, registerUser as mockRegister } from './mockApi';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to fetch from backend REST API with authorization header
 */
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('chatflow_token') || sessionStorage.getItem('chatflow_token');
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || `HTTP error ${res.status}`);
    error.status = res.status;
    if (res.status === 401) {
      logoutUser();
    }
    throw error;
  }
  return data;
}

/**
 * Fetch Conversations & Messages map from backend
 */
export async function fetchConversations(shouldFail = false) {
  if (shouldFail) {
    throw new Error('Failed to load conversations from network.');
  }

  try {
    const conversations = await apiFetch('/conversations');

    // Fetch messages for each conversation concurrently
    const messagesMap = {};
    await Promise.all(
      conversations.map(async (conv) => {
        const id = conv.conversationId || conv.id;
        try {
          const msgs = await apiFetch(`/messages/${id}`);
          messagesMap[id] = (msgs || []).map((m) => ({
            ...m,
            id: m.messageId || m.id || m._id,
          }));
        } catch {
          messagesMap[id] = [];
        }
      })
    );

    return {
      conversations: conversations.map((c) => ({
        ...c,
        id: c.conversationId || c.id || c._id,
      })),
      messages: messagesMap,
    };
  } catch (error) {
    if (error.status === 401) {
      throw error;
    }
    console.warn('[API Warning]: Backend server unreachable, falling back to mockApi.', error.message);
    return await fetchMockConversations(shouldFail);
  }
}

/**
 * Fetch contacts list for starting new chats
 */
export async function fetchContacts() {
  try {
    const contacts = await apiFetch('/auth/contacts');
    return contacts;
  } catch (error) {
    console.warn('[API Warning]: Could not fetch real contacts, falling back.', error.message);
    return [];
  }
}

/**
 * Fetch current authenticated user info
 */
export async function fetchCurrentUser() {
  try {
    const user = await apiFetch('/auth/me');
    if (user) {
      localStorage.setItem('chatflow_user', JSON.stringify(user));
    }
    return user;
  } catch (error) {
    const saved = localStorage.getItem('chatflow_user');
    return saved ? JSON.parse(saved) : null;
  }
}

/**
 * Create a new conversation on the backend
 */
export async function createConversation(conversationData) {
  return await apiFetch('/conversations', {
    method: 'POST',
    body: JSON.stringify(conversationData),
  });
}

/**
 * User Login API call
 */
export async function loginUser(email, password) {
  try {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.token) {
      localStorage.setItem('chatflow_token', res.token);
    }
    if (res.user) {
      localStorage.setItem('chatflow_user', JSON.stringify(res.user));
    }
    return res;
  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      console.warn('[API Warning]: Backend server unreachable, falling back to mock login.');
      const mockRes = await mockLogin(email, password);
      if (mockRes.user) {
        localStorage.setItem('chatflow_user', JSON.stringify(mockRes.user));
      }
      if (mockRes.token) {
        localStorage.setItem('chatflow_token', mockRes.token);
      }
      return mockRes;
    }
    throw error;
  }
}

/**
 * User Registration API call
 */
export async function registerUser(userData) {
  try {
    const res = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (res.token) {
      localStorage.setItem('chatflow_token', res.token);
    }
    if (res.user) {
      localStorage.setItem('chatflow_user', JSON.stringify(res.user));
    }
    return res;
  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      console.warn('[API Warning]: Backend server unreachable, falling back to mock registration.');
      const mockRes = await mockRegister(userData);
      if (mockRes.user) {
        localStorage.setItem('chatflow_user', JSON.stringify(mockRes.user));
      }
      if (mockRes.token) {
        localStorage.setItem('chatflow_token', mockRes.token);
      }
      return mockRes;
    }
    throw error;
  }
}

/**
 * Logout helper
 */
export function logoutUser() {
  localStorage.removeItem('chatflow_token');
  localStorage.removeItem('chatflow_user');
  sessionStorage.removeItem('chatflow_token');
  sessionStorage.removeItem('chatflow_user');
}
