import { User } from '../models/User.js';

export const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.isAdmin) return res.status(403).json({ error: 'Admin access required' });
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
