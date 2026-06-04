# 🌍 GlobeTrotter — Full-Stack Travel Planning App

GlobeTrotter is a full-featured travel planning application that helps users design, manage, and share multi-day trips. It combines a modern React + Vite frontend with a Node.js + Express backend and MongoDB persistence. The app supports user authentication, trip creation and editing, itineraries with activities, image uploads, calendar views, and admin analytics.

Postman Documentation: https://documenter.getpostman.com/view/39189509/2sBXinGAMV

## Purpose

- **For Travelers:** Plan multi-day trips, add stops and activities, view schedules on a calendar, and keep costs tracked with a simple budget summary.
- **For the Community:** Browse public trips shared by other users for inspiration and reuse.
- **For Admins:** Seed demo data, view analytics and manage content.

## Key Features

- User registration, login, and profile management
- Create, edit, duplicate, and delete trips
- Add stops and day-by-day activities to itineraries
- Drag-and-drop itinerary ordering and calendar integration
- Budget summary for each trip with expense tracking
- Searchable city and activity catalog with images
- Community feed for public/shared trips
- Admin panel: seed demo data and view basic analytics
- Image uploads via Cloudinary

## Tech Stack

- Frontend: React 18 + Vite
- Styling: Vanilla CSS (project design system)
- State management: Zustand
- Routing: React Router v6
- DnD: @dnd-kit
- Charts: Recharts
- Calendar: FullCalendar
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT, bcrypt, HTTP-only cookies
- File uploads: Multer + Cloudinary

## Project Structure (high level)

```
GlobeTrotter/
├── client/          # React + Vite frontend
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/         # Page level routes/views
│       ├── store/         # Zustand stores
│       └── lib/           # API helpers
└── server/          # Node.js + Express backend
        └── src/
                ├── config/        # DB & Cloudinary config
                ├── controllers/   # Route controllers
                ├── middleware/    # Auth, error handling
                ├── models/        # Mongoose schemas (User, Trip, City, Activity)
                └── routes/        # API routes
```

## Getting Started — Local Development

Prerequisites
- Node.js v18+
- MongoDB (Atlas or local)
- Cloudinary account (optional, for image uploads)

1) Backend

```bash
cd server
copy .env.example .env
# Edit server/.env with your MONGO_URI, JWT_SECRET, and Cloudinary keys
npm install
npm run dev
```

2) Frontend

```bash
cd client
npm install
npm run dev
```

Default URLs
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## Environment Variables

Server (`server/.env`) — required variables
```
PORT=5000
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLIENT_URL=http://localhost:5173
```

Client (`client/.env`)
```
VITE_API_URL=http://localhost:5000/api
```

## Seed Sample Data

- Admin UI: After running both servers, register a user and set the user role to `admin` in the DB, then visit `/admin` and click **Seed Sample Data** to insert demo cities and activities.
- API: `POST /api/admin/seed` (requires an admin JWT)

## API Overview (high-level)

- Auth
    - `POST /api/auth/register` — register user
    - `POST /api/auth/login` — login and receive JWT cookie
    - `GET /api/auth/me` — return current user

- Trips
    - `POST /api/trips` — create trip (auth)
    - `GET /api/trips` — list user trips (auth)
    - `GET /api/trips/:id` — public trip view
    - `PUT /api/trips/:id` — update trip (auth)
    - `DELETE /api/trips/:id` — delete trip (auth)
    - `POST /api/trips/:id/stops` — add a stop (auth)

- Cities & Activities
    - `GET /api/cities` — list cities
    - `GET /api/activities` — list activities

- Admin
    - `POST /api/admin/seed` — seed demo data (admin only)
    - `GET /api/admin/analytics` — basic analytics (admin)

Refer to the Postman documentation for full request/response shapes.

## Database Models (summary)

- `User` — email, name, passwordHash, role, avatar
- `Trip` — title, owner, dates, stops, activities, budget
- `City` — name, country, image, description
- `Activity` — title, cityRef, cost, duration, image

## Testing

- No automated test suite included by default. Suggested steps:
    - Add unit tests for controllers and utilities with Jest
    - Add integration tests for API endpoints (Supertest + test DB)

## Deployment

- Frontend: Vercel or Netlify — point to `client/` build output and set `VITE_API_URL`.
- Backend: Render, Railway, Heroku, or DigitalOcean Apps — set environment variables and use `npm start`.
- Database: MongoDB Atlas — configure IP access and copy connection string to `MONGO_URI`.

## Contributing

- Fork the repo and create a feature branch
- Open a PR with a clear description and testing notes
- For breaking changes, include a migration or upgrade note

## License & Contact

- MIT license (default)
- Contact: project maintainer or open an issue in the repository for questions or feature requests

---

If you'd like, I can also:
- add badges (build, coverage)
- create contributing guidelines and a PR template
- generate a short developer-focused README in `client/` and `server/`

