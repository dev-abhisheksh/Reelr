# Notification System Setup Guide

## ⚡ Quick Summary
You want to send notifications for **follow requests** and **reel uploads**. Here's the smart way:
- **Follow requests**: Create 1 queue + 1 worker (one-to-one notification)
- **Reel uploads**: Reuse the EXISTING post notification queue + worker (send to all followers)
- Result: **Only 2 workers total**, not 3!

---

## 🏗️ Foundation: How Your Notification System Works

Your system has 4 parts working together:

```
Controller → Queue (BullMQ) → Worker → Redis Pub/Sub → Socket.io → Frontend
```

### Part 1: Controller (sends notification job)
- When an action happens (post created, follow requested, reel uploaded), the controller **enqueues a job**
- The job contains relevant data (userId, postId, etc.)
- Example: `postNotificationQueue.add("new-post", { postId, userId })`

### Part 2: Queue (BullMQ)
- Stores the job in Redis queue
- Acts as a buffer between controller and worker
- File: `backend/queues/postNotification.queue.js`

### Part 3: Worker (processes the job)
- Listens to the queue for new jobs
- When a job arrives, it:
  1. Fetches necessary data (followers, etc.)
  2. Creates Notification documents in MongoDB
  3. Publishes to Redis channel "new-notification"
- File: `backend/workers/postNotification.worker.js`
- **IMPORTANT**: Worker must be imported in `server.js` to run!

### Part 4: Socket.io (sends to frontend)
- Redis subscriber listens to "new-notification" channel
- When message arrives, it checks if user is online
- If online, emits notification via socket to frontend
- File: `backend/socket.js`

---

## 📝 Step 1: Create Follow-Request Notifications

### Step 1.1: Create a Follow Notification Queue
**File**: `backend/queues/followNotification.queue.js`

```javascript
import { Queue } from "bullmq"
import { client } from "../utils/redis-client.js"

export const followNotificationQueue = new Queue("follow-notification", {
    connection: client
})
```

---

### Step 1.2: Create a Follow Notification Worker
**File**: `backend/workers/followNotification.worker.js`

```javascript
import { Worker } from "bullmq";
import { Notification } from "../models/notification.model.js";
import { client } from "../utils/redis-client.js";
import connectDB from "../config/db.js";
import Redis from "ioredis";

connectDB();

// Separate redis client for publishing to socket
const publisher = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    tls: { rejectUnauthorized: false }
});

// This worker listens to "follow-notification" queue
const worker = new Worker("follow-notification", async (job) => {
    try {
        const { followerId, followingId } = job.data;

        // Create notification
        const notification = {
            sender: followerId,           // User who sent the follow request
            receiver: followingId,         // User who receives the follow request
            postId: null,                 // No post for follow requests
            type: "follow-request"
        };

        await Notification.create(notification);

        // Publish to Redis so socket.io can send it to frontend
        await publisher.publish(
            "new-notification",
            JSON.stringify(notification)
        );

        console.log(`Follow notification: ${followerId} → ${followingId}`);
    } catch (error) {
        console.error(error);
        throw error;
    }
}, { connection: client });

worker.on("completed", (job) => console.log(`Follow job ${job.id} completed`));
worker.on("failed", (job, err) => console.error(`Follow job ${job?.id} failed`, err));
```

---

### Step 1.3: Update Follow Controller to Enqueue Notification
**File**: `backend/controllers/follow.controller.js`

In the `followUser` function, after creating the follow record, add:

```javascript
// After: await session.commitTransaction()
// Add this:

import { followNotificationQueue } from "../queues/followNotification.queue.js"; // Add to imports

// In followUser function, after session.commitTransaction():
await followNotificationQueue.add(
    "new-follow-request",
    {
        followerId: follower,
        followingId: following
    },
    {
        attempts: 3,
        backoff: { type: "exponential", delay: 3000 },
        removeOnComplete: 100,
        removeOnFail: 50
    }
);
```

