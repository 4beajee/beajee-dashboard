# Gennety Analytics OS

Internal analytics dashboard for Gennety.

## Local Development

```bash
npm install
cp .env.example .env
npm run dev
```

The dashboard runs on `http://localhost:3001`.

Required environment variables:

```env
ANALYTICS_API_BASE_URL=https://your-gennety-backend.example.com
ANALYTICS_ADMIN_SECRET=your-shared-server-side-secret
DASHBOARD_BASIC_AUTH_USER=admin
DASHBOARD_BASIC_AUTH_PASSWORD=your-strong-dashboard-password
DASHBOARD_AUTH_COOKIE_SECRET=your-random-cookie-signing-secret
```

`ANALYTICS_ADMIN_SECRET` is used only in server-side fetches and must never be exposed to browser code.
If the dashboard auth variables are omitted, the app will not require dashboard login.

## Vercel Deployment

Use the default Next.js settings:

- Framework Preset: `Next.js`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: leave empty

Set these Environment Variables in Vercel for Production, Preview, and Development as needed:

- `ANALYTICS_API_BASE_URL`
- `ANALYTICS_ADMIN_SECRET`
- `DASHBOARD_BASIC_AUTH_USER`
- `DASHBOARD_BASIC_AUTH_PASSWORD`
- `DASHBOARD_AUTH_COOKIE_SECRET`

The backend must have the same `ANALYTICS_ADMIN_SECRET` configured and must expose `/api/admin/analytics/*`.
