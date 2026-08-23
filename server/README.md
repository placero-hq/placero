# PlaceRo backend (admin/API)

Node.js + Express (plain JavaScript) + PostgreSQL. This service is used
**only** by the `/admin` dashboard and, read-only, at Vercel build time.
Public visitors never call it directly.

```
ADMIN / OWNER --> /admin (Vercel) --> this API (Render) --> PostgreSQL
PUBLIC USERS  --> static pages (Vercel) --> Apply Now --> external job URL
```

## 1. Local setup

```bash
cd placero-backend
npm install
cp .env.example .env
# edit .env: DATABASE_URL, JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD
npm run migrate        # creates the `admins` and `jobs` tables
npm run create-admin   # hashes ADMIN_PASSWORD and stores the admin account
npm run dev            # http://localhost:4000
```

`GET /health` returns `{ "ok": true }` once it's up.

## 2. PostgreSQL

Any managed Postgres works (Render's own Postgres is the simplest pairing).

1. Create a Postgres instance (Render dashboard -> New -> PostgreSQL, or any provider).
2. Copy its connection string into `DATABASE_URL`.
   - Use the **internal** connection string if the API and DB are both on Render.
3. Run `npm run migrate` once (and again any time `db/schema.sql` changes — it's idempotent).

## 3. Creating the admin account

V1 is a single admin account, stored in the `admins` table (username + bcrypt hash) —
not hardcoded in the frontend and not a plaintext env var check at request time.

```bash
ADMIN_USERNAME=placero_admin ADMIN_PASSWORD='a-strong-unique-password' npm run create-admin
```

Re-run it any time to rotate the password. After running it once, you can remove
`ADMIN_PASSWORD` from `.env`/Render — the hash is what's actually checked.

**To move beyond V1** (multiple admins, roles, password reset, SSO, etc.), everything
auth-related lives in `src/controllers/authController.js` and `src/middleware/requireAdmin.js`.
The `admins` table and JWT-cookie session model are intentionally simple so a real
auth provider can be swapped in later without touching the jobs API.

## 4. Deploying to Render

1. Push this folder to a Git repo (or a subfolder of your monorepo).
2. Render dashboard -> New -> Web Service -> point at the repo.
   - Root directory: `placero-backend` (if part of a monorepo)
   - Build command: `npm install`
   - Start command: `npm start`
3. Add every variable from `.env.example` in Render's Environment settings, with
   real values (see below for which ones matter where).
4. After first deploy, run the one-off commands from Render's shell (or locally
   against the same `DATABASE_URL`):
   ```bash
   npm run migrate
   npm run create-admin
   ```
5. Render will give you a service URL like `https://placero-backend.onrender.com`.
   That's the value for the frontend's `VITE_API_BASE_URL`.

### Environment variables — Render

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `DATABASE_SSL` | `true` if your Postgres provider requires SSL |
| `JWT_SECRET` | Long random string signing admin sessions |
| `JWT_EXPIRES_IN` | Session lifetime, e.g. `12h` |
| `SESSION_COOKIE_NAME` | Cookie name for the admin session |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Used once by `npm run create-admin`, not read at request time |
| `ADMIN_ALLOWED_ORIGINS` | Your deployed `/admin` origin(s), comma-separated |
| `PUBLIC_ALLOWED_ORIGINS` | Your public site origin(s), comma-separated |
| `VERCEL_DEPLOY_HOOK_URL` | Vercel deploy hook, so publishing a job triggers a rebuild |
| `PUBLIC_SITE_URL` | Used to build absolute URLs in `/api/sitemap.xml` |

Render's free tier sleeps when idle — that's fine here, because public pages
never depend on this service being awake; only `/admin` usage wakes it.

## 5. Importing existing jobs from Google Sheets

Google Sheets is not queried live. Export it once, then import:

1. In Google Sheets: **File -> Download -> Comma-separated values (.csv)**.
2. Save the file, e.g. `scripts/data/jobs-export.csv`.
3. Preview first (writes nothing):
   ```bash
   npm run import-jobs -- --file=./scripts/data/jobs-export.csv --dry-run
   ```
4. Run it for real:
   ```bash
   npm run import-jobs -- --file=./scripts/data/jobs-export.csv
   ```

The script matches common header spellings automatically (see `COLUMN_ALIASES`
in `scripts/import-jobs.js`) and skips any row missing a title or company,
listing exactly which rows it skipped so nothing is silently lost. Every
imported job is set to `status = draft` unless your sheet had an explicit
status column — review and publish from `/admin` rather than having anything
go live unreviewed. A sample file is at `scripts/data/jobs-export.sample.csv`.

## 6. API reference

**Admin (session-cookie authenticated — all under `/api/admin`)**
```
POST   /api/admin/login          { username, password } -> sets httpOnly cookie
POST   /api/admin/logout
GET    /api/admin/me
GET    /api/admin/jobs           ?status=&category=&search=
POST   /api/admin/jobs
GET    /api/admin/jobs/:id
PUT    /api/admin/jobs/:id
DELETE /api/admin/jobs/:id
POST   /api/admin/jobs/:id/publish
POST   /api/admin/jobs/:id/unpublish
```

**Public (no auth, read-only)**
```
GET /api/jobs             published, non-expired jobs
GET /api/jobs/:slug       one job (published or expired, for a graceful page)
GET /api/sitemap.xml      sitemap of live public URLs
GET /health
```

Every admin route returns `401` with no body-level detail beyond
`{ message: "Not authenticated" }` if the session cookie is missing, expired,
or invalid — this is enforced server-side in `requireAdmin`, not by the
frontend hiding the button. Calling `/api/admin/jobs` directly with curl and
no cookie will always 401.

## 7. Security notes

- Passwords are hashed with bcrypt (cost 12); the plaintext is never stored.
- Sessions are httpOnly, `secure` in production, signed JWTs — never readable
  or forgeable from browser JS.
- CORS is an explicit allow-list per surface (admin vs public); nothing runs
  with a wildcard origin + credentials.
- The database is only reachable from this API — nothing in the frontend
  bundle contains a connection string or credentials.
