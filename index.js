// index.js
const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Բերում է .env ֆայլի տվյալները

const app = express();
app.use(cors());
app.use(express.json());

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// ✅ Schema և Model
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);

// ✅ WebApp կոճակ
async function setMenuButton() {
  try {
    const response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setChatMenuButton`, {
      menu_button: {
        type: 'web_app',
        text: 'Բացել My Coin App 🚀',
        web_app: { url: 'https://my-coin-app.vercel.app' },
      },
    });
    console.log('✅ WebApp կոճակը հաջողությամբ ավելացվեց:', response.data);
  } catch (error) {
    console.error('❌ Սխալ WebApp կոճակ ավելացնելիս:', error.response?.data || error.message);
  }
}
setMenuButton();

// ✅ Get or Create User
app.post('/get-user', async (req, res) => {
  const { userId } = req.body;
  try {
    let user = await User.findOne({ userId });
    if (!user) {
      user = new User({ userId });
      await user.save();
    }
    res.json({ success: true, userId: user.userId, balance: user.balance });
  } catch (error) {
    console.error('❌ Error in /get-user:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ✅ Update Balance
app.post('/update-balance', async (req, res) => {
  const { userId, amount, action } = req.body;
  try {
    let user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    if (action === 'add') {
      user.balance += amount;
    } else if (action === 'remove') {
      if (user.balance < amount) {
        return res.status(400).json({ success: false, error: 'Not enough balance' });
      }
      user.balance -= amount;
    }

    await user.save();
    res.json({ success: true, userId: user.userId, balance: user.balance });
  } catch (error) {
    console.error('❌ Error in /update-balance:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ✅ Run Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
