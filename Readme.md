# 🎬 Reelr — Real-time Social & Chat Platform

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?logo=socket.io&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwindcss&logoColor=white)

Reelr is a scalable **microservice-based social media platform** combining short-form video reels with **real-time chat**, powered by shared authentication, modular architecture, and optimized backend performance.

---

![Reelr Banner](/mnt/data/abcf0e81-95e3-4816-aed2-010220c8a2b9.png)
**🔗 Live Demo:** [https://reelr.vercel.app/](https://reelr.vercel.app/)

---

## 🚀 Features

- **Authentication System** – Full login, register, and logout functionality using JWT.  
- **Role-Based Access Control (RBAC)** – Define roles like admin, viewer, etc.  
- **Real-Time Chat** – 1:1 chat powered by Socket.IO microservice.  
- **Reels CRUD** – Upload, view, edit, and delete reels with title, description, and hashtags.  
- **Reel Feed** – Randomized immersive feed with like and view tracking.  
- **Profile Page** – View user profile, reels, and analytics.  
- **Cloud Storage** – Media uploads via Cloudinary integration.  
- **Friends System** – Add, remove, or search users and chat with them.  
- **Indexing Optimization** – Efficient MongoDB indexing for fast retrieval.  
- **Scalable Architecture** – Decoupled services for reels, auth, and chat.  

> ⚙️ *Upcoming Features:* Comments, rate limiting, notifications, and Redis-based caching.

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

/reelr
├── /backend
│ ├── /config
│ │ ├── cloudinary.js
│ │ ├── db.js
│ │ └── multer.js
│ ├── /controllers
│ │ ├── auth.controller.js
│ │ ├── reel.controller.js
│ │ └── user.controller.js
│ ├── /middlewares
│ │ ├── auth.middleware.js
│ │ └── role.middleware.js
│ ├── /models
│ │ ├── reels.model.js
│ │ └── user.model.js
│ ├── /routes
│ │ ├── auth.routes.js
│ │ ├── reel.routes.js
│ │ └── user.routes.js
│ ├── /utils
│ ├── /tests
│ ├── app.js
│ └── server.js
│
├── /frontend
│ ├── /api
│ ├── /assets
│ ├── /components
│ ├── /context
│ ├── /pages
│ ├── /routes
│ ├── /sockets
│ ├── App.jsx
│ ├── main.jsx
│ └── vite.config.js
│
└── README.md

yaml
Copy code

---

## ⚙️ Environment Variables

| Variable   | Description |
|-----------|-------------|
| `PORT` | Server port (default: 8000) |
| `MONGODB_URL` | MongoDB connection URI |
| `ACCESS_TOKEN_SECRET` | Access token key |
| `REFRESH_TOKEN_SECRET` | Refresh token key |
| `REFRESH_TOKEN_EXPIRY` | Expiry duration (e.g., 10d) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_SECRET` | Cloudinary API secret |
| `JWT_SECRET` | JWT signing secret |

---

## 🧩 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)
- Cloudinary account
- Vite for frontend dev

### Installation
```bash
git clone https://github.com/dev-abhisheksh/reelr.git
cd backend && npm install
cd ../frontend && npm install

# Setup environment
cp backend/.env.example backend/.env
Update .env with MongoDB, JWT, and Cloudinary keys.

Development
bash
Copy code
cd backend && npm run dev
cd ../frontend && npm run dev
Visit:
👉 Reelr: https://reelr.vercel.app/

🧠 Architecture Overview
Frontend
Built with React + Vite + TailwindCSS

Responsive interface for reels, profiles, and chats

Connects to backend API and Socket.IO chat microservice

Shared authentication state via Context API

Backend
Built with Node.js + Express + MongoDB

Handles authentication, reels, user data, and chat microservice

Optimized with middleware, JWT, and indexing

Scalable design with shared auth across services

📡 API Overview
Auth Routes
Endpoint	Method	Description
/api/auth/register	POST	Register new user
/api/auth/login	POST	Login existing user
/api/auth/logout	POST	Logout current user

Reels Routes
Endpoint	Method	Description
/api/reels	GET	Get all reels (feed)
/api/reels/:id	GET	Get reel by ID
/api/reels	POST	Upload new reel
/api/reels/:id	DELETE	Delete reel
/api/reels/like/:id	POST	Like/unlike a reel

User Routes
Endpoint	Method	Description
/api/users	GET	Get all users
/api/users/:id	GET	Get specific user
/api/users/friends	POST	Add/remove friends

🧪 Testing
Use Jest / Supertest for backend testing.

bash
Copy code
npm run test
⚙️ Deployment
Component	Platform	Notes
Frontend	Vercel	Vite build
Backend	Render	Node service
Database	MongoDB Atlas	Cloud-hosted
Media Storage	Cloudinary	For reel uploads
Socket Service	Render (microservice)	Handles chat events

🧭 Versioning & Changelog
Follows Semantic Versioning (MAJOR.MINOR.PATCH)
Example:
1.2.0 → Added chat microservice integration

Maintain updates in CHANGELOG.md.

🤝 Contributing
Fork the repo

Create a branch

bash
Copy code
git checkout -b feat/new-feature
Commit changes

bash
Copy code
git commit -m "feat: added new feature"
Push and open a PR

💙 Code of Conduct
Be respectful and professional

No hate speech or spam

Credit contributors

Stay collaborative

📸 Screenshots

📜 License
This project is licensed under the MIT License — see the LICENSE file for details.