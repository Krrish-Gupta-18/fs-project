import { mockConversations, mockMessages } from '../data/mockData';

// Simulated asynchronous network delay helper
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Simulated Async API call to fetch conversations and initial message maps.
 * Supports loading simulation and error simulation.
 */
export async function fetchConversations(shouldFail = false) {
  await delay(700); // 700ms simulated network latency

  if (shouldFail) {
    throw new Error('Failed to load conversations from network. Please try again.');
  }

  return {
    conversations: [...mockConversations],
    messages: { ...mockMessages },
  };
}

/**
 * Simulated Async API call for User Login.
 */
export async function loginUser(email, password) {
  await delay(600); // 600ms simulated authentication latency

  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  if (!email.includes('@')) {
    throw new Error('Please enter a valid email address.');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  return {
    user: {
      id: 'user_0',
      name: 'Alex Morgan',
      email: email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      status: 'online',
    },
    token: 'mock_jwt_token_xyz123',
  };
}

/**
 * Simulated Async API call for User Registration.
 */
export async function registerUser(userData) {
  await delay(800); // 800ms simulated registration latency

  const { name, email, password, confirmPassword } = userData;

  if (!name || !email || !password || !confirmPassword) {
    throw new Error('All fields are required.');
  }

  if (!email.includes('@')) {
    throw new Error('Please enter a valid email address.');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  if (password !== confirmPassword) {
    throw new Error('Passwords do not match.');
  }

  return {
    success: true,
    message: 'User registered successfully!',
  };
}
