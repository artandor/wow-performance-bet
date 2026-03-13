"use client";

import { useEffect, useRef } from "react";
import { setActiveServerIdAction } from "@/lib/server-cookie";

interface ServerContextInitializerProps {
  activeServerId: string;
  hasExistingCookie: boolean;
}

/**
 * Client component that initializes the active server cookie on first load
 * if no cookie exists yet.
 */
export default function ServerContextInitializer({
  activeServerId,
  hasExistingCookie,
}: ServerContextInitializerProps) {
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only run once and only if there's no existing cookie
    if (!hasInitialized.current && !hasExistingCookie && activeServerId) {
      hasInitialized.current = true;
      
      // Set the cookie via Server Action
      setActiveServerIdAction(activeServerId).catch((error) => {
        console.error("Failed to initialize server context:", error);
      });
    }
  }, [activeServerId, hasExistingCookie]);

  return null; // This component doesn't render anything
}
