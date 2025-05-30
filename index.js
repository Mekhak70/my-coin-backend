// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

let lastUser = null;

app.post('/auth/telegram', (req, res) => {
  console.log('➡️ Incoming Telegram Data:', req.body);

  if (!lastUser) {
    const { id, username, first_name, last_name, photo_url } = req.body;
    lastUser = { id, username, first_name, last_name, photo_url };
    console.log('✅ User authenticated and stored:', lastUser);
  } else {
    console.log('ℹ️ User already stored, skipping.');
  }

  // Redirect to frontend after successful login
  res.redirect(`https://my-coin-app.vercel.app?auth=success`);
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
