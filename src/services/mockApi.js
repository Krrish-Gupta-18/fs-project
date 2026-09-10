import { mockConversations, mockMessages, findMockUserByEmail, addMockUser } from '../data/mockData';

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
 * Validates against registered users in mockData.js (NO hardcoded user data).
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

  // Look up user in mockData (NO hardcoded fallback)
  const user = findMockUserByEmail(email);

  if (!user) {
    throw new Error('No account found with this email. Please register first.');
  }

  if (user.password && user.password !== password) {
    throw new Error('Incorrect password. Please check your credentials.');
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      tag: user.tag || `@${user.name.toLowerCase().replace(/\s+/g, '_')}`,
      email: user.email,
      avatar: user.avatar,
      status: user.status || 'online',
      bio: user.bio || 'ChatFlow Member',
    },
    token: `mock_jwt_token_${user.id}_${Date.now()}`,
  };
}

/**
 * Simulated Async API call for User Registration.
 * Adds newly registered user directly into mockData.js.
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

  // Check if email already registered in mockData
  const existing = findMockUserByEmail(email);
  if (existing) {
    throw new Error('An account with this email already exists. Please log in.');
  }

  // Persist newly registered user in mockData.js
  const newUser = addMockUser({ name, email, password });

  return {
    success: true,
    message: 'User registered successfully!',
    user: newUser,
  };
}

