# Transparent Editor

A small authenticated sheet editor with an Express/Prisma PostgreSQL API and Vite React client.

## Setup
1. Create a PostgreSQL database named `transparent_editor`.
2. Copy `server/.env.example` to `server/.env` and set `DATABASE_URL`, a long `JWT_SECRET`,
   and the separate admin credentials `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Keep `.env` private.
3. Install dependencies: `npm run install:all`.
4. Create the database tables: `npm run db:generate` then `npm run db:migrate`.
5. Start both apps with `npm run dev`. The API is on `http://localhost:4000` and UI on `http://localhost:5173`.

Prisma commands explicitly load `server/.env` through `server/scripts/prisma.js`, so the
database URL is available both to the application and to Prisma migrations. The file must be
named exactly `.env` (not `.env.txt`).

The backend is organized by feature under `server/src/modules`: each feature keeps its
routes, controllers, and Prisma data-access model together. Shared configuration,
database access, and authentication middleware live under `config`, `lib`, and
`middleware`.

Prisma maps the application models to lowercase PostgreSQL tables named `user` and `sheet`.
This keeps table names lowercase even though the JavaScript model accessors remain
`prisma.user` and `prisma.sheet`.

User and sheet IDs are auto-incrementing PostgreSQL integers. Sheet `ownerId` is an integer
foreign key referencing `user.id`.

Registration requires a unique phone number in addition to email and password. Passwords are
never stored directly. Registration hashes them with bcrypt, and login verifies the hash before
issuing a short-lived API credential (JWT).

## Debug logs

The backend prints timestamped logs to the terminal running `npm run dev`. Logs include request
IDs, route start/completion, status codes, duration, authentication events, controller actions,
and Prisma database queries. Passwords and sheet content are intentionally not logged.

## API
`POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, and protected sheet CRUD at
`GET/POST /api/sheets`, `GET/PATCH/DELETE /api/sheets/:id`.

Admin access is separate from user accounts: `POST /api/admin/login` validates the admin ID or
email and password from `server/.env` with bcrypt and returns a short-lived JWT containing
`role: "admin"`.
`GET /api/admin/users` requires that token and returns account and sheet counts. `GET
/api/admin/users/:userId/sheets` fetches that user's sheets on demand. Password hashes are never
returned. The client exposes an “Admin sign in” link on the auth screen.
