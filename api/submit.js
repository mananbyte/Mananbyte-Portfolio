const { buildConfirmRequestEmail } = require('./email-templates');
const { validateContactEmail } = require('./email-validation');
const { createConfirmToken, TOKEN_TTL_MS } = require('./confirm-token');
const {
  FROM_ADDRESS,
  PORTFOLIO_URL,
  escapeHtml,
  sendResendEmail,
} = require('./mail');

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
    const { name, email, message, website } = req.body || {};

    // Honeypot filled → treat as bot, fake success so scrapers don't retry
    if (website) {
      return res.status(200).json({
        success: true,
        pendingConfirmation: true,
        message: 'Check your email to confirm your message.',
      });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Missing required fields: name, email, message' });
    }

    const trimmedName = String(name).trim();
    const trimmedMessage = String(message).trim();

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return res.status(400).json({ message: 'Please provide a valid name.' });
    }

    if (trimmedMessage.length < 10 || trimmedMessage.length > 5000) {
      return res.status(400).json({
        message: 'Message must be between 10 and 5000 characters.',
      });
    }

    const emailCheck = await validateContactEmail(email);
    if (!emailCheck.valid) {
      return res.status(400).json({
        message: emailCheck.message,
        code: emailCheck.code,
      });
    }

    const trimmedEmail = emailCheck.email;
    const token = createConfirmToken({
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
    });

    const confirmUrl = `${PORTFOLIO_URL}/api/confirm?token=${encodeURIComponent(token)}`;
    const safeName = escapeHtml(trimmedName);
    const expiresInMinutes = Math.round(TOKEN_TTL_MS / 60000);

    const confirmResult = await sendResendEmail(resendApiKey, {
      from: FROM_ADDRESS,
      to: trimmedEmail,
      reply_to: receiverEmail,
      subject: 'Confirm your message — Abdul Manan',
      html: buildConfirmRequestEmail({
        name: safeName,
        confirmUrl,
        expiresInMinutes,
      }),
    });

    if (confirmResult.status !== 200 && confirmResult.status !== 201) {
      console.error('Resend confirm-request error:', confirmResult.status, confirmResult.data);
      return res.status(confirmResult.status).json({
        success: false,
        message:
          confirmResult.data?.message ||
          'Could not send a confirmation email to that address. Please use a real inbox.',
        details: confirmResult.data,
      });
    }

    return res.status(200).json({
      success: true,
      pendingConfirmation: true,
      message: 'Check your email and click the confirmation link to deliver your message.',
    });
  } catch (error) {
    console.error('Error starting contact confirmation:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.toString(),
    });
  }
};
