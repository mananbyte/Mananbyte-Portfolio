const PORTFOLIO_URL = 'https://www.mananbyte.app';
const GITHUB_URL = 'https://github.com/mananbyte';
const LINKEDIN_URL = 'https://linkedin.com/in/mananbyte';

const theme = {
  bgDark: '#0b0b0b',
  bgRaised: '#0f0f0f',
  bgStrong: '#111111',
  accentPurple: '#a855f7',
  accentDeep: '#7c3aed',
  accentGlow: '#4c1d95',
  textPrimary: '#ffffff',
  textSecondary: '#d1d5db',
  textTertiary: '#9ca3af',
  textMuted: '#6b7280',
  border: 'rgba(255, 255, 255, 0.08)',
  borderHover: 'rgba(168, 85, 247, 0.25)',
  font: "Inter, Arial, Helvetica, sans-serif",
};

function primaryButton(url, label) {
  return `<a href="${url}" style="display:inline-block;padding:13px 24px;font-size:13px;font-weight:700;color:${theme.textPrimary};text-decoration:none;border-radius:999px;background:linear-gradient(135deg,${theme.accentPurple},${theme.accentDeep});margin:4px 6px;">${label}</a>`;
}

function secondaryButton(url, label) {
  return `<a href="${url}" style="display:inline-block;padding:12px 22px;font-size:13px;font-weight:600;color:${theme.textSecondary};text-decoration:none;border-radius:999px;background:${theme.bgRaised};border:1px solid ${theme.border};margin:4px 6px;">${label}</a>`;
}

function buildOwnerNotificationEmail({ name, email, message }) {
  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Karachi',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Portfolio Message</title>
</head>
<body style="margin:0;padding:0;background-color:${theme.bgDark};font-family:${theme.font};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${theme.bgDark};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background-color:${theme.bgStrong};border:1px solid ${theme.border};border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:28px 32px;background:linear-gradient(135deg,${theme.bgDark} 0%,${theme.accentGlow} 100%);border-bottom:1px solid ${theme.borderHover};">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${theme.accentPurple};font-weight:700;">Portfolio · New Message</p>
              <h1 style="margin:0;font-size:24px;line-height:1.3;color:${theme.textPrimary};font-weight:800;">Contact Form Submission</h1>
              <p style="margin:10px 0 0;font-size:14px;color:${theme.textSecondary};">A new inquiry arrived on mananbyte.app</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${theme.bgRaised};border:1px solid ${theme.border};border-radius:12px;">
                <tr>
                  <td style="padding:20px 22px;">
                    <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${theme.accentPurple};">Sender</p>
                    <p style="margin:0 0 8px;font-size:15px;color:${theme.textPrimary};"><strong style="color:${theme.textSecondary};">Name</strong><br/>${name}</p>
                    <p style="margin:0 0 8px;font-size:15px;color:${theme.textPrimary};"><strong style="color:${theme.textSecondary};">Email</strong><br/><a href="mailto:${email}" style="color:${theme.accentPurple};text-decoration:none;">${email}</a></p>
                    <p style="margin:0;font-size:12px;color:${theme.textTertiary};">${timestamp} · PKT</p>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 10px;font-size:11px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${theme.accentPurple};">Message</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${theme.bgRaised};border-left:3px solid ${theme.accentPurple};border-radius:12px;">
                <tr>
                  <td style="padding:20px 22px;font-size:15px;line-height:1.75;color:${theme.textSecondary};">${message}</td>
                </tr>
              </table>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:28px auto 0;">
                <tr>
                  <td align="center">
                    ${primaryButton(`mailto:${email}`, `Reply to ${name}`)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px;border-top:1px solid ${theme.border};text-align:center;background-color:${theme.bgDark};">
              <p style="margin:0;font-size:12px;color:${theme.textTertiary};">Abdul Manan · <a href="${PORTFOLIO_URL}" style="color:${theme.accentPurple};text-decoration:none;">mananbyte.app</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildClientConfirmationEmail({ name }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thanks for reaching out</title>
</head>
<body style="margin:0;padding:0;background-color:${theme.bgDark};font-family:${theme.font};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${theme.bgDark};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background-color:${theme.bgStrong};border:1px solid ${theme.border};border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:36px 32px 28px;text-align:center;background:linear-gradient(180deg,${theme.accentGlow} 0%,${theme.bgStrong} 85%);">
              <p style="margin:0 0 12px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${theme.accentPurple};font-weight:700;">Message Received</p>
              <h1 style="margin:0;font-size:28px;line-height:1.25;color:${theme.textPrimary};font-weight:800;">Thanks, ${name}!</h1>
              <p style="margin:16px auto 0;max-width:440px;font-size:15px;line-height:1.75;color:${theme.textSecondary};">
                I received your message and will get back to you soon. In the meantime, feel free to explore my portfolio, projects, and open-source work.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 32px 28px;text-align:center;">
              <p style="margin:0 0 18px;font-size:11px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:${theme.textTertiary};">Continue Exploring</p>
              <p style="margin:0 0 20px;">
                ${primaryButton(`${PORTFOLIO_URL}#projects`, 'View My Projects')}
                ${primaryButton(PORTFOLIO_URL, 'Visit Portfolio')}
              </p>
              <p style="margin:0;">
                ${secondaryButton(LINKEDIN_URL, 'LinkedIn')}
                ${secondaryButton(GITHUB_URL, 'GitHub')}
                ${secondaryButton(`${PORTFOLIO_URL}#contact`, 'Contact Again')}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 32px;border-top:1px solid ${theme.border};text-align:center;background-color:${theme.bgDark};">
              <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:${theme.textPrimary};">Abdul Manan</p>
              <p style="margin:0 0 6px;font-size:13px;color:${theme.textTertiary};">CS Undergrad @ NUST · ML Engineer</p>
              <p style="margin:0;font-size:13px;"><a href="mailto:talk@mananbyte.app" style="color:${theme.accentPurple};text-decoration:none;">talk@mananbyte.app</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = {
  buildOwnerNotificationEmail,
  buildClientConfirmationEmail,
};
