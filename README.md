# AstroWatch

**Space Observatory Monitoring and Management System**

A centralized MERN-stack web application that helps observatory staff manage day-to-day operations: equipment status, maintenance scheduling, observation planning, weather monitoring, and a live operations dashboard — all backed by a real MongoDB database with cross-module conflict validation.

> Academic project. AstroWatch manages and simulates observatory operations in software; it does not control real telescope hardware. Real IoT/hardware integration is listed under Future Scope.

---

## Description

Observatories juggle several moving parts at once: is the telescope working, is it booked for maintenance, is the sky even clear enough to observe tonight, and does a new observation clash with something already scheduled? AstroWatch brings all four of those questions into one dashboard.

The standout feature is **cross-module validation**: before any observation is saved, the backend checks the Equipment, Maintenance, and Observation collections together — not just the one you're editing — and returns a clear, human-readable reason if the request can't be scheduled.

## Features

- **Authentication** — JWT-based register/login, bcrypt password hashing, protected routes (frontend + backend), persistent login via `localStorage`, simple Admin/Staff roles.
- **Dashboard** — live stats (equipment counts, maintenance counts, observation counts), current weather + observation suitability, equipment status breakdown, upcoming observations/maintenance, recent activity — all computed from real database data.
- **Equipment Management** — full CRUD, search, filter by status/type, color-coded status & condition badges.
- **Maintenance Management** — full CRUD, tasks reference Equipment via `ObjectId` + `populate`, filter by status/priority, equipment status auto-syncs with task lifecycle (In Progress → Maintenance, Completed → Operational).
- **Observation Planning** — full CRUD, the core scheduling workflow:
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
│   │   ├── services/             # api.js + one service file per resource
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Express backend
│   ├── config/db.js             # MongoDB connection
│   ├── controllers/             # auth, equipment, maintenance, observation, weather, dashboard
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

- **2 users**: 1 Admin, 1 Staff
- **8 equipment items** across all 6 types, with a realistic mix of statuses (6 Operational, 1 Warning, 1 Maintenance)
- **5 maintenance tasks** (mix of Scheduled, In Progress, Completed)
- **6 observations** targeting Jupiter, Saturn, Mars, Moon, Andromeda Galaxy, and the Orion Nebula, spread across past and upcoming dates with no scheduling conflicts

To wipe the database without reseeding: `npm run seed:destroy`.

## Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@astrowatch.com` | `admin123` |
| Staff | `staff@astrowatch.com` | `staff123` |

(Both are also one-click fillable from the "Demo credentials" box on the Login page.)

## URLs

- Frontend: **http://localhost:5173**
- Backend API: **http://localhost:5000/api**
- Health check: **http://localhost:5000/api/health**

## Project Demo Flow (for review)

1. **Login** with the demo Admin account.
2. **Dashboard** — point out the live stat cards, weather widget with suitability rating, and equipment status breakdown (all computed from MongoDB, not hardcoded).
3. **Equipment** — show the seeded list, filter by status (e.g. "Maintenance" to show `Tracking System-01`), open **Add Equipment** to show validation.
4. **Maintenance** — show `Tracking System-01`'s "In Progress" task; point out it's linked via `ObjectId` + `populate`, not a duplicated equipment name.
5. **Observations — the key demo**:
   - Schedule a new observation on `Telescope-01` for a time that overlaps an existing seeded observation → AstroWatch rejects it with a specific conflict message.
   - Try scheduling on `Tracking System-01` (status: Maintenance) → rejected immediately with an equipment-status message.
   - Schedule a valid, non-conflicting observation → **"Observation Scheduled Successfully."**
   - Optionally schedule on `CCD Camera-02` (status: Warning) → succeeds, but shows a warning banner.
6. **Weather** — show current conditions and the Suitable/Moderate/Unfavorable indicator; mention the demo-data fallback if no API key is configured.

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

User authentication · Equipment management · Maintenance management · Observation planning with full cross-module conflict detection · Weather monitoring with suitability rating · Centralized dashboard.

## Future Scope

Real IoT/telescope hardware integration · live telemetry · AI-assisted observation recommendations · predictive maintenance · a mobile app · email/SMS notifications · multi-observatory support · advanced role management.

---

Built as a college project — feedback and improvements welcome.
