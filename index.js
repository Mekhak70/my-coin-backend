const axios = require('axios');
const TELEGRAM_BOT_TOKEN = 'քո իրական BotFather token-ը';

async function setMenuButton() {
  try {
    const response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setChatMenuButton`, {
      menu_button: {
        type: 'web_app',
        text: 'Բացել My Coin App 🚀',
        web_app: {
          url: 'https://my-coin-app.vercel.app'
        }
      }
    });

    console.log('✅ WebApp կոճակը հաջողությամբ ավելացվեց:', response.data);
  } catch (error) {
    console.error('❌ Սխալ WebApp կոճակ ավելացնելիս:', error.response?.data || error.message);
  }
}

setMenuButton();
