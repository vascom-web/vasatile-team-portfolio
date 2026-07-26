const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Trim email and password to avoid trailing spaces
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    console.log('🔍 Admin login attempt:', trimmedEmail);

    const admin = await Admin.findOne({
      email: { $regex: new RegExp(`^${trimmedEmail}$`, 'i') }
    });
    if (!admin) {
      console.log('❌ Admin not found');
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    console.log('📦 Admin found:', admin.email);
    console.log('🔑 Stored hash:', admin.password);

    const isMatch = await bcrypt.compare(trimmedPassword, admin.password);
    console.log('🔑 Password match:', isMatch);

    if (!isMatch) {
      console.log('❌ Password mismatch');
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie – cross‑origin compatible
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // only over HTTPS
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error('❌ Admin login error:', err.message);
    res.status(500).json({ error: err.message });
  }
};