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
```

`ANALYTICS_ADMIN_SECRET` is used only in server-side fetches and must never be exposed to browser code.

## Vercel Deployment

Use the default Next.js settings:

- Framework Preset: `Next.js`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: leave empty

Set these Environment Variables in Vercel for Production, Preview, and Development as needed:

- `ANALYTICS_API_BASE_URL`
- `ANALYTICS_ADMIN_SECRET`

The backend must have the same `ANALYTICS_ADMIN_SECRET` configured and must expose `/api/admin/analytics/*`.
