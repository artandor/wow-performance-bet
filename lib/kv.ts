import Redis from 'ioredis'

// Create Redis client - works with both Vercel KV and Redis Cloud
const getRedisClient = () => {
  // Check if using Vercel KV (REST API) or Redis Cloud (direct connection)
  if (process.env.KV_REST_API_URL) {
    // Use Vercel KV
    const { kv } = require('@vercel/kv')
    return kv
  } else if (process.env.REDIS_URL) {
    // Use Redis Cloud with ioredis
    return new Redis(process.env.REDIS_URL)
  } else {
    throw new Error('No Redis configuration found. Set either KV_REST_API_URL or REDIS_URL')
  }
}

const redis = getRedisClient()

export async function kvGet<T>(key: string): Promise<T | null> {
  try {
    const value = await redis.get(key)
    return value ? JSON.parse(value) : null
  } catch (error) {
    console.error(`KV get error for key ${key}:`, error)
    return null
  }
}

export async function kvSet<T>(key: string, value: T): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(value))
  } catch (error) {
    console.error(`KV set error for key ${key}:`, error)
    throw new Error('Failed to save data')
  }
}

export async function kvDelete(key: string): Promise<void> {
  try {
    await redis.del(key)
  } catch (error) {
    console.error(`KV delete error for key ${key}:`, error)
    throw new Error('Failed to delete data')
  }
}

export async function kvGetAll<T>(pattern: string): Promise<T[]> {
  try {
    const keys = await redis.keys(pattern)
    if (keys.length === 0) return []
    
    const values = await Promise.all(
      keys.map(async (key) => {
        const value = await redis.get(key)
        return value ? JSON.parse(value) : null
      })
    )
    
    return values.filter((v): v is T => v !== null)
  } catch (error) {
    console.error(`KV getAll error for pattern ${pattern}:`, error)
    return []
  }
}
