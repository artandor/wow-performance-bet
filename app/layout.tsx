import type { Metadata } from 'next'
import './globals.css'
import { auth } from '@/lib/auth'
import { getServerContext } from '@/lib/server-context'
import UserMenu from '@/components/UserMenu'
import ServerSelector from '@/components/ServerSelector'
import ServerContextInitializer from '@/components/ServerContextInitializer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'WoW DPS Betting',
  description: 'Bet on WoW group performance',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  const serverContext = session ? await getServerContext() : null;
  
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {session && serverContext && (
          <>
            <ServerContextInitializer
              activeServerId={serverContext.activeServerId}
              hasExistingCookie={serverContext.hasCookie}
            />
            <nav className="bg-gray-900 border-b border-gray-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center gap-6">
                    <Link href="/" className="text-xl font-bold text-white">
                      WoW DPS Betting
                    </Link>
                    
                    <ServerSelector
                      guilds={serverContext.guilds}
                      activeServerId={serverContext.activeServerId}
                    />
                  </div>
                  
                  <UserMenu user={session.user} />
                </div>
              </div>
            </nav>
          </>
        )}
        
        {children}
      </body>
    </html>
  )
}
