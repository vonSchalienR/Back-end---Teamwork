# Back-end Project (Courses + News)

This repository contains a small Node.js / Express backend for a courses website. It includes:

- Course management (create, edit, soft-delete) with slug generation
- User model with authentication (register/login) using bcrypt + sessions stored in MongoDB
- Admin-protected News (CRUD) with public listing and detail pages

This README explains how to set up and run the project locally and highlights important implementation details.

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

- `MONGO_URI`  MongoDB connection string (defaults to `mongodb://127.0.0.1:27017/baokim_dev`)
- `SESSION_SECRET`  a strong secret for sessions

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

## Main routes (overview)

- `/`  Home (shows featured courses)
- `/login`, `/register`, `/logout`  authentication
- `/courses`  courses routes (`/courses/create` protected for admins)
- `/news`  public news list
- `/news/:slug`  news detail
- `/news/create`, `/news/manage`, `/news/:id/edit`  admin-only news management

## Authentication & Authorization

- Passwords are hashed with `bcrypt` in the `User` model pre-save hook.
- Sessions are persisted in MongoDB using `connect-mongo` (configured in `src/index.js`).
- `role` field on `User` (`'user'` or `'admin'`) controls admin privileges.
- Middleware `src/middleware/authorize.js` provides `requireAuth` and `requireAdmin`.

To grant admin to an existing user (quick):

1. Connect to your MongoDB (via shell or GUI)
2. Update the user document:

```js
$db.users.updateOne({ email: 'you@example.com' }, { $set: { role: 'admin' } })
```

## Views and helpers

- Handlebars is used for server-side templates. Several helpers are registered in `src/index.js` (e.g., `truncate`, `ifEq`).

## Security notes (dev -> production)

- `SESSION_SECRET` must be set to a strong secret in production.
- Session cookie should be configured with `secure: true` when serving over HTTPS.
- Add CSRF protection (`csurf`) and rate limiting for `POST /login` to harden the app.
- Do not use MemoryStore for sessions in production  this project uses `connect-mongo`.

## Development notes

- Models are in `src/app/models` (e.g., `User.js`, `Course.js`, `News.js`).
- Controllers are in `src/app/controllers`.
- Routes are in `src/routes` (registered from `src/routes/index.js`).
- Static assets and views are under `src/resources/public` and `src/resources/views`.

## Next improvements (suggested)

- Add CSRF protection and rate limits
- Add flash messages for UX
- Normalize emails (lowercase) and improve validation
- Add deployment configuration (Docker, CI)

## Contributing

If you'd like to contribute, please open an issue or create a pull request. Keep PRs small and focused; include descriptive commit messages and testing steps.

---
Project maintained by the team. For local help, contact your project members or open an issue in this repo.
