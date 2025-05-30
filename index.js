// index.js
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ; // Դնել քո bot-ի token-ը

// Telegram hash ստուգման ֆունկցիա
function checkTelegramAuth(data, botToken) {
  if (!data || !data.hash) {
    console.log('❌ Hash missing from data');
    return false;
  }

  const { hash, ...rest } = data;
  const dataCheckString = Object.keys(rest)
    .sort()
    .map(key => `${key}=${rest[key]}`)
    .join('\n');

  const secretKey = crypto.createHash('sha256').update(botToken).digest();
  const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  console.log('✅ Generated HMAC:', hmac);
  console.log('✅ Received hash:', hash);

  return hmac === hash;
}

// Backend ռաութը Telegram-ից տվյալ ստանալու համար
app.post('/auth/telegram', (req, res) => {
  console.log('➡️ Incoming Telegram Data:', req.body);

  const isValid = checkTelegramAuth(req.body, TELEGRAM_BOT_TOKEN);
  console.log('➡️ Hash validation result:', isValid);

  if (isValid) {
    const { id, username, first_name, last_name, photo_url } = req.body;
    res.json({
      success: true,
      user: { id, username, first_name, last_name, photo_url },
    });
  } else {
    res.json({ success: false, message: 'Invalid Telegram authentication' });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('Hello from My Coin Backend 🚀');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
