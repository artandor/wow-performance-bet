'use server'

import { revalidatePath } from 'next/cache'
import { setRoster, updateRoster, getRoster } from '@/lib/roster-storage'
import { getServerContext } from '@/lib/server-context'
import * as demo from '@/lib/demo/roster-actions'

const IS_DEMO = process.env.DEMO_MODE === 'true'

export async function importRoster(roster: string[]) {
  if (IS_DEMO) { demo.demoImportRoster(roster); return }
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
  if (IS_DEMO) { demo.demoImportRoster(roster); return }
  const serverContext = await getServerContext()
  if (!serverContext) {
    throw new Error('No server context available')
  }
  
  await updateRoster(serverContext.activeServerId, roster)
  revalidatePath('/roster')
}

export async function getRosterAction() {
  if (IS_DEMO) return demo.demoGetRoster()
  const serverContext = await getServerContext()
  if (!serverContext) {
    return []
  }
  
  return await getRoster(serverContext.activeServerId)
}
