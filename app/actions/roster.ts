'use server'

import { revalidatePath } from 'next/cache'
import { setRoster, updateRoster, getRoster } from '@/lib/roster-storage'

export async function importRoster(roster: string[]) {
  if (!roster || roster.length === 0) {
    throw new Error('Roster cannot be empty')
  }
  
  await setRoster(roster)
  revalidatePath('/roster')
}

export async function updateRosterAction(roster: string[]) {
  await updateRoster(roster)
  revalidatePath('/roster')
}

export async function getRosterAction() {
  return await getRoster()
}
