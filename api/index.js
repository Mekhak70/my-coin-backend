const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { checkTelegramAuth } = require('../utils'); // ✅ ուղին այսպես թող, եթե utils.js ու index.js միևնույն մակարդակում են

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello from My Coin Backend 🚀');
});

app.post('/auth/telegram', (req, res) => {
    console.log("🚀 Request body:", req.body);

    const { id, username, first_name, last_name, hash } = req.body;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    const isValid = checkTelegramAuth(req.body, botToken);

    if (isValid) {
        res.json({
            success: true,
            message: `Բարև, ${first_name || username || id}!`,
            user: { id, username, first_name, last_name },
        });
    } else {
        res.json({ success: false, message: 'Invalid Telegram login' });
    }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
