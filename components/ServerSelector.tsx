"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { setActiveServerIdAction } from "@/lib/server-cookie";

interface Guild {
  id: string;
  name: string;
  icon: string | null;
}

interface ServerSelectorProps {
  guilds: Guild[];
  activeServerId: string;
}

export default function ServerSelector({
  guilds,
  activeServerId,
}: ServerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const activeGuild = guilds.find((guild) => guild.id === activeServerId);
  
  if (!activeGuild) {
    return (
      <div className="text-red-400 text-sm">
        No server selected
      </div>
    );
  }
  
  const handleServerSwitch = async (serverId: string) => {
    if (serverId === activeServerId) {
      setIsOpen(false);
      return;
    }
    
    setIsLoading(true);
    try {
      await setActiveServerIdAction(serverId);
      setIsOpen(false);
      // Force a full page reload to clear all cached data
      window.location.href = '/';
    } catch (error) {
      console.error("Failed to switch server:", error);
      setIsLoading(false);
    }
  };
  
  const getGuildIconUrl = (guild: Guild) => {
    if (guild.icon) {
      return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
    }
    return null;
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
      >
        {activeGuild.icon ? (
          <div className="w-6 h-6 rounded overflow-hidden relative">
            <Image
              src={getGuildIconUrl(activeGuild)!}
              alt={activeGuild.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-6 h-6 rounded bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-400">
            {activeGuild.name.charAt(0).toUpperCase()}
          </div>
        )}
        
        <span className="text-white font-medium max-w-[150px] sm:max-w-[200px] truncate">
          {activeGuild.name}
        </span>
        
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-64 bg-gray-800 rounded-lg shadow-xl z-20 border border-gray-700 max-h-96 overflow-y-auto">
            <div className="px-4 py-3 border-b border-gray-700">
              <p className="text-sm font-medium text-white">Select Server</p>
              <p className="text-xs text-gray-400 mt-1">
                {guilds.length} {guilds.length === 1 ? "server" : "servers"} available
              </p>
            </div>
            
            <div className="py-1">
              {guilds.map((guild) => {
                const isActive = guild.id === activeServerId;
                const iconUrl = getGuildIconUrl(guild);
                
                return (
                  <button
                    key={guild.id}
                    onClick={() => handleServerSwitch(guild.id)}
                    disabled={isLoading}
                    className={`w-full text-left px-4 py-2 flex items-center gap-3 transition-colors disabled:opacity-50 ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {iconUrl ? (
                      <div className="w-8 h-8 rounded overflow-hidden relative flex-shrink-0">
                        <Image
                          src={iconUrl}
                          alt={guild.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {guild.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    
                    <span className="text-sm font-medium truncate flex-1">
                      {guild.name}
                    </span>
                    
                    {isActive && (
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
