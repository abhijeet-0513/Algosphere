const { createClient } = require("redis");

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASS,
  socket: {
    host: "redis-18017.c305.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 18017,
  },
});

module.exports = redisClient;
