const dns = require('dns').promises;

/** RFC-ish: local@domain.tld — rejects spaces, consecutive dots, trailing dots */
const EMAIL_REGEX =
  /^[a-z0-9](?:[a-z0-9._%+-]{0,62}[a-z0-9])?@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

/**
 * Common disposable / temporary inbox providers.
 * Blocks throwaway addresses used for spam without a paid verification API.
 */
const DISPOSABLE_DOMAINS = new Set([
  '0-mail.com',
  '10minutemail.com',
  '10minutemail.net',
  '10minmail.com',
  '20minutemail.com',
  '33mail.com',
  'anonbox.net',
  'anonymbox.com',
  'bccto.me',
  'burnermail.io',
  'discard.email',
  'discardmail.com',
  'dispostable.com',
  'dodgeit.com',
  'dontreg.com',
  'emailondeck.com',
  'fakeinbox.com',
  'fakemailgenerator.com',
  'getairmail.com',
  'getnada.com',
  'ghostmail.com',
  'guerrillamail.com',
  'guerrillamail.de',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamailblock.com',
  'harakirimail.com',
  'inboxalias.com',
  'inboxkitten.com',
  'jetable.org',
  'mail-temp.com',
  'mailcatch.com',
  'maildrop.cc',
  'mailforspam.com',
  'mailinator.com',
  'mailinator.net',
  'mailinator2.com',
  'mailnesia.com',
  'mailnull.com',
  'mailtemp.info',
  'meltmail.com',
  'mintemail.com',
  'mohmal.com',
  'mytemp.email',
  'mytempmail.com',
  'nada.email',
  'sharklasers.com',
  'spam4.me',
  'spamgourmet.com',
  'spamhole.com',
  'spaml.de',
  'temp-mail.org',
  'temp-mail.ru',
  'tempail.com',
  'tempinbox.com',
  'tempmail.com',
  'tempmail.net',
  'tempmailaddress.com',
  'tempmailer.com',
  'tempomail.fr',
  'throwaway.email',
  'throwawaymail.com',
  'tmpmail.net',
  'tmpmail.org',
  'trashmail.com',
  'trashmail.net',
  'trashmail.org',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'mailinator.org',
  'grr.la',
  'guerrillamail.info',
  'pokemail.net',
  'spam.la',
  'trash-mail.com',
  'mt2015.com',
  'emailfake.com',
  'crazymailing.com',
  'tempmailo.com',
  'tmpeml.com',
  'secmail.pro',
  '1secmail.com',
  '1secmail.org',
  '1secmail.net',
  'emailtemporario.com.br',
  'tempr.email',
  'tmpbox.net',
  'moakt.com',
  'temporary-mail.net',
  'disposablemail.com',
  'mailpoof.com',
  'fakemail.net',
  'trashmail.me',
  'mailscrap.com',
  'maildax.com',
  'dropmail.me',
  'emkei.cz',
  'linshiyouxiang.net',
]);

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(Object.assign(new Error('DNS timeout'), { code: 'ETIMEOUT' })), ms);
    }),
  ]);
}

function getDomain(email) {
  const at = email.lastIndexOf('@');
  if (at < 1) return null;
  return email.slice(at + 1).toLowerCase();
}

function isValidEmailFormat(email) {
  if (!email || typeof email !== 'string') return false;
  if (email.length > 254) return false;
  if (email.includes('..')) return false;
  return EMAIL_REGEX.test(email);
}

function isDisposableDomain(domain) {
  if (!domain) return true;
  if (DISPOSABLE_DOMAINS.has(domain)) return true;

  // Catch subdomains of known disposable hosts (e.g. foo.mailinator.com)
  for (const blocked of DISPOSABLE_DOMAINS) {
    if (domain.endsWith(`.${blocked}`)) return true;
  }
  return false;
}

/**
 * Confirms the domain can receive mail via MX (A/AAAA fallback per RFC 5321).
 * Transient DNS failures fail-open so real users aren't blocked by resolver blips.
 */
async function domainCanReceiveMail(domain, timeoutMs = 4000) {
  try {
    const mx = await withTimeout(dns.resolveMx(domain), timeoutMs);
    if (Array.isArray(mx) && mx.length > 0) return { ok: true };
  } catch (error) {
    if (error && (error.code === 'ENOTFOUND' || error.code === 'ENODATA')) {
      // continue to A/AAAA fallback
    } else if (error && error.code === 'ETIMEOUT') {
      return { ok: true, soft: true };
    } else {
      // SERVFAIL / network — fail open
      return { ok: true, soft: true };
    }
  }

  try {
    const [a, aaaa] = await Promise.all([
      withTimeout(dns.resolve4(domain), timeoutMs).catch(() => []),
      withTimeout(dns.resolve6(domain), timeoutMs).catch(() => []),
    ]);
    if ((a && a.length) || (aaaa && aaaa.length)) return { ok: true };
    return { ok: false, reason: 'no-mx' };
  } catch {
    return { ok: true, soft: true };
  }
}

/**
 * Full contact-form email gate.
 * @returns {{ valid: boolean, code?: string, message?: string }}
 */
async function validateContactEmail(email) {
  const trimmed = String(email || '').trim().toLowerCase();

  if (!isValidEmailFormat(trimmed)) {
    return {
      valid: false,
      code: 'invalid-format',
      message: 'Please enter a valid email address (example: name@gmail.com).',
    };
  }

  const domain = getDomain(trimmed);
  if (!domain || domain.length < 3) {
    return {
      valid: false,
      code: 'invalid-domain',
      message: 'That email domain looks invalid. Please use a real email address.',
    };
  }

  if (isDisposableDomain(domain)) {
    return {
      valid: false,
      code: 'disposable',
      message: 'Temporary or disposable emails are not allowed. Please use a permanent email.',
    };
  }

  const mxResult = await domainCanReceiveMail(domain);
  if (!mxResult.ok) {
    return {
      valid: false,
      code: 'unverifiable',
      message: 'This email domain cannot receive mail. Please use a verified email address.',
    };
  }

  return { valid: true, email: trimmed };
}

module.exports = {
  validateContactEmail,
  isValidEmailFormat,
  isDisposableDomain,
};
