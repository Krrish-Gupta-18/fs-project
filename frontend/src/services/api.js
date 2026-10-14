import { fetchConversations as fetchMockConversations, loginUser as mockLogin, registerUser as mockRegister } from './mockApi';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Helper to fetch from backend REST API with fallback to mockApi if server is unreachable
 */
async function apiFetch(endpoint, options = {}) {
  try {
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

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `HTTP error ${res.status}`);
    }
    return data;
  } catch (err) {
    throw err;
  }
}

/**
 * Fetch Conversations & Messages map from backend with automatic mock fallback
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
        try {
          const msgs = await apiFetch(`/messages/${conv.conversationId || conv.id}`);
          messagesMap[conv.conversationId || conv.id] = msgs;
        } catch {
          messagesMap[conv.conversationId || conv.id] = [];
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
    console.warn('[API Warning]: Backend server unreachable, falling back to mockApi.', error.message);
    return await fetchMockConversations(shouldFail);
  }
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
    return res;
  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      console.warn('[API Warning]: Backend server unreachable, falling back to mock login.');
      return await mockLogin(email, password);
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
    return res;
  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      console.warn('[API Warning]: Backend server unreachable, falling back to mock registration.');
      return await mockRegister(userData);
    }
    throw error;
  }
}
