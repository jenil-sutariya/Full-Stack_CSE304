import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

function sanitize(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\n\r\t]/g, ' ').trim();
}

function createTransporter() {
  // Prefer explicit SMTP if provided
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback to Gmail OAuth2 if credentials exist
  if (
    process.env.GMAIL_CLIENT_ID &&
    process.env.GMAIL_CLIENT_SECRET &&
    process.env.GMAIL_REFRESH_TOKEN &&
    process.env.GMAIL_USER
  ) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      },
    });
  }

  throw new Error('No email transport configured. Provide SMTP_* or Gmail OAuth2 envs.');
}

function validateContactPayload({ name, email, subject, message }) {
  const errors = {};

  const cleanedName = sanitize(name);
  const cleanedEmail = sanitize(email);
  const cleanedSubject = sanitize(subject);
  const cleanedMessage = typeof message === 'string' ? message.trim() : '';

  if (!cleanedName || cleanedName.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanedEmail)) {
    errors.email = 'A valid email is required.';
  }
  if (!cleanedSubject || cleanedSubject.length < 3) {
    errors.subject = 'Subject must be at least 3 characters.';
  }
  if (!cleanedMessage || cleanedMessage.length < 10) {
    errors.message = 'Message must be at least 10 characters.';
  }

  return { errors, cleaned: { name: cleanedName, email: cleanedEmail, subject: cleanedSubject, message: cleanedMessage } };
}

app.post('/api/contact', async (req, res) => {
  const { errors, cleaned } = validateContactPayload(req.body || {});
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ ok: false, errors });
  }

  const { name, email, subject, message } = cleaned;

  try {
    const transporter = createTransporter();

    const toEmail = process.env.TO_EMAIL || process.env.SMTP_USER || process.env.GMAIL_USER;
    if (!toEmail) {
      return res.status(500).json({ ok: false, message: 'Email destination is not configured.' });
    }

    const info = await transporter.sendMail({
      from: `Portfolio Contact <${process.env.FROM_EMAIL || process.env.SMTP_USER || process.env.GMAIL_USER}>`,
      to: toEmail,
      replyTo: `${name} <${email}>`,
      subject: `[Portfolio] ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `
        <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; line-height:1.6;">
          <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr/>
          <p>${message.replace(/\n/g, '<br/>')}</p>
        </div>
      `,
    });

    return res.json({ ok: true, messageId: info.messageId });
  } catch (err) {
    console.error('Email send error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to send message. Try again later.' });
  }
});

// Fallback to index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



