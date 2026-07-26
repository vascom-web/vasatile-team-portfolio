const Request = require('../models/Request');
const Member = require('../models/Member');
const { generateRequestCode } = require('../utils/helpers');
const { sendTelegram } = require('../utils/telegram');

// ---------- Create request (public) ----------
exports.create = async (req, res) => {
  const { memberId, clientName, clientEmail, clientTelegramChatId, description, deliveryDays, attachment } = req.body;
  try {
    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    if (!member.active) return res.status(400).json({ error: 'Member is inactive' });

    const code = generateRequestCode();
    const price = (member.rate / deliveryDays).toFixed(2);

    const request = new Request({
      memberId,
      memberEmail: member.email,
      memberName: member.name,
      skill: member.skill,
      clientName,
      clientEmail,
      clientTelegramChatId,
      description,
      deliveryDays,
      price,
      attachment: attachment || null,
      code,
      status: 'pending'
    });
    await request.save();

    // Build the request link
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const link = `${frontendUrl}/#/request/${code}`;

    // ----- Telegram to Team Member -----
    const memberMsg = `📝 <b>New Work Request</b>\n\nHello ${member.name},\nYou have a new request from <b>${clientName}</b>.\n\n<b>Code:</b> ${code}\n<b>Description:</b> ${description}\n<b>Delivery:</b> ${deliveryDays} day(s)\n<b>Price:</b> $${price}\n\n🔗 <a href="${link}">View Request</a>`;
    if (member.telegramChatId) {
      await sendTelegram(member.telegramChatId, memberMsg);
    } else {
      console.log('⚠️ Member has no Telegram chat ID – skipping.');
    }

    // ----- Telegram to Client -----
    const clientMsg = `✅ <b>Request Sent</b>\n\nHello ${clientName},\nYour request was sent to <b>${member.name}</b>.\n\n<b>Code:</b> ${code}\n<b>Delivery in:</b> ${deliveryDays} day(s)\n\nYou will be notified when the work is completed.`;
    if (clientTelegramChatId) {
      await sendTelegram(clientTelegramChatId, clientMsg);
    } else {
      console.log('⚠️ Client did not provide Telegram chat ID – skipping.');
    }

    res.status(201).json(request);
  } catch (err) {
    console.error('❌ Create request error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// ---------- Get requests for authenticated member ----------
exports.getByMember = async (req, res) => {
  const memberId = req.user.id;
  try {
    const requests = await Request.find({ memberId });
    res.json(requests);
  } catch (err) {
    console.error('❌ GetByMember error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// ---------- Update request status (member) ----------
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const request = await Request.findById(id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.memberId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    request.status = status;
    await request.save();
    res.json(request);
  } catch (err) {
    console.error('❌ UpdateStatus error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// ---------- Get request by code (public) ----------
exports.getByCode = async (req, res) => {
  const { code } = req.params;
  try {
    const request = await Request.findOne({ code });
    if (!request) return res.status(404).json({ error: 'Request not found' });
    res.json(request);
  } catch (err) {
    console.error('❌ GetByCode error:', err.message);
    res.status(500).json({ error: err.message });
  }
};