import Redis from "ioredis";
import { client } from "../utils/redis-client.js";


const rateLimiter = ({ keyPrefix, limit, windowSec }) => {
    return async (req, res, next) => {
        try {
            const identifier = req.user?._id ? `user:${req.user._id}` : `ip:${req.ip}`
            console.log("Rate limit identifier:", identifier);

            const rediskey = `rate:${keyPrefix}:${identifier}`

            const [[, count]] = await client
                .multi()
                .incr(rediskey)
                .expire(rediskey, windowSec)
                .exec();

            if (count > limit) {
                return res.status(429).json({ message: "Too many requests. Please try again later." })
            }

            next()
        } catch (error) {
            console.error("Rate limiter error", error)
            next()
        }
    }
}

export default rateLimiter