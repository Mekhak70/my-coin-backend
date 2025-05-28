// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { checkTelegramAuth } = require('./utils');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('Hello from My Coin Backend 🚀');
});

app.post('/auth/telegram', (req, res) => {
  console.log('🟢 New POST /auth/telegram request');
  console.log('➡️ Request body:', req.body);

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  console.log('🔒 Bot Token:', botToken);

  // Չմոռանաս՝ եթե req.body դատարկ է, պատճառը կարող է լինել data-ը x-www-form-urlencoded լինելու փոխարեն JSON լինելու:
  if (!req.body || Object.keys(req.body).length === 0) {
    console.error('❌ Request body is empty. Maybe wrong content-type?');
    return res.status(400).json({ success: false, message: 'Request body is empty' });
  }

  const isValid = checkTelegramAuth(req.body, botToken);
  console.log('✅ isValid:', isValid);

  if (isValid) {
    const { id, username, first_name, last_name } = req.body;
    res.json({
      success: true,
      message: `Բարի գալուստ, ${first_name || username || id}!`,
      user: { id, username, first_name, last_name },
    });
  } else {
    console.error('❌ Authentication failed');
    res.json({ success: false, message: 'Authentication failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
