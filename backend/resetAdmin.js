const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const dotenv = require('dotenv');
dotenv.config();

console.log('🔍 Connecting to MongoDB...');

const reset = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ MongoDB connected');

    const deleted = await Admin.deleteMany({});
    console.log(`🗑️ Deleted ${deleted.deletedCount} admins`);

    const hashed = await bcrypt.hash('vasatileportfolio@2004', 10);
    const admin = await Admin.create({
      email: 'vasatilePortfolio@gmail.com',
      password: hashed,
      name: 'Admin'
    });
    console.log('✅ Admin reset successfully');
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔑 Password: vasatilePortfolio@2004`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

reset();