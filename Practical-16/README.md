## Practical 16 — Portfolio Contact Form (Express + NodeMailer)

### Setup
1. Install dependencies:
   ```bash
   cd Practical-16
   npm install
   ```
2. Create `.env` in `Practical-16/` with either SMTP or Gmail OAuth2 values:
   ```bash
   PORT=5050
   # Option A: SMTP
   SMTP_HOST=smtp.yourprovider.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your_smtp_username
   SMTP_PASS=your_smtp_password

   # Option B: Gmail OAuth2 (no "less secure apps" needed)
   GMAIL_USER=your@gmail.com
   GMAIL_CLIENT_ID=...
   GMAIL_CLIENT_SECRET=...
   GMAIL_REFRESH_TOKEN=...

   FROM_EMAIL=portfolio@yourdomain.com
   TO_EMAIL=you@yourdomain.com
   ```

### Run
```bash
npm run dev
# or
npm start
```

Open `http://localhost:5050` and submit the form. A success or failure message will be shown.

### Notes
- The form posts to `/api/contact` and the server validates `name`, `email`, `subject`, and `message`.
- Emails are sent with NodeMailer using either SMTP or Gmail OAuth2 credentials.

### Gmail OAuth2 quick notes
- Create a project in Google Cloud Console → OAuth consent screen → External or Internal.
- Create OAuth 2.0 Client ID (Desktop app is fine for generating refresh token).
- Generate a refresh token using your Client ID/Secret and your Gmail account, then place values in `.env`.



