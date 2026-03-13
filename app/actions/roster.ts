'use server'

import { revalidatePath } from 'next/cache'
import { setRoster, updateRoster, getRoster } from '@/lib/roster-storage'
import { getServerContext } from '@/lib/server-context'

export async function importRoster(roster: string[]) {
  const serverContext = await getServerContext()
  if (!serverContext) {
    throw new Error('No server context available')
  }
  
  if (!roster || roster.length === 0) {
    throw new Error('Roster cannot be empty')
  }
  
  await setRoster(serverContext.activeServerId, roster)
  revalidatePath('/roster')
}

export async function updateRosterAction(roster: string[]) {
  const serverContext = await getServerContext()
  if (!serverContext) {
    throw new Error('No server context available')
  }
  
  await updateRoster(serverContext.activeServerId, roster)
  revalidatePath('/roster')
}

export async function getRosterAction() {
  const serverContext = await getServerContext()
  if (!serverContext) {
    return []
  }
  
  return await getRoster(serverContext.activeServerId)
}
