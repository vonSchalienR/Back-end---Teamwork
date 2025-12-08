# Back-end Project (Courses + News)

This repository contains a small Node.js / Express backend for a courses website (course catalog, news, admin controls). It includes:

- Course management (create, edit, soft-delete) with slug generation
- User model with authentication (register/login) using bcrypt + sessions stored in MongoDB
- Admin-protected News (CRUD) with public listing and detail pages
- Admin user management page to grant admin role
- Security hardening: Helmet with CSP, CSRF protection, and rate limiting on `POST /login`

**Main tech:** Node.js, Express, Handlebars (views), Mongoose (MongoDB), express-session + connect-mongo

## Quick start

Requirements:

- Node.js (16+ recommended)
- MongoDB running locally or reachable via URI

Steps:

1. Install dependencies

```powershell
npm install
```

2. Configure environment variables (create a `.env` file in project root)

Required (recommended):

- `MONGO_URI` MongoDB connection string (defaults to `mongodb://127.0.0.1:27017/baokim_dev`)
- `SESSION_SECRET` a strong secret for sessions

Example `.env`:

```
MONGO_URI=mongodb://127.0.0.1:27017/baokim_dev
SESSION_SECRET=change_this_to_a_strong_secret
PORT=3000
```

3. Start the app

```powershell
npm run start
```

Open http://localhost:3000

4. Run tests (Jest)

```powershell
npm test
```

## Main routes (overview)

- `/` Home (shows featured courses)
- `/login`, `/register`, `/logout` authentication
- `/courses` courses routes (`/courses/create` protected for admins)
- `/news` public news list
- `/news/:slug` news detail
- `/news/create`, `/news/manage`, `/news/:id/edit` admin-only news management
- `/admin/users` admin-only user list with "Make admin" action

## Authentication & Authorization

- Passwords are hashed with `bcrypt` in the `User` model pre-save hook.
- Sessions are persisted in MongoDB using `connect-mongo` (configured in `src/index.js`).
- `role` field on `User` (`'user'` or `'admin'`) controls admin privileges.
- Middleware `src/middleware/authorize.js` provides `requireAuth` and `requireAdmin`.
- Rate limiting on `POST /login` (5 attempts per 15 minutes per IP) via `src/middleware/rateLimit.js`.
- CSRF protection enabled via `csurf` (session-based tokens exposed as `csrfToken` for forms).

To grant admin to an existing user (quick):

1. Connect to your MongoDB (via shell or GUI)
2. Update the user document:

```js
$db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } });
```

## Views and helpers

- Handlebars is used for server-side templates. Several helpers are registered in `src/index.js` (e.g., `truncate`, `ifEq`).

## Security notes (dev -> production)

- `SESSION_SECRET` must be set to a strong secret in production.
- Session cookie should be configured with `secure: true` when serving over HTTPS.
- Helmet with CSP is enabled in `src/index.js` and whitelists YouTube embeds plus CDN scripts/styles.
- Rate limiting protects login; consider adding per-account lockouts if needed.
- CSRF protection is active; ensure forms include the `_csrf` hidden field.
- Do not use MemoryStore for sessions in production this project uses `connect-mongo`.

## Development notes

- Models are in `src/app/models` (e.g., `User.js`, `Course.js`, `News.js`).
- Controllers are in `src/app/controllers`.
- Routes are in `src/routes` (registered from `src/routes/index.js`).
- Static assets and views are under `src/resources/public` and `src/resources/views`.

## Teamwork evaluation quick checklist (map to rubric)

- MVC: Controllers in `src/app/controllers`, routes in `src/routes`, models in `src/app/models`.
- Views: Handlebars templates (`src/resources/views`), includes partials/layouts to avoid repetition; >4 views (home, news, courses, auth, admin, profile, etc.).
- Template engine: Handlebars configured in `src/index.js`.
- Styling: SCSS compiled to `src/resources/public/css`; uses Bootstrap + custom styles; responsive layout.
- Accessibility: Semantic headings, labels on forms, link text kept clear; ensure ARIA updates when adding new UI.
- Persistence: MongoDB via Mongoose; models read/write data (`Course`, `User`, `News`).
- AuthZ/AuthN: Session-based auth, role-based admin, protected routes, login/logout; rate-limited login.
- Sessions/Cookies: `express-session` + `connect-mongo`.
- Routers separated: See `src/routes` and controllers.
- Automated tests: Jest configured; sample validators test present; run `npm test`.
- Security: Helmet CSP, rate limiting, password hashing.

## Next improvements (suggested)

- Add per-account lockout / MFA for auth
- Add flash messages for UX
- Normalize emails (lowercase) and improve validation
- Add deployment configuration (Docker, CI)

## Contributing

If you'd like to contribute, please open an issue or create a pull request. Keep PRs small and focused; include descriptive commit messages and testing steps.

---

Project maintained by the team. For local help, contact your project members or open an issue in this repo.
