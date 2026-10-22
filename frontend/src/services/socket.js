import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socketInstance = null;

/**
 * Get or initialize the Socket.IO client connection
 */
export function getSocket(token) {
  const authToken = token || localStorage.getItem('chatflow_token');

  if (!authToken) {
    return null;
  }

  // If already connected with the same token, reuse
  if (socketInstance) {
    if (!socketInstance.connected && !socketInstance.connecting) {
      socketInstance.connect();
    }
    return socketInstance;
  }

  socketInstance = io(SOCKET_URL, {
    auth: {
      token: authToken,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });

  socketInstance.on('connect', () => {
    console.log('[Socket Connected]: Connected with ID', socketInstance.id);
  });

  socketInstance.on('connect_error', (err) => {
    console.warn('[Socket Connection Error]:', err.message);
  });

  socketInstance.on('disconnect', (reason) => {
    console.log('[Socket Disconnected]: Reason:', reason);
  });

  return socketInstance;
}

/**
 * Disconnect and destroy the socket instance
 */
export function disconnectSocket() {
  if (socketInstance) {
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
    socketInstance = null;
    console.log('[Socket]: Disconnected and cleaned up.');
  }
}
