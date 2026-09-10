const {
  buildOwnerNotificationEmail,
  buildClientConfirmationEmail,
  theme,
} = require('./email-templates');
const { verifyConfirmToken } = require('./confirm-token');
const {
  FROM_ADDRESS,
  PORTFOLIO_URL,
  escapeHtml,
  sendResendEmail,
} = require('./mail');

function buildStatusPage({ title, heading, body, ctaHref, ctaLabel, ok }) {
  const accent = ok ? theme.accentPurple : '#ef4444';
  const eyebrow = ok ? 'Email Verified' : 'Confirmation Failed';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:${theme.bgDark};font-family:${theme.font};padding:24px;">
  <main style="width:100%;max-width:520px;background:${theme.bgStrong};border:1px solid ${theme.border};border-radius:16px;overflow:hidden;box-shadow:0 0 40px rgba(168,85,247,0.12);">
    <div style="padding:36px 28px 28px;text-align:center;background:linear-gradient(160deg,${theme.bgDark} 0%,${theme.accentGlow} 50%,${theme.accentDeep} 100%);">
      <p style="margin:0 0 10px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#e9d5ff;font-weight:700;">${eyebrow}</p>
      <h1 style="margin:0;font-size:28px;line-height:1.25;color:${theme.textPrimary};font-weight:800;">${heading}</h1>
      <p style="margin:14px auto 0;max-width:400px;font-size:15px;line-height:1.7;color:${theme.textSecondary};">${body}</p>
    </div>
    <div style="padding:28px;text-align:center;">
      <a href="${ctaHref}" style="display:inline-block;padding:13px 24px;font-size:13px;font-weight:700;color:#fff;text-decoration:none;border-radius:999px;background:linear-gradient(135deg,${accent},${theme.accentDeep});">${ctaLabel}</a>
      <p style="margin:18px 0 0;font-size:12px;color:${theme.textMuted};">mananbyte.app · talk@mananbyte.app</p>
    </div>
  </main>
</body>
</html>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const receiverEmail = process.env.RECEIVER_EMAIL;
  const token = (req.query && req.query.token) || '';

  const fail = (status, message) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(status).send(
      buildStatusPage({
        title: 'Confirmation failed',
        heading: 'Could not confirm',
        body: message,
        ctaHref: `${PORTFOLIO_URL}/#contact`,
        ctaLabel: 'Back to Contact',
        ok: false,
      })
    );
  };

  if (!resendApiKey || !receiverEmail) {
    return fail(500, 'Server configuration error. Please try again later.');
  }

  const verified = verifyConfirmToken(token);
  if (!verified.valid) {
    return fail(400, verified.message);
  }

  try {
    const { name, email, message } = verified.data;
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');
    const replyToAddress = `${name} <${email}>`;

    const [ownerResult, clientResult] = await Promise.all([
      sendResendEmail(resendApiKey, {
        from: FROM_ADDRESS,
        to: receiverEmail,
        reply_to: replyToAddress,
        subject: `New Portfolio Message from ${name} (${email})`,
        html: buildOwnerNotificationEmail({
          name: safeName,
          email: safeEmail,
          message: safeMessage,
        }),
      }),
      sendResendEmail(resendApiKey, {
        from: FROM_ADDRESS,
        to: email,
        reply_to: receiverEmail,
        subject: 'Thanks for reaching out — Abdul Manan',
        html: buildClientConfirmationEmail({ name: safeName }),
      }),
    ]);

    if (ownerResult.status !== 200 && ownerResult.status !== 201) {
      console.error('Resend owner notification error:', ownerResult.status, ownerResult.data);
      return fail(
        ownerResult.status || 500,
        ownerResult.data?.message || 'Your email was verified, but delivery failed. Please try again.'
      );
    }

    if (clientResult.status !== 200 && clientResult.status !== 201) {
      console.error('Resend client confirmation error:', clientResult.status, clientResult.data);
    }

    const redirectTo = `${PORTFOLIO_URL}/?confirmed=1#contact`;
    res.statusCode = 302;
    res.setHeader('Location', redirectTo);
    res.end();
  } catch (error) {
    console.error('Error confirming contact message:', error);
    return fail(500, 'Something went wrong while confirming your message. Please try again.');
  }
};
