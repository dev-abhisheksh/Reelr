# Pub/Sub Notification Mistake

## Problem
When a user creates a post, the backend correctly enqueues a notification job, but the notification never appears in the client.

## Root cause
The worker that consumes the `post-notification` queue is defined in `backend/workers/postNotification.worker.js`, but it is not started by the running backend server.

This means:
- the job is pushed to BullMQ queue successfully
- but no worker process consumes the job
- therefore `Notification.insertMany(...)` never runs
- and `publisher.publish("new-notification", ...)` never runs
- the socket subscriber never receives the event
- frontend never receives `new-notification`

## Why this is a common mistake
This is a classic queue/pub-sub setup error: implementing producer logic and consumer logic, but not actually running the consumer.

In Node.js, a worker module must be imported/executed by the server startup or run as a separate process. Simply having the file in the repo is not enough.

## How to fix it
1. Ensure the worker process is started alongside the server.
2. Either:
   - import the worker module in startup code (for example in `backend/server.js`), or
   - run it as a separate process: `node backend/workers/postNotification.worker.js`
3. Confirm the queue, Redis publish, and socket subscription are active.

## How to avoid similar issues
Use boundary logging and validation for each segment of the pipeline:
- Job creation: verify the producer adds a job to the queue
- Worker startup: verify the consumer process starts successfully
- Publish: verify Redis publish is executed
- Subscribe: verify the subscriber receives the message
- Socket delivery: verify the socket emits to the client

If any step is missing, the notification flow will break even when the message logic itself is correct.