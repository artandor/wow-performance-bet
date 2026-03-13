"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { setActiveServerIdAction } from "@/lib/server-cookie";
import { ChevronDown, Check } from "lucide-react";

interface Guild {
  id: string;
  name: string;
  icon: string | null;
}

interface ServerSelectorProps {
  guilds: Guild[];
  activeServerId: string;
}

export default function ServerSelector({ guilds, activeServerId }: ServerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const activeGuild = guilds.find((g) => g.id === activeServerId);

  if (!activeGuild) {
    return <span className="text-xs text-orange-400">Aucun serveur</span>;
  }

  const handleServerSwitch = async (serverId: string) => {
    if (serverId === activeServerId) { setIsOpen(false); return; }
    setIsLoading(true);
    try {
      await setActiveServerIdAction(serverId);
      setIsOpen(false);
      window.location.href = '/';
    } catch { setIsLoading(false); }
  };

  const getIconUrl = (guild: Guild) =>
    guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null;

  const GuildAvatar = ({ guild, size = 6 }: { guild: Guild; size?: number }) => {
    const url = getIconUrl(guild);
    const cls = `w-${size} h-${size} rounded-full overflow-hidden bg-rim flex-shrink-0 relative`;
    return url ? (
      <div className={cls}><Image src={url} alt={guild.name} fill className="object-cover" /></div>
    ) : (
      <div className={`${cls} flex items-center justify-center text-xs font-bold text-muted`}>
        {guild.name.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-elevated/60 hover:bg-elevated border border-white/10 hover:border-gold/20 transition-all disabled:opacity-50"
      >
        <GuildAvatar guild={activeGuild} size={6} />
        <span className="text-sm font-medium text-bright max-w-[140px] truncate">{activeGuild.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-2 w-64 bg-surface rounded-xl shadow-xl z-20 border border-white/10 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">Changer de serveur</p>
            </div>
            <div className="py-1 max-h-72 overflow-y-auto">
              {guilds.map((guild) => {
                const isActive = guild.id === activeServerId;
                return (
                  <button
                    key={guild.id}
                    onClick={() => handleServerSwitch(guild.id)}
                    disabled={isLoading}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors disabled:opacity-50 ${
                      isActive
                        ? "bg-gold/10 text-gold"
                        : "text-bright hover:bg-elevated"
                    }`}
                  >
                    <GuildAvatar guild={guild} size={8} />
                    <span className="text-sm font-medium truncate flex-1">{guild.name}</span>
                    {isActive && <Check className="w-4 h-4 text-gold flex-shrink-0" />}
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


interface Guild {
  id: string;
  name: string;
  icon: string | null;
}

interface ServerSelectorProps {
  guilds: Guild[];
  activeServerId: string;
}
