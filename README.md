# Portfolio Backend

Express API for the portfolio contact form and public portfolio data.

## Local start

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Create a Gmail App Password and place it in `SMTP_PASS`. Do not use your normal Gmail password.
5. Run `npm run dev`.

Endpoints:

- `GET /api/health`
- `GET /api/portfolio`
- `POST /api/contact`

## Render

- Build command: `npm install`
- Start command: `npm start`
- Add all values from `.env.example` as Render environment variables.
- Set `FRONTEND_URL` to the final Vercel domain. Multiple domains can be comma-separated.

The contact endpoint validates input, rate-limits requests, uses a hidden honeypot field and sends email through SMTP.
