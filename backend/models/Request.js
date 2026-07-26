const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  memberEmail: String,
  memberName: String,
  skill: String,
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientTelegramChatId: { type: String, default: '' },   // 👈 new
  description: { type: String, required: true },
  deliveryDays: { type: Number, required: true },
  price: Number,
  attachment: String,
  code: { type: String, unique: true, required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', RequestSchema);