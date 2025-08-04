const { Pool } = require('pg');
const redis = require('redis');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:6379`
});

async function syncStats() {
  await redisClient.connect();
  console.log('Worker Service: Connected to Redis and Postgres');

  setInterval(async () => {
    const keys = await redisClient.keys('hits:*');
    for (const key of keys) {
      const count = await redisClient.get(key);
      const code = key.split(':')[1];

      // Upsert into Postgres (write logic later)
      console.log(`Syncing ${code} with count ${count} to Postgres...`);

      // Example upsert logic here (table "stats" in Postgres)
      await pool.query(`
        INSERT INTO stats(code, hits) VALUES($1, $2)
        ON CONFLICT (code) DO UPDATE SET hits = EXCLUDED.hits
      `, [code, count]);
    }
  }, 10000); // every 10 seconds
}

syncStats();
