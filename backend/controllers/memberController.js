const Member = require('../models/Member');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ---------- Register ----------
exports.register = async (req, res) => {
  const { name, email, password, whatsapp, skill, bio, rate, active, profileImage } = req.body;
  try {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const exists = await Member.findOne({ email: trimmedEmail });
    if (exists) return res.status(400).json({ error: 'Email already exists' });

    const hashed = await bcrypt.hash(trimmedPassword, 10);
    const member = new Member({
      name,
      email: trimmedEmail,
      password: hashed,
      whatsapp,           // 👈 include
      skill,
      bio,
      rate,
      active,
      profileImage
    });
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    console.error('❌ Registration error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// ---------- Get All ----------
exports.getAll = async (req, res) => {
  try {
    const members = await Member.find().select('-password');
    res.json(members);
  } catch (err) {
    console.error('❌ Get all error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// ---------- Update ----------
exports.update = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    if (updates.password) {
      const trimmedPassword = updates.password.trim();
      if (!trimmedPassword.startsWith('$2b$')) {
        updates.password = await bcrypt.hash(trimmedPassword, 10);
      } else {
        delete updates.password;
      }
    }
    // whatsapp is included in updates – nothing extra needed
    const member = await Member.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) {
    console.error('❌ Update error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// ---------- Delete ----------
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const member = await Member.findByIdAndDelete(id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json({ message: 'Member deleted' });
  } catch (err) {
    console.error('❌ Delete error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// ---------- Toggle Active ----------
exports.toggleActive = async (req, res) => {
  const { id } = req.params;
  try {
    const member = await Member.findById(id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    member.active = !member.active;
    await member.save();
    res.json(member);
  } catch (err) {
    console.error('❌ Toggle active error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
// ---------- Get Member by ID ----------
exports.getById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).select('-password');
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) {
    console.error('❌ Get by ID error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
// ---------- Login (with httpOnly cookie) ----------
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const member = await Member.findOne({ email: trimmedEmail });
    if (!member) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(trimmedPassword, member.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: member._id, role: 'member' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
        skill: member.skill,
      },
    });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ error: err.message });
  }
};