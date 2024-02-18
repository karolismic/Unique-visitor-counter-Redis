const express = require('express');
const redis = require('redis');
const app = express();
const port = process.env.PORT || 3000; // Use the PORT environment variable if available

// Connect to Redis
const redisClient = redis.createClient({
  host: 'redis-cache-786.redis.cache.windows.net', // Replace with your Azure Redis Cache hostname
  port: 6379, // Azure Redis Cache TLS port, use 6379 for non-TLS
  password: 'cXz5pqDRbb6GMGA1o5nYsqaJZqNF5LmSEAzCaEIgbjM=', // Replace with your primary key
  tls: {} // Azure Redis Cache requires TLS
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

app.get('/visitor-count', async (req, res) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        // Use the IP address to track unique visitors
        await redisClient.sAddAsync('unique_visitors', ip);
        const count = await redisClient.sCardAsync('unique_visitors');
        res.json({ count });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
