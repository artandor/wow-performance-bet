import type { Metadata } from 'next'
import './globals.css'
import { Inter, Cinzel } from 'next/font/google'
import { auth } from '@/lib/auth'
import { getServerContext } from '@/lib/server-context'
import UserMenu from '@/components/UserMenu'
import ServerSelector from '@/components/ServerSelector'
import ServerContextInitializer from '@/components/ServerContextInitializer'
import Link from 'next/link'
import { Crown } from 'lucide-react'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-display', weight: ['400', '700', '900'] })

export const metadata: Metadata = {
  title: "Midas' Cartel",
  description: 'Bet on WoW group/individual performances',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const serverContext = session ? await getServerContext() : null;

  return (
    <html lang="en" className={`dark ${inter.variable} ${cinzel.variable}`}>
      <body className="bg-night text-bright min-h-screen">
        {process.env.DEMO_MODE === 'true' && (
          <div className="bg-gold/90 text-night text-xs font-semibold text-center py-1 px-4">
            DEMO MODE | Fake data, no real connection required
          </div>
        )}

        {/*
          Side decorations — xl+ only (≥ 1280 px).
          Drop your art at:
            /public/assets/side-left.png
            /public/assets/side-right.png
          Width = space between viewport edge and max-w-4xl content (56 rem).
          z-index 1 keeps them behind the content wrapper (z-[2]) and under the nav (z-50).
        */}
        <div
          className="hidden xl:block fixed top-0 left-0 bottom-0 pointer-events-none overflow-hidden"
          style={{ width: 'calc((100vw - 56rem) / 2)', zIndex: 1 }}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 bg-cover bg-top bg-no-repeat opacity-15"
            style={{ backgroundImage: 'url(/assets/side-left.png)' }}
          />
          {/* Inner-edge fade toward content */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-night" />
        </div>

        <div
          className="hidden xl:block fixed top-0 right-0 bottom-0 pointer-events-none overflow-hidden"
          style={{ width: 'calc((100vw - 56rem) / 2)', zIndex: 1 }}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 bg-cover bg-top bg-no-repeat opacity-15"
            style={{ backgroundImage: 'url(/assets/side-right.png)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-night" />
        </div>

        {session && serverContext && (
          <>
            <ServerContextInitializer
              activeServerId={serverContext.activeServerId}
              hasExistingCookie={serverContext.hasCookie}
            />
            <nav className="bg-surface border-b border-white/8 sticky top-0 z-50 backdrop-blur-md">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                  <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 group">
                      <Crown className="w-5 h-5 text-gold group-hover:scale-110 transition-transform duration-200" />
                      <span className="text-base font-bold font-display tracking-wide">
                        <span className="text-gold">Midas</span>
                        <span className="text-bright/60">&apos;</span>
                        <span className="text-bright"> Cartel</span>
                      </span>
                    </Link>
                    <div className="h-4 w-px bg-white/10" />
                    <ServerSelector guilds={serverContext.guilds} activeServerId={serverContext.activeServerId} />
                  </div>
                  <UserMenu user={session.user} />
                </div>
              </div>
            </nav>
          </>
        )}

        {/* z-[2]: sits above side panels (z-1) but below sticky nav (z-50) */}
        <div className="relative z-[2]">
          {children}
        </div>
      </body>
    </html>
  )
}

