const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN  

// Telegram authentication checker
function checkTelegramAuth(data, botToken) {
  const secret = crypto.createHash('sha256').update(botToken).digest();
  const { hash, ...fields } = data;
  const sortedKeys = Object.keys(fields).sort();
  const dataCheckString = sortedKeys.map(key => `${key}=${fields[key]}`).join('\n');
  const hmac = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');
  return hmac === hash;
}

// Routes
app.get('/', (req, res) => {
  res.send('Hello from My Coin Backend 🚀');
});

app.post('/auth/telegram', (req, res) => {
  console.log('➡️ Incoming Telegram Data:', req.body);
  const isValid = checkTelegramAuth(req.body, TELEGRAM_BOT_TOKEN);
  if (isValid) {
    const { id, username, first_name, last_name } = req.body;
    res.json({
      success: true,
      message: `Բարի գալուստ, ${first_name || username || id}!`,
      user: { id, username, first_name, last_name },
    });
  } else {
    res.json({
      success: false,
      message: 'Հավաստիացումը ձախողվեց',
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