---

## 🎥 Step 2: Create Reel-Upload Notifications

### Step 2.1: Create a Reel Notification Queue
**File**: `backend/queues/reelNotification.queue.js`

```javascript
import { Queue } from "bullmq"
import { client } from "../utils/redis-client.js"

export const reelNotificationQueue = new Queue("reel-notification", {
    connection: client
})
```

---

### Step 2.2: ALTERNATIVE - Reuse Post Worker for Reels!

**Since reel notifications follow the SAME pattern as post notifications (send to all followers), you can actually modify the EXISTING post worker to handle both!**

Instead of creating a new worker, update `backend/workers/postNotification.worker.js`:

```javascript
import { Worker } from "bullmq";
import { Follow } from "../models/follow.model.js";
import { Notification } from "../models/notification.model.js";
import { client } from "../utils/redis-client.js";
import connectDB from "../config/db.js";
import Redis from "ioredis";

connectDB();

const publisher = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    tls: { rejectUnauthorized: false }
});

// This worker now handles BOTH "post-notification" and "reel-notification" jobs
// They use the same logic: notify all followers
const worker = new Worker("post-notification", async (job) => {
    try {
        const { postId, userId, type = "post" } = job.data;

        const followers = await Follow.find({
            following: userId,
            status: "accepted"
        }).select("follower");

        if (followers.length === 0) return;

        const notifications = followers.map((followerDoc) => ({
            sender: userId,
            receiver: followerDoc.follower,
            postId,  // Works for both posts and reels
            type     // Will be "post" or "reel"
        }));

        await Notification.insertMany(notifications);

        for (const notification of notifications) {
            await publisher.publish(
                "new-notification",
                JSON.stringify(notification)
            );
        }

        console.log(`${type} notifications sent to ${followers.length} followers`);
    } catch (error) {
        console.error(error);
        throw error;
    }
}, { connection: client });

worker.on("completed", (job) => console.log(`Job ${job.id} completed`));
worker.on("failed", (job, err) => console.error(`Job ${job?.id} failed`, err));
```

Then in your `reelNotificationQueue.add()` call:

```javascript
await reelNotificationQueue.add(
    "new-reel",
    {
        postId: reel._id,  // Pass reelId as postId
        userId: req.user._id,
        type: "reel"       // Specify the type
    },
    { /* options */ }
);
```

**But wait - this won't work because you're using different queue names!** Keep reading for the best solution...

---

### Step 2.2 (RECOMMENDED): Use the SAME queue for Posts AND Reels!

The best approach is to reuse the **post-notification queue** for both posts and reels since they share the same logic!

**File**: `backend/queues/postNotification.queue.js` (already exists, just use it!)

**Update Worker**: `backend/workers/postNotification.worker.js`

```javascript
import { Worker } from "bullmq";
import { Follow } from "../models/follow.model.js";
import { Notification } from "../models/notification.model.js";
import { client } from "../utils/redis-client.js";
import connectDB from "../config/db.js";
import Redis from "ioredis";

connectDB();

const publisher = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    tls: { rejectUnauthorized: false }
});

// Single worker handles BOTH posts and reels (same "send to all followers" logic)
const worker = new Worker("post-notification", async (job) => {
    try {
        const { postId, userId, type = "post" } = job.data;  // type defaults to "post"

        const followers = await Follow.find({
            following: userId,
            status: "accepted"
        }).select("follower");

        if (followers.length === 0) return;

        const notifications = followers.map((followerDoc) => ({
            sender: userId,
            receiver: followerDoc.follower,
            postId,      // Works for both posts and reels (stores either postId or reelId)
            type         // "post" or "reel"
        }));

        await Notification.insertMany(notifications);

        for (const notification of notifications) {
            await publisher.publish(
                "new-notification",
                JSON.stringify(notification)
            );
        }

        console.log(`${type.toUpperCase()} notifications sent to ${followers.length} followers`);
    } catch (error) {
        console.error(error);
        throw error;
    }
}, { connection: client });

worker.on("completed", (job) => console.log(`Job ${job.id} completed`));
worker.on("failed", (job, err) => console.error(`Job ${job?.id} failed`, err));
```

