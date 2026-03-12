'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BetCreationForm from '@/components/BetCreationForm'
import { createBetAction } from '@/app/actions/bet'

export default function NewBetPage() {
  const router = useRouter()

  const handleCreateBet = async (goldAmount: number, closesAt: number) => {
    const betId = await createBetAction(goldAmount, closesAt)
    router.push(`/bets/${betId}`)
  }

  return (
    <main className="container mx-auto p-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Bets
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Bet</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <BetCreationForm onCreateBet={handleCreateBet} />
      </div>
    </main>
  )
}
