import { User } from '../models/User.js';

// READ all users
export async function getUsers(req, res) {
  try {
    const users = await User.find({}, '-password');
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// READ user by userId
export async function getUserById(req, res) {
  try {
    const user = await User.findOne({ userId: req.params.id }, '-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// CREATE new user
export async function createUser(req, res) {
  try {
    const { name, email, password, role, bio } = req.body;
    const userId = req.body.userId || `user_${Date.now()}`;

    const newUser = await User.create({
      userId,
      name,
      email,
      password: password || 'defaultPass123',
      role,
      bio,
    });

    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

// UPDATE user profile
export async function updateUser(req, res) {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { userId: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true, select: '-password' }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(updatedUser);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

// DELETE user
export async function deleteUser(req, res) {
  try {
    const deletedUser = await User.findOneAndDelete({ userId: req.params.id });
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ message: 'User deleted successfully', userId: req.params.id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
