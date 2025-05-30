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

let userAuthenticated = false; // Մի անգամ միայն true կդառնա
let lastUser = null;

function checkTelegramAuth(data, botToken) {
  if (!data || !data.hash) return false;

  const { hash, ...rest } = data;
  const dataCheckString = Object.keys(rest)
    .sort()
    .map(key => `${key}=${rest[key]}`)
    .join('\n');

  const secretKey = crypto.createHash('sha256').update(botToken).digest();
  const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  return hmac === hash;
}

app.post('/auth/telegram', (req, res) => {
  console.log('➡️ Incoming Telegram Data:', req.body);

  if (!userAuthenticated) {
    const isValid = checkTelegramAuth(req.body, TELEGRAM_BOT_TOKEN);
    console.log('✅ Hash validation result:', isValid);

    if (isValid) {
      const { id, username, first_name, last_name, photo_url } = req.body;
      lastUser = { id, username, first_name, last_name, photo_url };
      userAuthenticated = true;

      console.log('✅ User authenticated and stored:', lastUser);
      return res.redirect('https://my-coin-app.vercel.app/?auth=success'); // ✅ Redirect հենց առաջին հաջող հարցումից հետո
    } else {
      return res.status(400).json({ success: false, message: 'Invalid Telegram authentication' });
    }
  } else {
    console.log('ℹ️ User already authenticated, ignoring...');
    res.status(200).send('Already authenticated');
  }
});

app.get('/last-user', (req, res) => {
  if (lastUser) {
    res.json({ success: true, user: lastUser });
  } else {
    res.json({ success: false, message: 'No user data available' });
  }
});

app.get('/', (req, res) => {
  res.send('Hello from My Coin Backend 🚀');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
