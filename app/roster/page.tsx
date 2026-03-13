'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import CoinLoader from '@/components/CoinLoader'
import RosterImport from '@/components/RosterImport'
import RosterDisplay from '@/components/RosterDisplay'
import { importRoster, getRosterAction } from '@/app/actions/roster'

export default function RosterPage() {
  const [roster, setRoster] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRoster()
  }, [])

  const loadRoster = async () => {
    setLoading(true)
    const data = await getRosterAction()
    setRoster(data)
    setLoading(false)
  }

  const handleImport = async (newRoster: string[]) => {
    await importRoster(newRoster)
    await loadRoster()
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-gold transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to bets
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-bright mb-6">Roster management</h1>

      <div className="space-y-6">
        <RosterImport onImport={handleImport} currentRoster={roster} />

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <CoinLoader size="sm" />
          </div>
        ) : (
          <RosterDisplay roster={roster} />
        )}
      </div>
    </main>
  )
}
