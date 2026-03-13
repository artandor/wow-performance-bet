"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { LogOut, ChevronDown } from "lucide-react";

interface UserMenuProps {
  user: {
    id: string;
    username: string;
    avatar: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const avatarUrl = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : "/default-avatar.png";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-elevated/60 hover:bg-elevated border border-white/10 hover:border-gold/20 transition-all"
      >
        <div className="w-7 h-7 rounded-full overflow-hidden bg-rim relative">
          <Image src={avatarUrl} alt={user.username} fill className="object-cover" />
        </div>
        <span className="text-sm font-medium text-bright hidden sm:inline max-w-[120px] truncate">
          {user.username}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-52 bg-surface rounded-xl shadow-xl z-20 border border-white/10 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-xs text-muted">Connecté en tant que</p>
              <p className="text-sm font-semibold text-bright truncate mt-0.5">{user.username}</p>
            </div>
            <div className="py-1">
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full text-left px-4 py-2.5 text-sm text-muted hover:bg-elevated hover:text-bright transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Se déconnecter
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


interface UserMenuProps {
  user: {
    id: string;
    username: string;
    avatar: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}
