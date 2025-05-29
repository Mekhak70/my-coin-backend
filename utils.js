const crypto = require('crypto');

function checkTelegramAuth(data, botToken) {
  const { hash, ...rest } = data;

  const dataCheckString = Object.keys(rest)
    .filter(key => rest[key])
    .sort()
    .map(key => `${key}=${rest[key]}`)
    .join('\n');

  const secret = crypto.createHash('sha256').update(botToken).digest();
  const hmac = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');

  // Debugging logs
  console.log('🔎 dataCheckString:', dataCheckString);
  console.log('🔎 hmac:', hmac);
  console.log('🔎 hash:', hash);

  return hmac === hash;
}

module.exports = { checkTelegramAuth };
