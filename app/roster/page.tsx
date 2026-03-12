'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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
    <main className="container mx-auto p-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Bets
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Roster Management</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <RosterImport onImport={handleImport} currentRoster={roster} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {loading ? (
            <p className="text-gray-600">Loading roster...</p>
          ) : (
            <RosterDisplay roster={roster} />
          )}
        </div>
      </div>
    </main>
  )
}
