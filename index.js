const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

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

  const isValid = hmac === hash;

  console.log('➡️ DataCheckString:', dataCheckString);
  console.log('➡️ Calculated hash:', hmac);
  console.log('➡️ Provided hash:', hash);

  return isValid;
}

app.get('/', (req, res) => {
  res.send('Hello from My Coin Backend 🚀');
});

app.post('/auth/telegram', (req, res) => {
  console.log('➡️ Incoming Telegram Data:', req.body);

  const isValid = checkTelegramAuth(req.body, TELEGRAM_BOT_TOKEN);
  console.log('➡️ Hash validation result:', isValid);

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
