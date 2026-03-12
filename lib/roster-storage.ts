import { Roster } from '@/types'
import { kvGet, kvSet } from './kv'

const ROSTER_KEY = 'roster:main'

export async function getRoster(): Promise<Roster> {
  const roster = await kvGet<Roster>(ROSTER_KEY)
  return roster || []
}

export async function setRoster(roster: Roster): Promise<void> {
  // Remove duplicates
  const uniqueRoster = Array.from(new Set(roster))
  await kvSet(ROSTER_KEY, uniqueRoster)
}

export async function updateRoster(roster: Roster): Promise<void> {
  if (roster.length === 0) {
    throw new Error('Cannot set empty roster')
  }
  await setRoster(roster)
}
