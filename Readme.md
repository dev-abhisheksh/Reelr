# 🎬 Reelr — Real-time Social & Chat Platform

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?logo=socket.io&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwindcss&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)
![Rate Limiting](https://img.shields.io/badge/Rate%20Limiting-Implemented-success)


Reelr is a backend-focused social media system built with Node.js and MongoDB, featuring JWT-based authentication with refresh token rotation, short-form video APIs, and a dedicated real-time chat microservice using Socket.IO. The system follows a modular service-oriented architecture and uses Redis for caching and rate limiting.

---

<!-- ![Reelr Banner](./assets/banner.png) -->
**🔗 Live Demo:** https://reelr.vercel.app/

---

## 🚀 Features

- **Authentication System** – Secure login, register, and logout using JWT  
- **Role-Based Access Control (RBAC)** – Support for roles like admin and viewer  
- **Real-Time Chat** – 1:1 chat powered by a Socket.IO microservice  
- **Reels CRUD** – Upload, view, edit, and delete reels with title, description, and hashtags  
- **Reel Feed** – Immersive feed with like and view tracking  
- **Profile Page** – User profile with uploaded reels and basic analytics  
- **Cloud Storage** – Media uploads handled via Cloudinary  
- **Friends System** – Search users, add/remove friends, and chat  
- **Caching Layer** – Redis-based caching for faster feed and profile responses  
- **Rate Limiting** – Redis-backed rate limiting to prevent abuse  
- **Indexing Optimization** – Optimized MongoDB indexes for efficient queries  
- **Scalable Architecture** – Decoupled services for authentication, reels, and chat  

> ⚙️ *Upcoming Feature:* Comments system on reels

---


## 🧠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Frontend:** React + Vite + TailwindCSS
- **Database:** MongoDB with Mongoose
- **Real-Time:** Socket.IO
- **Auth:** JWT + Role Middleware
- **File Uploads:** Multer + Cloudinary
- **Environment:** dotenv
- **Middleware:** cookie-parser, cors

---

## 📁 Repository Structure

```
/reelr
├── /backend
│   ├── /config
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   └── multer.js
│   ├── /controllers
│   │   ├── auth.controller.js
│   │   ├── reel.controller.js
│   │   └── user.controller.js
│   ├── /middlewares
│   │   ├── auth.middleware.js
│   │   └── role.middleware.js
│   ├── /models
│   │   ├── reel.model.js
│   │   └── user.model.js
│   ├── /routes
│   │   ├── auth.routes.js
│   │   ├── reel.routes.js
│   │   └── user.routes.js
│   ├── /utils
│   ├── /tests
│   ├── app.js
│   ├── server.js
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── /frontend
│   ├── /public
│   ├── /src
│   │   ├── /api
│   │   ├── /assets
│   │   ├── /components
│   │   ├── /context
│   │   ├── /pages
│   │   ├── /routes
│   │   ├── /sockets
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── .gitignore
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## ⚙️ Environment Variables

| Variable                  | Description                        |
|---------------------------|------------------------------------|
| `PORT`                    | Server port (default: 8000)        |
| `MONGODB_URL`             | MongoDB connection URI             |
| `ACCESS_TOKEN_SECRET`     | Access token key                   |
| `REFRESH_TOKEN_SECRET`    | Refresh token key                  |
| `REFRESH_TOKEN_EXPIRY`    | Expiry duration (e.g., 10d)        |
| `CLOUDINARY_CLOUD_NAME`   | Cloudinary cloud name              |
| `CLOUDINARY_API_KEY`      | Cloudinary API key                 |
| `CLOUDINARY_SECRET`       | Cloudinary API secret              |
| `JWT_SECRET`              | JWT signing secret                 |

---

## 🧩 Quick Start

### Prerequisites

- Node.js 16+
- MongoDB (local or Atlas)
- Cloudinary account
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/dev-abhisheksh/reelr.git
cd reelr

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Setup Environment

```bash
# Copy example env file
cp backend/.env.example backend/.env
```

Update `.env` with your MongoDB, JWT, and Cloudinary keys.

### Development

```bash
# Run backend (from backend directory)
cd backend
npm run dev

# Run frontend (from frontend directory, in a new terminal)
cd frontend
npm run dev
```

**Visit:**
- 🎬 Frontend: http://localhost:5173
- 🔌 Backend: http://localhost:8000
- 🌐 Live Demo: https://reelr.vercel.app/

---

## 🧠 Architecture Overview

### Frontend

- Built with React + Vite + TailwindCSS
- Responsive interface for reels, profiles, and chats
- Connects to backend API and Socket.IO chat microservice
- Shared authentication state via Context API

### Backend

- Built with Node.js + Express + MongoDB
- Handles authentication, reels, user data, and chat microservice
- Optimized with middleware, JWT, and indexing
- Scalable design with shared auth across services

---

## 📡 API Overview

### Auth Routes

| Endpoint              | Method | Description            |
|-----------------------|--------|------------------------|
| `/api/auth/register`  | POST   | Register new user      |
| `/api/auth/login`     | POST   | Login existing user    |
| `/api/auth/logout`    | POST   | Logout current user    |

### Reels Routes

| Endpoint              | Method | Description            |
|-----------------------|--------|------------------------|
| `/api/reels`          | GET    | Get all reels (feed)   |
| `/api/reels/:id`      | GET    | Get reel by ID         |
| `/api/reels`          | POST   | Upload new reel        |
| `/api/reels/:id`      | DELETE | Delete reel            |
| `/api/reels/like/:id` | POST   | Like/unlike a reel     |

### User Routes

| Endpoint              | Method | Description            |
|-----------------------|--------|------------------------|
| `/api/users`          | GET    | Get all users          |
| `/api/users/:id`      | GET    | Get specific user      |
| `/api/users/friends`  | POST   | Add/remove friends     |

---

## 🧪 Testing

Use Jest / Supertest for backend testing.

```bash
npm run test
```

---

## ⚙️ Deployment

| Component       | Platform         | Notes                  |
|-----------------|------------------|------------------------|
| Frontend        | Vercel           | Vite build             |
| Backend         | Render           | Node service           |
| Database        | MongoDB Atlas    | Cloud-hosted           |
| Media Storage   | Cloudinary       | For reel uploads       |
| Socket Service  | Render           | Handles chat events    |

---

## 🧭 Versioning & Changelog

- Follows [Semantic Versioning](https://semver.org/) (MAJOR.MINOR.PATCH)
- Example: `1.2.0` → Added chat microservice integration
- Maintain updates in `CHANGELOG.md`

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch
   ```bash
   git checkout -b feat/new-feature
   ```
3. Commit changes
   ```bash
   git commit -m "feat: added new feature"
   ```
4. Push and open a PR
   ```bash
   git push origin feat/new-feature
   ```

---

## 💙 Code of Conduct

- Be respectful and professional
- No hate speech or spam
- Credit contributors
- Stay collaborative

---

## 📸 Screenshots

_Coming soon..._

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Abhishek Sharma**  
[GitHub](https://github.com/dev-abhisheksh) • [Live Demo](https://reelr.vercel.app/)

---

⭐ **Star this repo** if you find it helpful!