Now you only have **ONE worker**, not three!

---

### Step 2.3: Update Reel Controller
**File**: `backend/controllers/reel.controller.js`

```javascript
import { postNotificationQueue } from "../queues/postNotification.queue.js"; // Reuse the post queue!

// In uploadReel function, after: await deleteRedisCache(...)
// Add this:

await postNotificationQueue.add(
    "new-post",  // Same queue name as posts
    {
        postId: reel._id,      // Could be post or reel, stored in same field
        userId: req.user._id,
        type: "reel"           // Specify it's a reel
    },
    {
        attempts: 3,
        backoff: { type: "exponential", delay: 3000 },
        removeOnComplete: 100,
        removeOnFail: 50
    }
);
```

---

### Step 2.4: Remove the Reel Queue File

**Delete**: `backend/queues/reelNotification.queue.js` (no longer needed!)

You don't need the separate queue anymore since you're reusing the post queue.

---

## � Step 3: Start the Workers in Server

**File**: `backend/server.js`

Add this import alongside the existing post worker import:

```javascript
import "./workers/postNotification.worker.js";      // Handles both posts AND reels
import "./workers/followNotification.worker.js";    // Only follow requests
```

Only **2 workers** now, not 3!

---

## �📊 Step 4: Update Notification Model (Optional but Recommended)

**File**: `backend/models/notification.model.js`

Change `postId` from `required: true` to `required: false` since follow-requests don't have a postId:

```javascript
postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: false  // Changed from true
},

type: {
    type: String,
    enum: ["post", "follow-request", "like", "comment", "reel"],  // Add "reel"
    required: true
},
```

---

## ✅ Testing Your Notifications

### Test Follow Notification:
1. User A follows User B (or sends follow request if User B is private)
2. Open browser dev tools → Network tab
3. Check if socket receives `new-notification` event
4. Check MongoDB if Notification document was created

### Test Reel Notification:
1. User A uploads a reel
2. Check if followers of User A get notified
3. Verify notification appears on frontend in real-time

---

## 🔍 Debugging Checklist

If notifications don't work:

- [ ] Worker started? Check `backend/server.js` has the import
- [ ] Queue job created? Add `console.log()` in controller after `.add()`
- [ ] Worker processing? Check terminal for "Job completed" message
- [ ] Redis working? Test `redis-cli ping`
- [ ] Socket subscribed? Check socket.js logs "Subscribed to new-notification"
- [ ] User online? Check socket.js logs "Online users: Map { ... }"
- [ ] MongoDB doc created? Check `Notification` collection in MongoDB

---

## 📁 File Summary

### New Files to Create:
```
backend/queues/followNotification.queue.js       (follow requests only)
backend/workers/followNotification.worker.js      (follow requests only)
```

**NOTE**: Reels use the existing post notification queue/worker!

### Files to Update:
```
backend/controllers/follow.controller.js          (add .add() call)
backend/controllers/reel.controller.js            (add .add() call)
backend/models/notification.model.js             (make postId optional, add "reel" type)
backend/server.js                                (import followNotification worker)
```

### Files to Modify:
```
backend/workers/postNotification.worker.js       (update to handle both posts and reels)
```

---

## 🎯 The Pattern - Reusable for Future Notifications

You now have TWO patterns:

### Pattern A: "Send to all followers" (posts & reels)
- Share the same queue and worker
- Just pass `type` field to distinguish them
- Example: Posts, Reels, or any other "broadcast to followers" notification

### Pattern B: "Send to one person" (follow requests, direct messages)
- Create a dedicated queue and worker
- Receiver is a single user, not a list of followers
- Example: Follow requests, likes, comments, DMs
