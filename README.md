# AstroWatch

**Space Observatory Monitoring and Management System**

A centralized MERN-stack web application that helps observatory staff manage day-to-day operations: equipment status, maintenance scheduling, observation planning, weather monitoring, and a live operations dashboard — all backed by a real MongoDB database with cross-module conflict validation.

> Academic project. AstroWatch manages and simulates observatory operations in software; it does not control real telescope hardware. Real IoT/hardware integration is listed under Future Scope.

---

## Description

Observatories juggle several moving parts at once: is the telescope working, is it booked for maintenance, is the sky even clear enough to observe tonight, and does a new observation clash with something already scheduled? AstroWatch brings all four of those questions into one dashboard.

The standout feature is **cross-module validation**: before any observation is saved, the backend checks the Equipment, Maintenance, and Observation collections together — not just the one you're editing — and returns a clear, human-readable reason if the request can't be scheduled.

## Features

- **Authentication & Roles** — JWT-based login/register, bcrypt password hashing, persistent sessions, and role-based access for **Admin**, **Technician**, and **Observer**. Public registration is limited to Technician/Observer; Admin cannot be self-created.
- **Dashboard** — live stats (equipment counts, maintenance counts, observation counts), current weather + observation suitability, equipment status breakdown, upcoming observations/maintenance, recent activity — all computed from real database data.
- **Equipment Management** — Admin has full CRUD; Technician and Observer accounts have read-only access. Includes search, filters, and color-coded status/condition badges.
- **Maintenance Management** — Admin creates/edits/deletes tasks and assigns them to registered **Technician** accounts using `ObjectId` references. Technicians see only their own assigned tasks and can update only status/notes. Equipment status auto-syncs with the task lifecycle (In Progress → Maintenance, Completed → Operational).
- **Observation Planning** — Admin schedules observations and assigns them to registered **Observer** accounts. Observers see only their assigned observations and can update status/notes. The scheduling workflow still performs the core conflict checks:
  1. Does the equipment exist?
  2. Is it Operational (not Offline/under Maintenance)? Warning-status equipment is allowed but flagged.
  3. Does it have a conflicting Scheduled/In-Progress maintenance task that day?
  4. Does the requested time overlap another observation on the same equipment/day?

  Only if all four pass does AstroWatch show **"Observation Scheduled Successfully."** Otherwise it returns a specific, meaningful conflict message.
- **Weather Monitoring** — OpenWeather integration through the backend (API key never exposed to the browser), with a basic Suitable / Moderate / Unfavorable observation-suitability indicator, and a clearly-labelled demo-data fallback if the API key is missing or the request fails.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router DOM, Axios, Tailwind CSS, react-hot-toast, lucide-react |
| Backend | Node.js, Express.js, REST API |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT (jsonwebtoken), bcryptjs |
| External API | OpenWeather (Current Weather Data API) |

## Project Structure

```
AstroWatch/
├── client/                      # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # ProtectedRoute, StatusBadge, Loader, ConfirmModal, EmptyState
│   │   │   ├── dashboard/       # StatCard, WeatherWidget, EquipmentStatusChart
│   │   │   └── layout/          # Sidebar, Header, DashboardLayout
│   │   ├── context/             # AuthContext (persistent login)
│   │   ├── pages/                # Login, Register, Dashboard, Equipment(+Form), Maintenance(+Form), Observations(+Form), Weather, NotFound
│   │   ├── services/             # api.js + service files, including user role directory
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Express backend
│   ├── config/db.js             # MongoDB connection
│   ├── controllers/             # auth, users, equipment, maintenance, observation, weather, dashboard
│   ├── middleware/               # authMiddleware (protect/authorize), errorMiddleware
│   ├── models/                   # User, Equipment, Maintenance, Observation
│   ├── routes/                   # one router per resource
│   ├── services/weatherService.js
│   ├── seed/seed.js              # demo data seeder
│   ├── .env.example
│   └── server.js
│
└── README.md
```

## Prerequisites

- **Node.js** v18 or later (includes npm)
- **MongoDB** — either:
  - Local install running on `mongodb://127.0.0.1:27017`, or
  - A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster (get a connection string)
