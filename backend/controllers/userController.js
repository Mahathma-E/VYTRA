import User from '../models/User.js';

// Get all users
export const getUsers = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;
    
    const count = await User.countDocuments();
    const users = await User.find()
      .select('-password')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      users,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (user) {
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
      user.profile = { ...user.profile, ...req.body.profile };
      user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;
      
      // Only admin can change user roles
      if (req.user.role !== 'admin' && req.body.role) {
        return res.status(403).json({ message: 'Not authorized to change user roles' });
      }
      
      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        email: updatedUser.email,
        role: updatedUser.role,
        profile: updatedUser.profile,
        isActive: updatedUser.isActive
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (user) {
      // Prevent users from deleting themselves
      if (user._id.toString() === req.user.id.toString()) {
        return res.status(400).json({ message: 'Cannot delete your own account' });
      }
      
      await user.remove();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user activity logs
export const getUserActivity = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (user) {
      res.json({
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};