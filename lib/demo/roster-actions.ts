/**
 * DEMO MODE – Roster action implementations backed by the in-memory store.
 */
import { getRoster, saveRoster } from './store'

export function demoGetRoster(): string[] {
  return getRoster()
}

export function demoImportRoster(roster: string[]): void {
  if (!roster || roster.length === 0) throw new Error('Roster cannot be empty')
  saveRoster(roster)
}
