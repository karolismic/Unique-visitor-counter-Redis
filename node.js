const express = require('express');
const redis = require('redis');
const app = express();
const port = 3000;

// Connect to Redis
const redisClient = redis.createClient({
    host: 'your_redis_host',
    port: your_redis_port,
    password: 'your_redis_password'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

app.get('/visitor-count', async (req, res) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        // Use the IP address to track unique visitors
        const reply = await redisClient.sAddAsync('unique_visitors', ip);
        const count = await redisClient.sCardAsync('unique_visitors');
        res.json({ count });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
