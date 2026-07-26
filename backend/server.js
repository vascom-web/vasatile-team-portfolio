const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// ---------- CORS ----------
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://your-frontend-url.com'] // replace with your live URL
  : ['http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // allow cookies
}));

app.use(express.json());
app.use(cookieParser());

// ---------- Rate Limiting ----------
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  message: 'Too many login attempts, please try again later.',
});

// Apply to auth routes
app.use('/api/admin/login', authLimiter);
app.use('/api/members/login', authLimiter);
app.use('/api/members/register', authLimiter);

// ---------- Routes ----------
app.use('/api/admin', require('./routes/admin'));
app.use('/api/members', require('./routes/members'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/images', require('./routes/images'));

// ---------- Models for Seeding ----------
const Admin = require('./models/Admin');
const Member = require('./models/Member');
const Image = require('./models/Image');
const bcrypt = require('bcryptjs');

// ---------- Seeding Functions ----------
const seedAdmin = async () => {
  try {
    const existing = await Admin.findOne({ email: 'vasatilePortfolio@gmail.com' });
    if (existing) {
      console.log('✅ Admin already exists');
      return;
    }
    await Admin.deleteMany({});
    const hashed = await bcrypt.hash('vasatilePortfolio@2004', 10);
    await Admin.create({
      email: 'vasatilePortfolio@gmail.com',
      password: hashed,
      name: 'Admin'
    });
    console.log('✅ Admin seeded');
  } catch (err) {
    console.error('❌ Admin seed error:', err.message);
  }
};

const seedMembers = async () => {
  try {
    const count = await Member.countDocuments();
    if (count === 0) {
      const defaultMembers = [
        {
          name: 'Alice Johnson',
          email: 'alice@example.com',
          password: await bcrypt.hash('pass123', 10),
          skill: 'technical-writer',
          bio: 'Expert technical writer with 8 years of experience.',
          rate: 25,
          active: true,
          profileImage: 'https://i.pravatar.cc/300?img=1'
        },
        {
          name: 'Bob Smith',
          email: 'bob@example.com',
          password: await bcrypt.hash('pass123', 10),
          skill: 'web-developer',
          bio: 'Fullstack developer specializing in React & Node.js.',
          rate: 35,
          active: true,
          profileImage: 'https://i.pravatar.cc/300?img=2'
        },
        {
          name: 'Carol White',
          email: 'carol@example.com',
          password: await bcrypt.hash('pass123', 10),
          skill: 'app-developer',
          bio: 'Mobile app developer with Flutter & React Native expertise.',
          rate: 30,
          active: true,
          profileImage: 'https://i.pravatar.cc/300?img=3'
        },
        {
          name: 'Dave Brown',
          email: 'dave@example.com',
          password: await bcrypt.hash('pass123', 10),
          skill: 'video-editor',
          bio: 'Video editor with 5 years of experience in Adobe Premiere.',
          rate: 20,
          active: false,
          profileImage: 'https://i.pravatar.cc/300?img=4'
        },
        {
          name: 'Eve Davis',
          email: 'eve@example.com',
          password: await bcrypt.hash('pass123', 10),
          skill: 'graphics-developer',
          bio: 'Creative graphics designer with a passion for branding.',
          rate: 22,
          active: true,
          profileImage: 'https://i.pravatar.cc/300?img=5'
        }
      ];
      await Member.insertMany(defaultMembers);
      console.log('✅ Default members seeded');
    } else {
      console.log('✅ Members already exist');
    }
  } catch (err) {
    console.error('❌ Member seed error:', err.message);
  }
};

const seedImages = async () => {
  try {
    const count = await Image.countDocuments();
    if (count === 0) {
      await Image.insertMany([
        { id: 'hero', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop' },
        { id: 'team-bg', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop' }
      ]);
      console.log('✅ Images seeded');
    } else {
      console.log('✅ Images already seeded');
    }
  } catch (err) {
    console.error('❌ Image seed error:', err.message);
  }
};

const runSeeding = async () => {
  await seedAdmin();
  await seedMembers();
  await seedImages();
};

// ---------- Start Server ----------
const startServer = async () => {
  try {
    await connectDB();       // wait for MongoDB connection
    await runSeeding();      // seed after connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
  } catch (err) {
    console.error(' Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();