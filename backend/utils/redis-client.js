import Redis from "ioredis";

const client = new Redis(process.env.REDIS_URL, {
    tls: {},
});

export {
    client
}