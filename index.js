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
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

let lastUser = null; // Պահելու ենք վերջին հաստատված օգտատիրոջ տվյալները

// Hash ստուգման ֆունկցիա
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

// Telegram Auth endpoint
app.post('/auth/telegram', (req, res) => {
  console.log('➡️ Incoming Telegram Data:', req.body);

  const isValid = checkTelegramAuth(req.body, TELEGRAM_BOT_TOKEN);
  console.log('➡️ Hash validation result:', isValid);

  if (isValid) {
    const { id, username, first_name, last_name, photo_url } = req.body;
    lastUser = { id, username, first_name, last_name, photo_url };

    res.json({
      success: true,
      user: lastUser,
    });
  } else if (lastUser) {
    console.log('ℹ️ Returning last user data (hash invalid)');
    res.json({
      success: true,
      user: lastUser,
      warning: 'Using last stored user data',
    });
  } else {
    res.json({ success: false, message: 'Invalid Telegram authentication' });
  }
});

// Last user get endpoint (optional, if you want to fetch user separately)
app.get('/last-user', (req, res) => {
  if (lastUser) {
    res.json({ success: true, user: lastUser });
  } else {
    res.json({ success: false, message: 'No user data available' });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('Hello from My Coin Backend 🚀');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