- (Optional but recommended) A free [OpenWeather API key](https://openweathermap.org/api) — the app runs fine without one using demo weather data

## Installation

### 1. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Open `server/.env` and fill in your values (see [Environment Variables](#environment-variables) below). At minimum, set `MONGO_URI`.

```bash
npm run seed     # populates the database with demo data (see below)
npm run dev      # starts the API on http://localhost:5000 (nodemon, auto-reload)
```

### 2. Frontend setup (in a new terminal)

```bash
cd client
npm install
cp .env.example .env    # optional — defaults to http://localhost:5000/api
npm run dev              # starts the app on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

## Environment Variables

### `server/.env`

```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://127.0.0.1:27017/astrowatch

JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRES_IN=7d

OPENWEATHER_API_KEY=your_api_key_here
WEATHER_CITY=Chennai

CLIENT_URL=http://localhost:5173
```

### `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

**Never commit a real `.env` file** — only `.env.example` is tracked. `server/.env` and `client/.env` are already in `.gitignore`.

## MongoDB Setup

- **Local MongoDB**: install MongoDB Community Edition, make sure the `mongod` service is running, and leave `MONGO_URI` pointing at `mongodb://127.0.0.1:27017/astrowatch` (the `astrowatch` database is created automatically on first write).
- **MongoDB Atlas**: create a free cluster, add your IP to the network access list, create a database user, then copy the connection string into `MONGO_URI` — e.g. `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/astrowatch`.

## Weather API Setup

1. Create a free account at [openweathermap.org](https://openweathermap.org/api).
2. Generate an API key (new keys can take a few minutes to activate).
3. Paste it into `OPENWEATHER_API_KEY` in `server/.env`, and set `WEATHER_CITY` to your observatory's city.
4. Restart the backend (`npm run dev`).

If the key is missing, invalid, or the request fails for any reason, AstroWatch **does not crash** — the `/api/weather` endpoint returns clearly-labelled demo weather data instead, so the dashboard and Weather page always render.

## Seed Data

Running `npm run seed` (from `/server`) wipes and repopulates the database with:

- **8 users**: 1 Admin, 4 Technicians, 3 Observers
- **8 equipment items** across all 6 types, with a realistic mix of statuses (6 Operational, 1 Warning, 1 Maintenance)
- **5 maintenance tasks** (mix of Scheduled, In Progress, Completed)
- **6 observations** targeting Jupiter, Saturn, Mars, Moon, Andromeda Galaxy, and the Orion Nebula, spread across past and upcoming dates with no scheduling conflicts

To wipe the database without reseeding: `npm run seed:destroy`.

## Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@astrowatch.com` | `admin123` |
| Technician | `technician@astrowatch.com` | `tech123` |
| Observer | `observer@astrowatch.com` | `observer123` |

(All three are one-click fillable from the "Demo credentials" box on the Login page.)

## URLs

- Frontend: **http://localhost:5173**
- Backend API: **http://localhost:5000/api**
- Health check: **http://localhost:5000/api/health**

## Project Demo Flow (for review)

1. **Login as Admin** and show that Admin can manage equipment, maintenance, and observation scheduling.
2. **Dashboard** — point out live MongoDB-backed counts, weather, and operational summaries.
3. **Maintenance assignment** — create/edit a maintenance task and assign a registered Technician from the dropdown.
4. **Login as Technician** — only that Technician's assigned maintenance tasks are visible; update one from Scheduled/In Progress to Completed, then return to the dashboard to show the counts changed.
5. **Observation assignment** — return as Admin, schedule an observation and assign a registered Observer. The conflict-validation demo remains the key technical feature:
   - Schedule a new observation on `Telescope-01` for a time that overlaps an existing seeded observation → AstroWatch rejects it with a specific conflict message.
   - Try scheduling on `Tracking System-01` (status: Maintenance) → rejected immediately with an equipment-status message.
   - Schedule a valid, non-conflicting observation → **"Observation Scheduled Successfully."**
   - Optionally schedule on `CCD Camera-02` (status: Warning) → succeeds, but shows a warning banner.
6. **Login as Observer** — only that Observer's assigned observations are visible; update status/notes and show the Observer dashboard change.
7. **Login as Admin again** — show that the same Technician/Observer updates are reflected in the Admin dashboard because every role uses the same MongoDB data.
8. **Weather** — show current conditions and the Suitable/Moderate/Unfavorable indicator; mention the demo-data fallback if no API key is configured.

## Troubleshooting

| Problem | Fix |
|---|---|
| `MongoDB connection error` on backend start | Confirm MongoDB is running locally, or that your Atlas `MONGO_URI` (with correct user/password/IP allowlist) is correct in `server/.env`. |
| Frontend shows "Cannot reach the server" | Make sure the backend is running on port 5000, and `client/.env`'s `VITE_API_URL` matches. |
| CORS errors in the browser console | Confirm `CLIENT_URL` in `server/.env` matches the URL the frontend is actually running on (default `http://localhost:5173`). |
| Login works but every other page 401s | Your JWT may have expired or `JWT_SECRET` changed after the token was issued — log out and log back in. |
| Weather page shows "Demo data" | Expected if `OPENWEATHER_API_KEY` isn't set — the app still works fully; add a real key to `server/.env` and restart the backend for live data. |
| `npm run seed` fails to connect | Run it from inside `/server` (not the project root) after `.env` is configured. |
| Port already in use | Change `PORT` in `server/.env` (backend) or run `vite --port <n>` (frontend), and update the other side's URL accordingly. |

## Current Scope

Role-based authentication · Admin equipment management · Technician maintenance workflow · Observer observation workflow · MongoDB user assignments · Observation planning with cross-module conflict detection · Weather monitoring · Role-aware dashboards.

## Future Scope

Real IoT/telescope hardware integration · live telemetry · AI-assisted observation recommendations · predictive maintenance · a mobile app · email/SMS notifications · multi-observatory support · advanced role management.

---

Built as a college project — feedback and improvements welcome.
