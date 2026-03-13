import { Bet } from '@/types'
import { kvGet, kvSet, kvDelete, kvGetAll } from './kv'
import Redis from 'ioredis'

const BET_PREFIX = 'bet:'
const SERVER_BETS_PREFIX = 'server:'

function getBetKey(id: string): string {
  return `${BET_PREFIX}${id}`
}

function getServerBetsKey(serverId: string): string {
  return `${SERVER_BETS_PREFIX}${serverId}:bets`
}

// Get Redis client for set operations
const getRedisClient = () => {
  if (process.env.REDIS_URL) {
    return new Redis(process.env.REDIS_URL)
  }
  throw new Error('Redis client required for server indexing')
}

/**
 * Add bet ID to server's bet index
 */
async function addBetToServerIndex(serverId: string, betId: string): Promise<void> {
  try {
    const redis = getRedisClient()
    await redis.sadd(getServerBetsKey(serverId), betId)
  } catch (error) {
    console.error(`Failed to add bet to server index:`, error)
    // Non-fatal - bet still created, just not indexed
  }
}

/**
 * Remove bet ID from server's bet index
 */
async function removeBetFromServerIndex(serverId: string, betId: string): Promise<void> {
  try {
    const redis = getRedisClient()
    await redis.srem(getServerBetsKey(serverId), betId)
  } catch (error) {
    console.error(`Failed to remove bet from server index:`, error)
  }
}

export async function createBet(bet: Bet): Promise<void> {
  if (!bet.serverId) {
    throw new Error('serverId is required when creating a bet')
  }
  
  await kvSet(getBetKey(bet.id), bet)
  await addBetToServerIndex(bet.serverId, bet.id)
}

export async function getBet(id: string): Promise<Bet | null> {
  return await kvGet<Bet>(getBetKey(id))
}

export async function updateBet(bet: Bet): Promise<void> {
  await kvSet(getBetKey(bet.id), bet)
}

export async function deleteBet(id: string): Promise<void> {
  const bet = await getBet(id)
  if (bet?.serverId) {
    await removeBetFromServerIndex(bet.serverId, id)
  }
  await kvDelete(getBetKey(id))
}

/**
 * Get all bets for a specific server
 */
export async function getBetsByServerId(serverId: string): Promise<Bet[]> {
  try {
    const redis = getRedisClient()
    const betIds = await redis.smembers(getServerBetsKey(serverId))
    
    if (betIds.length === 0) return []
    
    const bets = await Promise.all(
      betIds.map((id) => getBet(id))
    )
    
    return bets.filter((bet): bet is Bet => bet !== null)
  } catch (error) {
    console.error('Failed to get bets by server:', error)
    // Fallback: get all bets and filter by serverId
    const allBets = await getAllBets()
    return allBets.filter((bet) => bet.serverId === serverId)
  }
}

export async function getAllBets(): Promise<Bet[]> {
  return await kvGetAll<Bet>(`${BET_PREFIX}*`)
}

export function generateBetId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
