const https = require('https');

const FROM_ADDRESS = 'Abdul Manan <talk@mananbyte.app>';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const receiverEmail = process.env.RECEIVER_EMAIL;

  if (!resendApiKey || !receiverEmail) {
    return res.status(500).json({
      message: 'Server Configuration Error: Missing RESEND_API_KEY or RECEIVER_EMAIL',
    });
  }

  try {
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Missing required fields: name, email, message' });
    }

    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim().toLowerCase();
    const trimmedMessage = String(message).trim();

    if (!isValidEmail(trimmedEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    const replyToAddress = `${trimmedName} <${trimmedEmail}>`;
    const safeName = escapeHtml(trimmedName);
    const safeMessage = escapeHtml(trimmedMessage).replace(/\n/g, '<br/>');

    const [ownerResult, clientResult] = await Promise.all([
      sendResendEmail(resendApiKey, {
        from: FROM_ADDRESS,
        to: receiverEmail,
        reply_to: replyToAddress,
        subject: `New Portfolio Message from ${trimmedName} (${trimmedEmail})`,
        html: `
          <div style="font-family: Inter, Arial, sans-serif; color: #111827; line-height: 1.6;">
            <h3 style="margin-top: 0;">New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${escapeHtml(trimmedEmail)}</p>
            <p><strong>Message:</strong><br/>${safeMessage}</p>
          </div>
        `,
      }),
      sendResendEmail(resendApiKey, {
        from: FROM_ADDRESS,
        to: trimmedEmail,
        reply_to: receiverEmail,
        subject: 'Thanks for reaching out — Abdul Manan',
        html: `
          <div style="font-family: Inter, Arial, sans-serif; color: #111827; line-height: 1.6;">
            <p>Hi ${safeName},</p>
            <p>Thanks for contacting me through my portfolio. I received your message and will get back to you soon.</p>
            <p style="color: #6b7280; font-size: 14px;">— Abdul Manan<br/>talk@mananbyte.app</p>
          </div>
        `,
      }),
    ]);

    if (ownerResult.status !== 200 && ownerResult.status !== 201) {
      console.error('Resend owner notification error:', ownerResult.status, ownerResult.data);
      return res.status(ownerResult.status).json({
        success: false,
        message: ownerResult.data?.message || 'Email could not be sent.',
        details: ownerResult.data,
      });
    }

    if (clientResult.status !== 200 && clientResult.status !== 201) {
      console.error('Resend client confirmation error:', clientResult.status, clientResult.data);
    }

    return res.status(200).json({ success: true, message: 'Message sent!' });
  } catch (error) {
    console.error('Error submitting form via Resend:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.toString(),
    });
  }
};
