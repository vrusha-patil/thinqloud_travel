require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for Seeding...');

    // Clear existing users
    await User.deleteMany();
    console.log('Cleared existing users.');

    // Create demo users
    const manager = await User.create({
      name: 'Manager Akanksha',
      email: 'manager@company.com',
      password: 'password123',
      role: 'manager',
      department: 'Engineering'
    });

    await User.create({
      name: 'Employee Vrushali',
      email: 'vrushali@company.com',
      password: 'password123',
      role: 'employee',
      department: 'Engineering',
      managerId: manager._id
    });

    await User.create({
      name: 'Finance Admin',
      email: 'finance@company.com',
      password: 'password123',
      role: 'finance',
      department: 'Finance'
    });

    console.log('Database successfully seeded with 3 users!');
    console.log('Emails: vrushali@company.com | manager@company.com | finance@company.com');
    console.log('Password for all: password123');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDatabase();
