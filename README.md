# 🎬 CinemaVerse — Full Stack Movie Discovery Platform

A production-ready movie discovery platform built with React, Redux Toolkit, Node.js, Express, and MongoDB.

---

## 🚀 Features

### Frontend
- 🎥 **Hero Carousel** — Auto-rotating trending content with full backdrop
- 🔥 **Trending / Popular / Top Rated** sections with horizontal scrolling
- 🔍 **Real-Time Search** with debouncing (400ms) across movies, TV shows, and people
- 🎬 **Trailer Modal** — YouTube trailer via TMDB API, graceful fallback if unavailable
- 📱 **Fully Responsive** — Desktop, tablet, and mobile
- 🌙 **Dark/Light Mode** toggle
- ♾️ **Infinite Scroll** on Movies and TV Shows pages (IntersectionObserver)
- 🎭 **Genre Filtering** — Filter by genre on Movies and TV pages
- 💀 **Skeleton Loaders** — Shimmer UI while data loads
- ❤️ **Favorites**, 🔖 **Watchlist**, 🕐 **Watch History** with instant UI updates
- ⚙️ **Admin Dashboard** — Stats, User Management, Movie CRUD

### Backend
- 🔐 **JWT Authentication** — Register, Login, Protected routes
- 📦 **MongoDB** — Users, movies, favorites, watchlist, history stored in DB
- 🛡️ **Admin Middleware** — Role-based access control
- 🎬 **Custom Movie CRUD** — Admin can add/edit/delete custom movies
- 👥 **User Management** — Ban/unban/delete users
- 🏥 **Error Handling** — Global error handler, validation with express-validator

---

## 📁 Project Structure

```
cinemaverse/
├── backend/
│   ├── models/
│   │   ├── User.js           # User schema with favorites, history, watchlist
│   │   └── Movie.js          # Custom movie schema
│   ├── routes/
│   │   ├── auth.js           # Register, Login, /me
│   │   ├── user.js           # Favorites, History, Watchlist CRUD
│   │   ├── movies.js         # Public custom movies endpoint
│   │   └── admin.js          # Admin: users, movies, stats
│   ├── middleware/
│   │   └── auth.js           # JWT protect + adminOnly
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── services/
    │   │   ├── tmdb.js        # All TMDB API calls
    │   │   └── api.js         # Backend API calls
    │   ├── store/
    │   │   ├── index.js       # Redux store
    │   │   └── slices/
    │   │       ├── authSlice.js
    │   │       └── userSlice.js
    │   ├── hooks/
    │   │   ├── useDebounce.js
    │   │   └── useInfiniteScroll.js
    │   ├── components/
    │   │   ├── layout/Navbar.js
    │   │   ├── movie/
    │   │   │   ├── MovieCard.js
    │   │   │   └── TrailerModal.js
    │   │   └── common/
    │   │       ├── Skeleton.js
    │   │       └── Toast.js
    │   ├── pages/
    │   │   ├── HomePage.js
    │   │   ├── MoviesPage.js
    │   │   ├── TVShowsPage.js
    │   │   ├── PeoplePage.js
    │   │   ├── SearchPage.js
    │   │   ├── MovieDetailPage.js
    │   │   ├── TVDetailPage.js
    │   │   ├── PersonDetailPage.js
    │   │   ├── LoginPage.js
    │   │   ├── RegisterPage.js
    │   │   ├── UserListPages.js   # Favorites, History, Watchlist
    │   │   ├── AdminDashboard.js
    │   │   └── NotFoundPage.js
    │   ├── App.js
    │   ├── App.css            # Full cinematic dark theme
    │   └── index.js
    ├── package.json
    └── .env.example
```

---

## ⚙️ Setup Instructions

### 1. Get a TMDB API Key
1. Go to [https://www.themoviedb.org/](https://www.themoviedb.org/)
2. Create a free account → Settings → API → Request an API key
3. Copy your API key (v3 auth)

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env and fill in:
# - MONGODB_URI (local or MongoDB Atlas)
# - JWT_SECRET (any long random string)
# - TMDB_API_KEY (from step 1)

npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create .env file
cp .env.example .env
# Edit .env and fill in:
# - REACT_APP_TMDB_API_KEY (from step 1)

npm start
# App runs on http://localhost:3000
```

### 4. Create Admin User
After registering normally, open MongoDB Compass or mongosh and update your user's role:
```js
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user (protected) |

### User (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/user/favorites` | Get/Add favorites |
| DELETE | `/api/user/favorites/:movieId` | Remove favorite |
| GET/POST | `/api/user/history` | Get/Add watch history |
| DELETE | `/api/user/history/:movieId` | Remove history item |
| GET/POST | `/api/user/watchlist` | Get/Add watchlist |
| DELETE | `/api/user/watchlist/:movieId` | Remove watchlist item |

### Admin (Protected + Admin Role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard stats |
| GET | `/api/admin/users` | List all users |
| PATCH | `/api/admin/users/:id/ban` | Ban/unban user |
| DELETE | `/api/admin/users/:id` | Delete user |
| GET/POST | `/api/admin/movies` | List/Create movies |
| PUT/DELETE | `/api/admin/movies/:id` | Edit/Delete movie |

---

## 🔑 Environment Variables

### Backend `.env`
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cinemaverse
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
TMDB_API_KEY=your_tmdb_api_key
NODE_ENV=development
```

### Frontend `.env`
```
REACT_APP_TMDB_API_KEY=your_tmdb_api_key
REACT_APP_TMDB_BASE_URL=https://api.themoviedb.org/3
REACT_APP_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🎨 Design System

- **Font**: Bebas Neue (display) + DM Sans (body)
- **Colors**: Deep dark `#080b14` bg, crimson `#e63946` accent, gold `#f4c542` ratings
- **Animations**: CSS keyframes, hover transforms, skeleton shimmer
- **Theme**: Dark/Light mode toggle

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Redux Toolkit, React Router 6 |
| Styling | Pure CSS (custom design system) |
| API Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Movie Data | TMDB API v3 |
| Dev Tools | nodemon, morgan |
