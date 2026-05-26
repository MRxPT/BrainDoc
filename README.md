# Full-Stack App — React + FastAPI + MongoDB

A production-ready starter with JWT authentication, Material UI, and an async Python backend.

---

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app entry point
│   │   ├── config.py        # Settings (reads .env)
│   │   ├── database.py      # MongoDB connection (Motor)
│   │   ├── auth.py          # JWT helpers, password hashing
│   │   ├── models.py        # Pydantic request/response models
│   │   └── routers/
│   │       ├── auth.py      # POST /api/auth/signup, /api/auth/login
│   │       └── users.py     # GET/PUT/DELETE /api/users/me
│   ├── .env                 # Environment variables
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── axios.js     # Axios instance with JWT interceptor
    │   │   └── auth.js      # API call helpers
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── SignupPage.jsx
    │   │   └── DashboardPage.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── vite.config.js       # Proxy /api → http://127.0.0.1:8000
    └── package.json
```

---

## Prerequisites

- Python 3.10+
- Node.js 18+
- MongoDB running locally on port 27017

Start MongoDB (if not running as a service):
```bash
mongod --dbpath /data/db
```

---

## Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

API docs available at: http://127.0.0.1:8000/docs

---

## Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

App available at: http://localhost:5173

---

## How the Frontend Connects to the Backend

The Vite dev server proxies all `/api/*` requests to `http://127.0.0.1:8000`.
This means Axios calls like `api.post("/auth/login")` go to `http://127.0.0.1:8000/api/auth/login`.

**This is what prevents ECONNREFUSED errors** — the browser never makes a cross-origin
request directly to port 8000. The proxy handles it server-side.

```
Browser → localhost:5173/api/... → Vite Proxy → 127.0.0.1:8000/api/...
```

---

## API Endpoints

| Method | Endpoint              | Auth Required | Description          |
|--------|-----------------------|---------------|----------------------|
| POST   | /api/auth/signup      | No            | Register new user    |
| POST   | /api/auth/login       | No            | Login, returns JWT   |
| GET    | /api/users/me         | Yes           | Get current user     |
| PUT    | /api/users/me         | Yes           | Update username      |
| DELETE | /api/users/me         | Yes           | Delete account       |

---

## Environment Variables (backend/.env)

| Variable                    | Default                              | Description              |
|-----------------------------|--------------------------------------|--------------------------|
| MONGO_URI                   | mongodb://localhost:27017            | MongoDB connection string |
| DB_NAME                     | fullstack_app                        | Database name            |
| SECRET_KEY                  | your-super-secret-key-...            | JWT signing key          |
| ALGORITHM                   | HS256                                | JWT algorithm            |
| ACCESS_TOKEN_EXPIRE_MINUTES | 30                                   | Token lifetime           |

> Change `SECRET_KEY` to a long random string in production.

---

## Common Issues

**ECONNREFUSED**
- Make sure the backend is running on port 8000 before starting the frontend.
- The Vite proxy in `vite.config.js` targets `http://127.0.0.1:8000` — use `127.0.0.1`, not `localhost`, to avoid IPv6 resolution issues on some systems.

**MongoDB connection error**
- Ensure MongoDB is running: `mongod` or check your system service.

**Module not found (pydantic_settings)**
- Run `pip install -r requirements.txt` again — `pydantic-settings` is a separate package from `pydantic` v2.
