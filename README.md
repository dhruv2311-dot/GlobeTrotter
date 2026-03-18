# 🌍 GlobeTrotter – Full-Stack Travel Planning App

A premium MERN stack travel planning application built with React, Node.js, Express, and MongoDB.

## 🏗 Project Structure

```
GlobeTrotter/
├── client/          # React + Vite frontend
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/         # Page-level components
│       ├── store/         # Zustand state management
│       └── lib/           # API utilities
└── server/          # Node.js + Express backend
    └── src/
        ├── config/        # DB & Cloudinary config
        ├── controllers/   # Route controllers
        ├── middleware/     # Auth, error handling
        ├── models/        # Mongoose schemas
        └── routes/        # API routes
```

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (optional, for image uploads)

### 1. Setup Backend

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and other secrets
npm install
npm run dev
```

### 2. Setup Frontend

```bash
cd client
npm install
npm run dev
```

The app runs at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

---

## 🔧 Environment Variables

### Server (`server/.env`)
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`)
```
VITE_API_URL=http://localhost:5000/api
```

---

## 🌱 Seed Sample Data

1. Create an admin account
2. Navigate to `/admin`
3. Click **"Seed Sample Data"** — this adds 12 cities and 12 activities

OR send a POST request:
```
POST /api/admin/seed   (requires admin JWT token)
```

---

## 🔐 Demo Accounts

Create your own account at `/register`, or seed an admin using:
- Any email / password via `/register` endpoint
- To make admin: update `role` field in MongoDB

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | — | Register new user |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/me | ✓ | Get current user |
| POST | /api/trips | ✓ | Create trip |
| GET | /api/trips | ✓ | Get my trips |
| GET | /api/trips/:id | — | Get trip (public view) |
| PUT | /api/trips/:id | ✓ | Update trip |
| DELETE | /api/trips/:id | ✓ | Delete trip |
| POST | /api/trips/:id/stops | ✓ | Add stop |
| POST | /api/trips/community | — | Public trips |
| GET | /api/cities | — | Browse cities |
| GET | /api/activities | — | Browse activities |
| GET | /api/admin/analytics | Admin | Dashboard stats |

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Framer Motion |
| Styling | Vanilla CSS (Design System) |
| State | Zustand |
| Routing | React Router v6 |
| Drag & Drop | @dnd-kit |
| Charts | Recharts |
| Calendar | FullCalendar |
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt + HTTP-only cookies |
| File Storage | Cloudinary + Multer |

---

## 🚀 Deployment

### Frontend → Vercel
1. Push `client/` to GitHub
2. Import repo in Vercel
3. Set `VITE_API_URL` env var

### Backend → Render/Railway
1. Push `server/` to GitHub
2. Set environment variables
3. Start command: `npm start`

### Database → MongoDB Atlas
1. Create cluster at mongodb.com/cloud/atlas
2. Add IP whitelist + connection string to `MONGO_URI`
