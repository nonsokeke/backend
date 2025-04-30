const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Opportunity = require('../models/Opportunity');
const Major = require('../models/Major');
require('dotenv').config();

const majors = [
  { name: "Computer Science", department: "Computing and Mathematics" },
  { name: "Economics", department: "Business" },
  { name: "Psychology", department: "Social Sciences" },
  { name: "Biology", department: "Natural Sciences" },
  { name: "Marketing", department: "Business" }
];

const users = Array.from({ length: 20 }, (_, i) => ({
  user_name: `user${i + 1}`,
  first_name: `FirstName${i + 1}`,
  last_name: `LastName${i + 1}`,
  year_graduated: 2010 + Math.floor(i / 2),
  major: majors[i % 5].name,
  company: `Company ${String.fromCharCode(65 + i % 5)}`,
  title: `Position ${i + 1}`,
  email: `user${i + 1}@example.com`,
  linkedin_link: `https://linkedin.com/in/user${i + 1}`,
  password: 'password123', // Will be hashed before saving
  role: i === 0 ? 'admin' : 'user', // First user is admin
  approved: i < 10 // First 10 users are approved
}));

const opportunities = Array.from({ length: 10 }, (_, i) => ({
  title: `Opportunity ${i + 1}`,
  posted_by: `Company ${String.fromCharCode(65 + i % 5)}`,
  type: i % 2 === 0 ? 'internship' : 'full-time',
  description: `Description for opportunity ${i + 1}`,
  needs_approval: true,
  approved: i < 5, // First 5 opportunities are approved
  approved_by: i < 5 ? 'admin' : null,
  is_paid: i % 2 === 0,
  amount: i % 2 === 0 ? `$${(i + 1) * 1000}` : null
}));

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Opportunity.deleteMany({}),
      Major.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Hash passwords for all users
    const hashedUsers = await Promise.all(users.map(async user => ({
      ...user,
      password: await bcrypt.hash(user.password, 10)
    })));

    // Insert new data
    await Major.insertMany(majors);
    await User.insertMany(hashedUsers);
    await Opportunity.insertMany(opportunities);

    console.log('Sample data inserted successfully');
    console.log(`Added ${majors.length} majors`);
    console.log(`Added ${users.length} users`);
    console.log(`Added ${opportunities.length} opportunities`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedDatabase();
