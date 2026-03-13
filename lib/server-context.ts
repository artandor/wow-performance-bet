import { auth } from "@/lib/auth";
import { getActiveServerId } from "@/lib/server-cookie";

interface Guild {
  id: string;
  name: string;
  icon: string | null;
}

export interface ServerContext {
  activeServerId: string;
  guilds: Guild[];
  isValid: boolean;
  hasCookie: boolean; // Whether a cookie was already set
}

/**
 * Get the current server context from the session and cookies
 * Validates that the active server exists in the user's guild list
 * Defaults to the first guild if no active server is set or if it's invalid
 * 
 * NOTE: This function does NOT set cookies. Cookies are only set via Server Actions
 * when the user explicitly switches servers.
 */
export async function getServerContext(): Promise<ServerContext | null> {
  const session = await auth();
  
  if (!session?.user?.guilds) {
    return null;
  }
  
  const guilds = session.user.guilds;
  const cookieServerId = await getActiveServerId();
  let activeServerId = cookieServerId;
  let isValid = true;
  const hasCookie = !!cookieServerId;
  
  // If no active server is set, default to first guild (but don't set cookie)
  if (!activeServerId && guilds.length > 0) {
    activeServerId = guilds[0].id;
    isValid = true;
  }
  
  // Validate that activeServerId exists in user's guild list
  if (activeServerId) {
    const guildExists = guilds.some((guild: { id: string }) => guild.id === activeServerId);
    
    if (!guildExists && guilds.length > 0) {
      // Invalid server, reset to first guild (but don't set cookie)
      activeServerId = guilds[0].id;
      isValid = false;
    } else if (!guildExists) {
      // No guilds at all
      return null;
    }
  }
  
  return {
    activeServerId: activeServerId!,
    guilds,
    isValid,
    hasCookie,
  };
}

/**
 * Verify that a user has access to a specific server
 */
export async function verifyServerAccess(
  serverId: string
): Promise<{ hasAccess: boolean; userId: string | null }> {
  const session = await auth();
  
  if (!session?.user?.id || !session?.user?.guilds) {
    return { hasAccess: false, userId: null };
  }
  
  const hasAccess = session.user.guilds.some((guild: { id: string }) => guild.id === serverId);
  
  return {
    hasAccess,
    userId: session.user.id,
  };
}

/**
 * Get the current user's Discord ID
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id || null;
}

/**
 * Get the current user's Discord info (ID and username)
 */
export async function getCurrentUser(): Promise<{ id: string; name: string } | null> {
  const session = await auth();
  if (!session?.user?.id || !session?.user?.name) {
    return null;
  }
  return {
    id: session.user.id,
    name: session.user.name,
  };
}
