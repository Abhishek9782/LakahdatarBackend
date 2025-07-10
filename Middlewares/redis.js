const dotenv = require("dotenv");
dotenv.config();
// redis.js
const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => {
  console.error("Redis connection error:", err);
});

const connectRedis = async () => {
  try {
    await client.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Failed to connect Redis:", err.message);
  }
};

connectRedis();

module.exports = client;
