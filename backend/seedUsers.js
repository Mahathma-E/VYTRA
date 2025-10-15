import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/inventory');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Sample users data
const users = [
  {
    email: 'admin@example.com',
    password: 'Admin123',
    role: 'admin',
    profile: {
      firstName: 'Admin',
      lastName: 'User'
    }
  },
  {
    email: 'manager@example.com',
    password: 'Manager123',
    role: 'manager',
    profile: {
      firstName: 'Manager',
      lastName: 'User'
    }
  },
  {
    email: 'employee@example.com',
    password: 'Employee123',
    role: 'employee',
    profile: {
      firstName: 'Employee',
      lastName: 'User'
    }
  }
];

// Seed users
const seedUsers = async () => {
  try {
    await connectDB();
    
    // Clear existing users
    await User.deleteMany();
    console.log('Cleared existing users');
    
    // Hash passwords and create users
    for (let user of users) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
    
    // Insert users
    await User.insertMany(users);
    console.log('Users seeded successfully');
    
    process.exit();
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

// Run the seeder
seedUsers();