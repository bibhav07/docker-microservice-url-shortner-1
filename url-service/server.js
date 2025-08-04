const express = require('express');
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const redis = require('redis');

const app = express();
const port = 3000;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

app.use(express.json());

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:6379`
});
redisClient.connect();

app.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;
  const shortCode = nanoid(6);

  await pool.query('INSERT INTO urls (code, original_url) VALUES ($1, $2)', [shortCode, originalUrl]);

  res.json({ shortUrl: `${req.headers.host}/${shortCode}` });
});

app.get('/:code', async (req, res) => {
  const { code } = req.params;
  const result = await pool.query('SELECT original_url FROM urls WHERE code = $1', [code]);

  if (result.rows.length > 0) {
    // Increment hits in Redis
    await redisClient.incr(`hits:${code}`);
    // Redirect to original URL
    res.redirect(result.rows[0].original_url);
  } else {
    res.status(404).send('URL not found');
  }
});

app.listen(port, () => console.log(`URL Service running on port ${port}`));
