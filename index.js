const axios = require('axios'); // Օգտագործում ենք axios

const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN';
const CHAT_ID = 'USER_CHAT_ID'; // Քո chat_id

function sendWebAppButton() {
  const data = {
    chat_id: CHAT_ID,
    text: 'Բարի գալուստ My Coin App 🚀',
    reply_markup: {
      keyboard: [
        [
          {
            text: 'Բացել My Coin App 🚀',
            web_app: {
              url: 'https://my-coin-app.vercel.app/'
            }
          }
        ]
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  };

  axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, data)
    .then(response => {
      console.log('✅ Button sent:', response.data);
    })
    .catch(error => {
      console.error('❌ Error sending button:', error);
    });
}

sendWebAppButton();
