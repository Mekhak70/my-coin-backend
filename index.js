const fetch = require('node-fetch'); // Հիմա ունես node-fetch

const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN'; // Այստեղ դիր քո բոտի տոքենը (առանց <>)!
const CHAT_ID = 'USER_CHAT_ID'; // Այստեղ դիր օգտատիրոջ chat_id

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

  fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    console.log('✅ Button sent:', result);
  })
  .catch(error => {
    console.error('❌ Error sending button:', error);
  });
}

sendWebAppButton();

