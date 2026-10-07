import { User } from '../models/User.js';
import { generateToken } from '../middleware/authMiddleware.js';

export async function register(req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const userId = `user_${Date.now()}`;
    const newUser = await User.create({
      userId,
      name,
      email,
      password,
      tag: `@${name.toLowerCase().replace(/\s+/g, '')}`,
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: newUser.userId,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        role: newUser.role || "Member",
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    return res.json({
      user: {
        id: user.userId,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        status: user.status,
        bio: user.bio,
        role: user.role || "Member",
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getContacts(req, res) {
  try {
    const users = await User.find({}, '-password');
    const contacts = users.map((u) => ({
      id: u.userId,
      name: u.name,
      avatar: u.avatar,
      status: u.status,
      role: u.role || 'Member',
    }));
    return res.json(contacts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
