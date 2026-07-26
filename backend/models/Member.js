const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telegramChatId: { type: String, default: '' },   // 👈 new field
  skill: {
    type: String,
    enum: ['technical-writer', 'web-developer', 'app-developer', 'video-editor', 'graphics-developer'],
    required: true
  },
  bio: String,
  rate: { type: Number, default: 20 },
  active: { type: Boolean, default: true },
  profileImage: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Member', MemberSchema);