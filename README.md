# Portfolio Backend

REST API for the portfolio: MongoDB projects, search and filters, protected project management, contact messages and two-way email notifications.

## Stack

- Node.js + Express
- MongoDB Atlas + Mongoose
- Zod validation
- Nodemailer with Gmail SMTP
- Helmet, CORS and request rate limiting

## Local setup

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Insert your MongoDB Atlas connection string into `MONGODB_URI`.
5. Generate a long admin secret with `openssl rand -hex 32` and use it as `ADMIN_API_KEY`.
6. Add a Gmail App Password to `SMTP_PASS`. Never use your regular Gmail password.
7. Run `npm run dev`.

The API starts at `http://localhost:4000`.

## Environment variables

```env
PORT=4000
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/portfolio?retryWrites=true&w=majority
ADMIN_API_KEY=replace_with_a_long_random_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=vldgum@gmail.com
SMTP_PASS=your_gmail_app_password
CONTACT_TO=vldgum@gmail.com
```

## Project API

Public endpoints:

- `GET /api/projects`
- `GET /api/projects/:slug`

Example:

```text
GET /api/projects?search=react&type=commercial&stack=Next.js&featured=true&sort=createdAt&order=desc&page=1&limit=10
```

Response:

```json
{
  "items": [],
  "total": 0,
  "page": 1,
  "limit": 10,
  "pages": 0
}
```

Protected endpoints require the `x-admin-key` header:

- `POST /api/projects`
- `PATCH /api/projects/:id`
- `DELETE /api/projects/:id`

A ready request body is available in `examples/project.json`.

```bash
curl -X POST http://localhost:4000/api/projects \
  -H "Content-Type: application/json" \
  -H "x-admin-key: YOUR_ADMIN_API_KEY" \
  --data-binary @examples/project.json
```

You can also add documents in MongoDB Atlas using the same structure as `examples/project.json`. Mongoose automatically adds timestamps only when data is created through the API.

## Contact form

Endpoint: `POST /api/contact`

```json
{
  "name": "Client name",
  "email": "client@example.com",
  "message": "Hello, I would like to discuss a project.",
  "language": "en",
  "company": ""
}
```

The endpoint validates and rate-limits the request, saves it in MongoDB, sends the message to you, sends a localized confirmation to the sender, and records both delivery results.

## Other endpoints

- `GET /api/health`
- `GET /api/portfolio`

## Render deployment

- Build command: `npm install`
- Start command: `npm start`
- Add every variable from `.env.example` in Render Environment.
- Set `FRONTEND_URL` to the Vercel URL. Multiple URLs can be comma-separated.

## Next step

Connect the frontend project grid to `GET /api/projects`, then connect the form to `POST /api/contact`. Add the AI assistant afterward with a separate API key, rate limit and portfolio-only knowledge scope.
