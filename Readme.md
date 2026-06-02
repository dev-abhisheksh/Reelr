# 🎬 Reelr — Full-fledge Real-time Social Media Platform

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?logo=socket.io&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwindcss&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)
![BullMQ](https://img.shields.io/badge/BullMQ-Implemented-orange)


Reelr is a comprehensive real-time social media platform built with a focus on scalability and modern engineering practices. It features a robust backend powered by Node.js and MongoDB, utilizing BullMQ for background tasks and Redis for caching, rate limiting, and real-time event distribution. The application supports a wide range of social interactions including reels, image posts, stories, real-time notifications, and a sophisticated follow system.

---

<!-- ![Reelr Banner](./assets/banner.png) -->
**🔗 Live Demo:** https://reelr.vercel.app/

---

## 🚀 Features

- **Authentication System** – Secure JWT-based auth with refresh token rotation and cookie-based storage.
- **Social Posts & Reels** – Comprehensive support for both short-form videos (Reels) and image-based social posts.
- **Real-Time Notifications** – Instant alerts for likes, comments, follows, and uploads, utilizing Redis Pub/Sub and Socket.IO.
- **Advanced Follow System** – Sophisticated follow/unfollow logic with support for private profiles and follow request management.
- **Interactions & Comments** – Threaded comment system with pinning capabilities and post/reel likes.
- **Status (Stories)** – Temporary 24-hour status updates for users.
- **Real-Time Chat** – 1:1 messaging microservice integrated with the main platform.
- **Background Processing** – Scalable handling of heavy tasks like media uploads and notification broadcasting using BullMQ workers.
- **Intelligent Feed** – Mixed feed algorithm for discovery of both reels and posts.
- **Cloud Storage** – Media management handled via Cloudinary with optimized upload pipelines.
- **Caching Layer** – Redis-based caching for high-performance feed and profile data retrieval.
- **Rate Limiting** – Redis-backed protection against API abuse and brute-force attacks.
- **Optimized Performance** – Strategic MongoDB indexing and modular service-oriented architecture.

---

## 🧠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Frontend:** React + Vite + TailwindCSS 4.0
- **Database:** MongoDB (Mongoose)
- **Real-Time:** Socket.IO + Redis Pub/Sub
- **Background Tasks:** BullMQ + Ioredis
- **State Management:** TanStack Query (React Query)
- **UI Components:** Lucide React, Hugeicons, Sonner (Toasts)
- **Auth:** JWT + Role-Based Access Control (RBAC)
- **File Uploads:** Multer + Cloudinary

---

## 📁 Repository Structure

```
/reelr
├── /backend
│   ├── /config         # Cloudinary, DB, and Multer configs
│   ├── /controllers    # Business logic for all modules
│   ├── /middlewares    # Auth, Role, Rate-limiting, and Uploads
│   ├── /models         # Mongoose schemas for Reels, Posts, Notifications, etc.
│   ├── /queues         # BullMQ queue definitions
│   ├── /routes         # API endpoint definitions
│   ├── /utils          # Redis client and helper functions
│   ├── /workers        # BullMQ background workers
│   ├── app.js          # Express app setup
│   ├── server.js       # HTTP server and Socket.IO initialization
│   ├── socket.js       # Real-time event logic
│   └── package.json
│
├── /frontend
│   ├── /src
│   │   ├── /api        # API service layers
│   │   ├── /components # Reusable UI components
│   │   ├── /context    # React Contexts (Auth, Notification, Socket)
│   │   ├── /pages      # Application views/pages
│   │   ├── /sockets    # Socket event handlers
│   │   └── main.jsx
│   ├── vite.config.js
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
| `REDIS_URL`               | Redis connection string            |
| `ACCESS_TOKEN_SECRET`     | Access token key                   |
| `REFRESH_TOKEN_SECRET`    | Refresh token key                  |
| `REFRESH_TOKEN_EXPIRY`    | Expiry duration (e.g., 10d)        |
| `CLOUDINARY_CLOUD_NAME`   | Cloudinary cloud name              |
| `CLOUDINARY_API_KEY`      | Cloudinary API key                 |
| `CLOUDINARY_SECRET`       | Cloudinary API secret              |

---

## 🧩 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB & Redis
- Cloudinary account

### Installation

```bash
# Clone the repository
git clone https://github.com/dev-abhisheksh/reelr.git
cd reelr

# Install dependencies
cd backend && npm install
cd ../frontend && npm install
```

### Development

```bash
# Run backend (from backend directory)
npm run dev

# Run workers (in separate terminals)
npm run worker      # Reel upload worker
npm run notiWorker  # Notification worker

# Run frontend (from frontend directory)
npm run dev
```

---

## 📡 API Overview

### Auth & User

| Endpoint              | Method | Description            |
|-----------------------|--------|------------------------|
| `/auth/register`      | POST   | Register new user      |
| `/auth/login`         | POST   | Login existing user    |
| `/user/profile`       | GET    | Get current user data  |

### Social Content

| Endpoint              | Method | Description            |
|-----------------------|--------|------------------------|
| `/post/create`        | POST   | Upload new image post  |
| `/post/feed`          | GET    | Get mixed social feed  |
| `/reel/upload`        | POST   | Upload new reel        |
| `/reel/all`           | GET    | Get reels discovery    |
| `/comment/create/:id` | POST   | Add comment to content |

### Notifications & Follows

| Endpoint               | Method | Description             |
|------------------------|--------|-------------------------|
| `/notification`        | GET    | Fetch user notifications|
| `/follow/:userId`      | POST   | Follow/Request follow   |
| `/follow/requests`     | GET    | Manage follow requests  |
| `/follow/stats`        | GET    | Get followers/following |

---

## 🧠 Architecture Overview

### Real-Time & Scaling
- **Redis Pub/Sub:** Used as a message broker to synchronize notification delivery across multiple server instances (if scaled horizontally).
- **BullMQ:** Decouples heavy processing (like Cloudinary uploads and bulk notification triggers) from the request-response cycle, ensuring a snappy UI.
- **Socket.IO:** Maintains persistent connections for instant UI updates.

### Frontend Architecture
- **React Query:** Handles server state, caching, and background synchronization.
- **Context API:** Manages global application state for authentication and real-time connectivity.

---

## ⚙️ Deployment

| Component       | Platform         |
|-----------------|------------------|
| Frontend        | Vercel           |
| Backend         | Render/Railway   |
| Database        | MongoDB Atlas    |
| Redis           | Upstash / Redis  |
| Media Storage   | Cloudinary       |

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch (`feat/new-feature`)
3. Commit changes
4. Push and open a PR

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Abhishek Sharma**  
[GitHub](https://github.com/dev-abhisheksh) • [Live Demo](https://reelr.vercel.app/)

---

⭐ **Star this repo** if you find it helpful!
