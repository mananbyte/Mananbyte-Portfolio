const https = require('https');

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

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const receiverEmail = process.env.RECEIVER_EMAIL;

  if (!resendApiKey || !receiverEmail) {
    return res.status(500).json({
      message: 'Server Configuration Error: Missing RESEND_API_KEY or RECEIVER_EMAIL'
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
    const safeEmail = escapeHtml(trimmedEmail);
    const safeMessage = escapeHtml(trimmedMessage).replace(/\n/g, '<br/>');

    const payload = JSON.stringify({
      from: 'Portfolio Contact <contact@send.mananbyte.app>',
      to: receiverEmail,
      reply_to: replyToAddress,
      subject: `New Portfolio Message from ${trimmedName} (${trimmedEmail})`,
      html: `
        <div style="font-family: Inter, Arial, sans-serif; color: #111827; line-height: 1.6;">
          <p style="margin: 0 0 16px; padding: 12px 16px; background: #f3e8ff; border-left: 4px solid #a855f7; border-radius: 8px;">
            <strong>Reply directly to this person:</strong>
            <a href="mailto:${safeEmail}" style="color: #7c3aed; text-decoration: none;">${safeEmail}</a>
          </p>
          <h3 style="margin-top: 0;">New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          <p><strong>Message:</strong><br/>${safeMessage}</p>
        </div>
      `
    });

    const options = {
      hostname: 'api.resend.com',
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const data = await new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let body = '';
        response.on('data', (chunk) => body += chunk);
        response.on('end', () => {
          try {
            resolve({ status: response.statusCode, data: JSON.parse(body) });
          } catch (e) {
            reject(new Error('Failed to parse response JSON'));
          }
        });
      });

      request.on('error', (e) => reject(e));
      request.write(payload);
      request.end();
    });

    if (data.status === 200 || data.status === 201) {
      return res.status(200).json({ success: true, message: 'Message sent!' });
    }

    console.error('Resend API error:', data.status, data.data);
    return res.status(data.status).json({
      success: false,
      message: data.data?.message || 'Email could not be sent.',
      details: data.data
    });
  } catch (error) {
    console.error('Error submitting form via Resend:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.toString()
    });
  }
};
