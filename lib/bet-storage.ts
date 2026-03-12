import { Bet } from '@/types'
import { kvGet, kvSet, kvDelete, kvGetAll } from './kv'

const BET_PREFIX = 'bet:'

function getBetKey(id: string): string {
  return `${BET_PREFIX}${id}`
}

export async function createBet(bet: Bet): Promise<void> {
  await kvSet(getBetKey(bet.id), bet)
}

export async function getBet(id: string): Promise<Bet | null> {
  return await kvGet<Bet>(getBetKey(id))
}

export async function updateBet(bet: Bet): Promise<void> {
  await kvSet(getBetKey(bet.id), bet)
}

export async function deleteBet(id: string): Promise<void> {
  await kvDelete(getBetKey(id))
}

export async function getAllBets(): Promise<Bet[]> {
  return await kvGetAll<Bet>(`${BET_PREFIX}*`)
}

export function generateBetId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
