import { Roster } from '@/types'
import { kvGet, kvSet } from './kv'

const ROSTER_PREFIX = 'roster:'

function getRosterKey(serverId: string): string {
  return `${ROSTER_PREFIX}${serverId}`
}

export async function getRoster(serverId: string): Promise<Roster> {
  const roster = await kvGet<Roster>(getRosterKey(serverId))
  return roster || []
}

export async function setRoster(serverId: string, roster: Roster): Promise<void> {
  // Remove duplicates
  const uniqueRoster = Array.from(new Set(roster))
  await kvSet(getRosterKey(serverId), uniqueRoster)
}

export async function updateRoster(serverId: string, roster: Roster): Promise<void> {
  if (roster.length === 0) {
    throw new Error('Cannot set empty roster')
  }
  await setRoster(serverId, roster)
}
