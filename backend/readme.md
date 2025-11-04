backend/
│
├── config/                 # Config files (DB, cloud storage, etc.)
│   ├── db.js               # MongoDB connection
│   ├── cloud.js            # AWS S3 or Cloudinary config
│   └── env.js              # Environment variables
│
├── controllers/            # Request handlers (business logic)
│   ├── authController.js
│   ├── userController.js
│   ├── reelController.js
│   ├── commentController.js
│   └── adminController.js
│
├── models/                 # Mongoose models
│   ├── User.js
│   ├── Reel.js
│   ├── Comment.js
│   └── Notification.js
│
├── routes/                 # API routes
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── reelRoutes.js
│   ├── commentRoutes.js
│   └── adminRoutes.js
│
├── middlewares/            # Middleware functions
│   ├── authMiddleware.js   # JWT verification
│   ├── roleMiddleware.js   # Role-based access
│   ├── errorMiddleware.js  # Global error handling
│   └── uploadMiddleware.js # Video/file upload handling
│
├── utils/                  # Utility functions
│   ├── sendEmail.js        # Email notifications
│   ├── generateToken.js    # JWT helper
│   └── logger.js           # Logging utility
│
├── tests/                  # Unit & integration tests
│
├── app.js                  # Express app initialization
├── server.js               # Server start
└── package.json


1. Reel Upload & Media

uploadReel → upload video + optional thumbnail

deleteReel → delete a reel (creator/admin only)

updateReel → edit title, description, tags, category, thumbnail

2. Reel Fetching

getAllReels → fetch all reels (optionally paginated)

getReelById → fetch single reel by ID

getReelsByUser → fetch all reels from a specific user

getTrendingReels → fetch reels sorted by likes/views

3. Social Interactions

likeReel → like/unlike a reel

incrementView → increment view count when a reel is watched

commentReel → add a comment

deleteComment → delete a comment (creator/admin only)

4. Search & Filter

searchReels → search by title, description

filterReelsByCategory → filter by category

filterReelsByTags → filter by tags

combinedSearch → search + filter + pagination

5. Analytics / Extras

getReelStats → return views, likes, and comment counts

getTopCreators → users with most reels / most liked reels