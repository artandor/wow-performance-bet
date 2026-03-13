"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const ACTIVE_SERVER_COOKIE = "active-server-id";

export async function getActiveServerId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ACTIVE_SERVER_COOKIE)?.value;
}

/**
 * Server Action to set the active server ID
 */
export async function setActiveServerIdAction(serverId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_SERVER_COOKIE, serverId, {
    httpOnly: false, // Needs to be accessible by client for UI updates
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
  
  // Revalidate paths to trigger re-render with new server context
  revalidatePath("/");
  revalidatePath("/bets");
  revalidatePath("/roster");
}

export async function clearActiveServerId(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ACTIVE_SERVER_COOKIE);
}
