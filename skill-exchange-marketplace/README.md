# SkillXchange — Skill Exchange & Learning Marketplace

A full-stack web application for peer-to-peer skill sharing and learning. Users can list skills they want to teach, browse skills offered by others, book learning sessions, and leave reviews/ratings.

> **BSc Final Year Project** — Built with senior full-stack developer best practices.

---

## ✨ Features

- 🔐 **User Authentication** — JWT-based registration, login, and protected routes
- 📚 **Skill Listings** — Create, edit, delete, and browse skills by category
- 🔍 **Search & Filter** — Real-time search with category filtering
- 📅 **Booking System** — Request sessions; instructors can accept/reject/complete
- ⭐ **Reviews & Ratings** — Leave ratings after completed sessions
- 👤 **User Profiles** — Manage personal info and skills to teach
- 📊 **Dashboard** — Overview of skills, bookings, and stats

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, React Router v6, Context API, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Validation | express-validator |
| Security | helmet, cors, rate-limiting |

---

## 📁 Project Structure

```
skill-exchange-marketplace/
├── client/          # React Frontend (Vite)
│   ├── src/
│   │   ├── api/         # Axios instance & API service functions
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Auth Context
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Page-level components
│   │   └── utils/       # Helper functions
│   └── ...
└── server/          # Node.js + Express Backend
    ├── config/      # MongoDB connection
    ├── controllers/ # Request handlers
    ├── middleware/  # Auth, error, validation
    ├── models/      # Mongoose schemas
    ├── routes/      # API route definitions
    ├── validators/  # express-validator rules
    └── utils/       # Helper utilities
```

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- npm or yarn

---

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/mohdnas0001/skill-exchange-marketplace.git
cd skill-exchange-marketplace
```

### 2. Set up the Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your values
```

### 3. Set up the Frontend
```bash
cd ../client
npm install
cp .env.example .env
# Edit .env if needed
```

---

## 🔧 Environment Variables

### server/.env
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/skill-exchange
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

### client/.env
```env
VITE_API_URL=http://localhost:5000/api
```

---

## ▶️ Running in Development

### Start the Backend
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

### Start the Frontend
```bash
cd client
npm run dev
# App runs on http://localhost:5173
```

### (Optional) Seed the Database
```bash
cd server
npm run seed
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |

### Users
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/users/:id` | Get user profile | ❌ |
| PUT | `/api/users/profile` | Update own profile | ✅ |

### Skills
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/skills` | Get all skills (search, filter) | ❌ |
| GET | `/api/skills/:id` | Get skill details | ❌ |
| GET | `/api/skills/my-skills` | Get current user's skills | ✅ |
| POST | `/api/skills` | Create skill | ✅ |
| PUT | `/api/skills/:id` | Update skill | ✅ |
| DELETE | `/api/skills/:id` | Delete skill | ✅ |

### Bookings
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/bookings` | Create booking request | ✅ |
| GET | `/api/bookings/my-bookings` | Get user's bookings | ✅ |
| PUT | `/api/bookings/:id/status` | Update booking status | ✅ |

### Reviews
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/reviews` | Create review | ✅ |
| GET | `/api/reviews/skill/:skillId` | Get reviews for a skill | ❌ |
| GET | `/api/reviews/instructor/:instructorId` | Get instructor reviews | ❌ |

---

## 📸 Screenshots

> Screenshots coming soon

---

## 👨‍💻 Author

**Mohammed Nasir**  
BSc Computer Science Final Year Project

---

## 📄 License

This project is licensed for educational purposes.
