const https = require('https');

const FROM_ADDRESS = 'Abdul Manan <talk@mananbyte.app>';
const PORTFOLIO_URL = (process.env.SITE_URL || 'https://www.mananbyte.app').replace(/\/$/, '');

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sendResendEmail(apiKey, emailPayload) {
  const payload = JSON.stringify(emailPayload);

  const options = {
    hostname: 'api.resend.com',
    path: '/emails',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    },
  };

  return new Promise((resolve, reject) => {
    const request = https.request(options, (response) => {
      let body = '';
      response.on('data', (chunk) => {
        body += chunk;
      });
      response.on('end', () => {
        try {
          resolve({ status: response.statusCode, data: JSON.parse(body) });
        } catch (error) {
          reject(new Error('Failed to parse response JSON'));
        }
      });
    });

    request.on('error', reject);
    request.write(payload);
    request.end();
  });
}

module.exports = {
  FROM_ADDRESS,
  PORTFOLIO_URL,
  escapeHtml,
  sendResendEmail,
};
