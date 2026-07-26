const { Telegraf } = require('telegraf');
const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.warn('⚠️ No TELEGRAM_BOT_TOKEN');
  module.exports = { sendTelegram: async () => {} };
  return;
}

const bot = new Telegraf(token);

const sendTelegram = async (chatId, text) => {
  try {
    await bot.telegram.sendMessage(chatId, text, { parse_mode: 'HTML' });
    console.log(`✅ Telegram sent to ${chatId}`);
  } catch (err) {
    console.error(`❌ Telegram failed: ${err.message}`);
    throw err;
  }
};

module.exports = { sendTelegram };