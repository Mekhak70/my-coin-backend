// utils.js
const crypto = require('crypto');

function checkTelegramAuth(data, botToken) {
  const { hash, ...rest } = data;

  const dataCheckString = Object.keys(rest)
    .filter(key => rest[key]) // Անտեսում ենք դատարկ դաշտերը
    .sort()
    .map(key => `${key}=${rest[key]}`)
    .join('\n');

  const secret = crypto.createHash('sha256').update(botToken).digest();
  const hmac = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');

  return hmac === hash;
}

module.exports = { checkTelegramAuth };
