const express = require('express');
const redis = require('redis');

const app = express();
const port = 3001;

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:6379`
});
redisClient.connect();

app.get('/stats/:code', async (req, res) => {
  const { code } = req.params;
  const count = await redisClient.get(`hits:${code}`) || 0;
  res.json({ code, hits: parseInt(count) });
});

app.listen(port, () => console.log(`Stats Service running on port ${port}`));
