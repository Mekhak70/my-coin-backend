const express = require('express');
const app = express();
const TELEGRAM_BOT_TOKEN = '7328505047:AAHj2VTMQ0aWCLOssN62Dkim4GKQKBTnDLk';
const axios = require('axios');

app.use(express.json());

app.post('/webhook', (req, res) => {
  const message = req.body.message;
  if (message) {
    const chatId = message.chat.id;
    console.log('✅ Chat ID:', chatId);

    // Example: send a message back to user
    axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: 'Hello! I received your message.'
    })
    .then(() => console.log('✅ Sent confirmation message'))
    .catch(err => console.error(err));
  }
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
