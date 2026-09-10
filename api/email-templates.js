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
  const initial = String(name).trim().charAt(0).toUpperCase() || 'M';

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
            <td style="padding:32px;text-align:center;background:linear-gradient(160deg,${theme.bgDark} 0%,${theme.accentGlow} 45%,${theme.accentDeep} 100%);">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto 16px;">
                <tr>
                  <td align="center" style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,${theme.accentPurple},${theme.accentDeep});color:${theme.textPrimary};font-size:22px;font-weight:800;line-height:56px;">
                    ${initial}
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:2.2px;text-transform:uppercase;color:#e9d5ff;font-weight:700;">✦ New Inquiry · mananbyte.app</p>
              <h1 style="margin:0;font-size:26px;line-height:1.25;color:${theme.textPrimary};font-weight:800;">${name} just messaged you</h1>
              <p style="margin:12px auto 0;max-width:420px;font-size:14px;line-height:1.6;color:${theme.textSecondary};">A fresh contact form submission landed in your portfolio inbox.</p>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 28px 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td width="50%" style="padding:8px 6px 8px 0;vertical-align:top;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${theme.bgRaised};border:1px solid ${theme.borderHover};border-radius:12px;">
                      <tr>
                        <td style="padding:16px 18px;">
                          <p style="margin:0 0 6px;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:${theme.accentPurple};font-weight:700;">From</p>
                          <p style="margin:0;font-size:15px;font-weight:700;color:${theme.textPrimary};">${name}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td width="50%" style="padding:8px 0 8px 6px;vertical-align:top;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${theme.bgRaised};border:1px solid ${theme.borderHover};border-radius:12px;">
                      <tr>
                        <td style="padding:16px 18px;">
                          <p style="margin:0 0 6px;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:${theme.accentPurple};font-weight:700;">When</p>
                          <p style="margin:0;font-size:13px;font-weight:600;color:${theme.textSecondary};">${timestamp} PKT</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:12px 28px 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${theme.bgRaised};border:1px solid ${theme.border};border-radius:12px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 6px;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:${theme.accentPurple};font-weight:700;">Reply Email</p>
                    <p style="margin:0;font-size:15px;"><a href="mailto:${email}" style="color:${theme.accentPurple};text-decoration:none;font-weight:600;">${email}</a></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:18px 28px 8px;">
              <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${theme.accentPurple};">Message</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:linear-gradient(180deg,${theme.bgRaised} 0%,#14091f 100%);border:1px solid ${theme.borderHover};border-left:4px solid ${theme.accentPurple};border-radius:12px;">
                <tr>
                  <td style="padding:22px 24px;font-size:15px;line-height:1.8;color:${theme.textSecondary};">${message}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:22px 28px 30px;text-align:center;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${theme.bgRaised};border:1px solid ${theme.borderHover};border-radius:12px;margin-bottom:18px;">
                <tr>
                  <td style="padding:16px 18px;text-align:center;">
                    <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:${theme.textPrimary};">How to reply in this thread</p>
                    <p style="margin:0;font-size:13px;line-height:1.6;color:${theme.textTertiary};">Use your email client's <strong style="color:${theme.accentPurple};">Reply</strong> button. It will send to ${email} and keep this conversation in the same thread.</p>
                  </td>
                </tr>
              </table>
              <p style="margin:0;">
                ${secondaryButton(PORTFOLIO_URL, 'Open Portfolio')}
                ${secondaryButton(`${PORTFOLIO_URL}#contact`, 'Contact Section')}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:18px 28px;border-top:1px solid ${theme.border};text-align:center;background-color:${theme.bgDark};">
              <p style="margin:0 0 4px;font-size:12px;color:${theme.textTertiary};">Automated alert from your portfolio contact form</p>
              <p style="margin:0;font-size:12px;"><a href="${PORTFOLIO_URL}" style="color:${theme.accentPurple};text-decoration:none;">mananbyte.app</a> · talk@mananbyte.app</p>
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
              <p style="margin:0 0 12px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${theme.accentPurple};font-weight:700;">Email Confirmed</p>
              <h1 style="margin:0;font-size:28px;line-height:1.25;color:${theme.textPrimary};font-weight:800;">Thanks, ${name}!</h1>
              <p style="margin:16px auto 0;max-width:440px;font-size:15px;line-height:1.75;color:${theme.textSecondary};">
                Your email is verified and your message is on its way to me. I will get back to you soon. Meanwhile, feel free to explore my portfolio and projects.
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

