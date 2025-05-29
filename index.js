const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { checkTelegramAuth } = require('./utils');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7328505047:AAHj2VTMQ0aWCLOssN62Dkim4GKQKBTnDLk';

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
