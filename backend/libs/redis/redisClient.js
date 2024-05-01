import { createClient } from "redis";
const redisClient = createClient({
    url: 'redis://localhost:6379' // Specify your Redis server URL
  });
  
  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  redisClient.on('connect', () => console.log('Connected to Redis'));
  
  const connectRedis = async () => {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  };

  const disconnetRedis = async() => {
    if(redisClient.isOpen){
      await redisClient.disconnect();
    }
  }
  
  export { redisClient, connectRedis, disconnetRedis };