/**
 * Sent immediately after form submit — user must click to verify inbox ownership.
 */
function buildConfirmRequestEmail({ name, confirmUrl, expiresInMinutes = 60 }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm your message</title>
</head>
<body style="margin:0;padding:0;background-color:${theme.bgDark};font-family:${theme.font};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${theme.bgDark};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background-color:${theme.bgStrong};border:1px solid ${theme.border};border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:36px 32px 24px;text-align:center;background:linear-gradient(160deg,${theme.bgDark} 0%,${theme.accentGlow} 45%,${theme.accentDeep} 100%);">
              <p style="margin:0 0 10px;font-size:11px;letter-spacing:2.2px;text-transform:uppercase;color:#e9d5ff;font-weight:700;">✦ Verify Email · mananbyte.app</p>
              <h1 style="margin:0;font-size:28px;line-height:1.25;color:${theme.textPrimary};font-weight:800;">Confirm your message, ${name}</h1>
              <p style="margin:14px auto 0;max-width:440px;font-size:15px;line-height:1.7;color:${theme.textSecondary};">
                One quick step left. Click the button below to verify this inbox — only then will your message be delivered to Abdul.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 8px;text-align:center;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${theme.bgRaised};border:1px solid ${theme.borderHover};border-radius:12px;margin-bottom:22px;">
                <tr>
                  <td style="padding:18px 20px;text-align:left;">
                    <p style="margin:0 0 8px;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:${theme.accentPurple};font-weight:700;">Why this email?</p>
                    <p style="margin:0;font-size:14px;line-height:1.7;color:${theme.textSecondary};">
                      This stops spam and fake addresses. If you did not submit a message on
                      <a href="${PORTFOLIO_URL}" style="color:${theme.accentPurple};text-decoration:none;">mananbyte.app</a>, you can ignore this email.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 22px;">
                ${primaryButton(confirmUrl, 'Confirm &amp; Send Message')}
              </p>

              <p style="margin:0 0 6px;font-size:12px;line-height:1.6;color:${theme.textMuted};">
                Button not working? Paste this link into your browser:
              </p>
              <p style="margin:0 0 18px;font-size:12px;line-height:1.5;word-break:break-all;">
                <a href="${confirmUrl}" style="color:${theme.accentPurple};text-decoration:none;">${confirmUrl}</a>
              </p>
              <p style="margin:0;font-size:12px;color:${theme.textTertiary};">
                This link expires in <strong style="color:${theme.textSecondary};">${expiresInMinutes} minutes</strong>.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 32px;border-top:1px solid ${theme.border};text-align:center;background-color:${theme.bgDark};">
              <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:${theme.textPrimary};">Abdul Manan</p>
              <p style="margin:0 0 6px;font-size:13px;color:${theme.textTertiary};">CS Undergrad @ NUST · ML Engineer</p>
              <p style="margin:0;font-size:13px;">
                <a href="${PORTFOLIO_URL}" style="color:${theme.accentPurple};text-decoration:none;">mananbyte.app</a>
                ·
                <a href="mailto:talk@mananbyte.app" style="color:${theme.accentPurple};text-decoration:none;">talk@mananbyte.app</a>
              </p>
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
  theme,
  PORTFOLIO_URL,
  buildOwnerNotificationEmail,
  buildClientConfirmationEmail,
  buildConfirmRequestEmail,
};