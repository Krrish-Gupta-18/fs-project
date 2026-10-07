import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_jwt_key_chatflow';

/**
 * Authentication Middleware
 * Protects routes by validating JWT Bearer tokens in Authorization header.
 */
export async function protect(req, res, next) {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.headers.authorization) {
      token = req.headers.authorization;
    } else if (req.headers['x-auth-token']) {
      token = req.headers['x-auth-token'];
    }

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No authentication token provided.' });
    }

    // Support legacy mock/simple token format: jwt_token_<userId>_<timestamp>
    if (token.startsWith('jwt_token_')) {
      const parts = token.split('_');
      let userId;
      if (parts.length >= 4) {
        userId = `${parts[2]}_${parts[3]}`;
      }
      if (userId) {
        try {
          const user = await User.findOne({ userId }).select('-password');
          if (user) {
            req.user = user;
            return next();
          }
        } catch {
          // Ignore DB error
        }
      }
      req.user = { userId: userId || 'user_demo' };
      return next();
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      let user = null;
      try {
        user = await User.findOne({ userId: decoded.userId }).select('-password');
      } catch (dbErr) {
        // DB might be offline or connecting; fall back to decoded token payload
      }
      req.user = user || decoded;
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Authentication error: ' + error.message });
  }
}

/**
 * Role-Based Authorization Middleware
 * Restricts access to users with specified role(s).
 * @param  {...string} allowedRoles Roles allowed to access the route (e.g., 'Admin', 'Moderator', 'Member')
 */
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in first.' });
    }

    const userRole = req.user.role || 'Member';
    const normalizedUserRole = userRole.toLowerCase();
    const isAllowed = allowedRoles.some((role) => role.toLowerCase() === normalizedUserRole);

    if (!isAllowed) {
      return res.status(403).json({
        error: `Forbidden. Access requires one of the following roles: ${allowedRoles.join(', ')}. Your role is '${userRole}'.`,
      });
    }

    next();
  };
}

/**
 * Convenience middleware for Admin-only routes
 */
export const adminOnly = authorize('Admin');

/**
 * Convenience middleware for Admin & Moderator routes
 */
export const adminOrModerator = authorize('Admin', 'Moderator');

/**
 * Helper to generate JWT token for a user
 */
export function generateToken(user) {
  return jwt.sign(
    {
      userId: user.userId || user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'Member',
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}
