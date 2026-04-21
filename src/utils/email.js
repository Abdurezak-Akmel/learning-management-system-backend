import nodemailer from 'nodemailer';

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  FROM_EMAIL,
} = process.env;

let transporter = null;
if (SMTP_HOST && SMTP_USER) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465, // true for port 465, false for others
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    // Useful for cloud deployments where connections might be flaky
    connectionTimeout: 10000, // 10 seconds
    tls: {
      // Do not fail on invalid certs (common requirement for some SMTP setups)
      rejectUnauthorized: false
    }
  });
}

/**
 * Send a verification token by email. If SMTP isn't configured this will log the token instead.
 * The recipient should enter this token in the frontend to complete verification.
 * @param {string} to - recipient email
 * @param {string} token - verification token
 * @param {{subject?:string, from?:string, htmlTemplate?:function}} options
 */
export async function sendVerificationEmail(to, token, options = {}) {
  const subject = options.subject || 'Verify your email';
  const from = options.from || FROM_EMAIL || 'no-reply@example.com';

  const html = options.htmlTemplate
    ? options.htmlTemplate({ token, to })
    : `<p>Hi,</p><p>Thanks for registering. Enter the following verification token in the app to verify your email:</p><pre style="background:#f4f4f4;padding:10px;border-radius:4px;">${token}</pre><p>If you didn't request this, you can ignore this email.</p>`;

  const text = `Your verification token: ${token}`;

  if (!transporter) {
    // Fallback for development: log the token instead of sending
    // eslint-disable-next-line no-console
    console.log('Verification token (not sent - no SMTP configured):', { to, subject, token });
    return { mocked: true, to, subject, token };
  }

  const info = await transporter.sendMail({ from, to, subject, text, html });
  return info;
}

/**
 * Generic email send wrapper.
 */
export async function sendEmail({ to, subject, text, html, from }) {
  const mail = { from: from || FROM_EMAIL || 'no-reply@example.com', to, subject, text, html };
  if (!transporter) {
    // eslint-disable-next-line no-console
    console.log('Email (not sent - no SMTP configured):', mail);
    return { mocked: true, mail };
  }
  return transporter.sendMail(mail);
}

export default { sendVerificationEmail, sendEmail };
