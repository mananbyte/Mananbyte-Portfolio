const crypto = require('crypto');

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function getConfirmSecret() {
  return process.env.CONFIRM_SECRET || process.env.RESEND_API_KEY || '';
}

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlDecode(value) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
  return Buffer.from(padded + pad, 'base64').toString('utf8');
}

function signPayload(payloadB64, secret) {
  const digest = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64');
  return digest.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

/**
 * Embed contact payload in a signed, time-limited token (no database required).
 */
function createConfirmToken({ name, email, message }) {
  const secret = getConfirmSecret();
  if (!secret) {
    throw new Error('Missing CONFIRM_SECRET (or RESEND_API_KEY) for signing confirmation tokens');
  }

  const now = Date.now();
  const payload = {
    n: name,
    e: email,
    m: message,
    iat: now,
    exp: now + TOKEN_TTL_MS,
    jti: crypto.randomBytes(8).toString('hex'),
  };

  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(payloadB64, secret);
  return `${payloadB64}.${signature}`;
}

function verifyConfirmToken(token) {
  const secret = getConfirmSecret();
  if (!secret) {
    return { valid: false, code: 'config', message: 'Confirmation is not configured on the server.' };
  }

  if (!token || typeof token !== 'string' || !token.includes('.')) {
    return { valid: false, code: 'invalid', message: 'This confirmation link is invalid.' };
  }

  const [payloadB64, signature] = token.split('.');
  if (!payloadB64 || !signature) {
    return { valid: false, code: 'invalid', message: 'This confirmation link is invalid.' };
  }

  const expected = signPayload(payloadB64, secret);
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return { valid: false, code: 'invalid', message: 'This confirmation link is invalid or has been tampered with.' };
  }

  let payload;
  try {
    payload = JSON.parse(base64UrlDecode(payloadB64));
  } catch {
    return { valid: false, code: 'invalid', message: 'This confirmation link is invalid.' };
  }

  if (!payload || !payload.n || !payload.e || !payload.m || !payload.exp) {
    return { valid: false, code: 'invalid', message: 'This confirmation link is incomplete.' };
  }

  if (Date.now() > Number(payload.exp)) {
    return {
      valid: false,
      code: 'expired',
      message: 'This confirmation link has expired. Please submit the contact form again.',
    };
  }

  return {
    valid: true,
    data: {
      name: String(payload.n),
      email: String(payload.e),
      message: String(payload.m),
    },
  };
}

module.exports = {
  createConfirmToken,
  verifyConfirmToken,
  TOKEN_TTL_MS,
};
