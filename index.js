const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const TELEGRAM_BOT_TOKEN = '8032347633:AAHyrxvRw4fYDHkOsDwsLhCoLxNxCOegwzE'; // Օրինակ՝ 8832374563:AAHyxRvRw4FYDHkOsDwsLhCoLxNxC0egwzE

// ✅ Set WebApp Menu Button
async function setMenuButton() {
  try {
    const response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setChatMenuButton`, {
      menu_button: {
        type: 'web_app',
        text: 'Բացել My Coin App 🚀',
        web_app: {
          url: 'https://my-coin-app.vercel.app' // Քո կայքի հասցեն
        }
      }
    });

    console.log('✅ WebApp կոճակը հաջողությամբ ավելացվեց:', response.data);
  } catch (error) {
    console.error('❌ Սխալ WebApp կոճակ ավելացնելիս:', error.response?.data || error.message);
  }
}

// Հնարավոր է նաև միանգամից կանչես սա
setMenuButton();

app.get('/', (req, res) => {
  res.send('Hello from GoPay Bot Backend 🚀');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
