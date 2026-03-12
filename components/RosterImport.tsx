'use client'

import { useState } from 'react'

interface RosterImportProps {
  onImport: (roster: string[]) => Promise<void>
  currentRoster: string[]
}

export default function RosterImport({ onImport, currentRoster }: RosterImportProps) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleImport = async () => {
    setIsLoading(true)
    setMessage('')
    
    try {
      await onImport(parseRoster(input))
      setMessage('Roster imported successfully!')
      setInput('')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to import roster')
    } finally {
      setIsLoading(false)
    }
  }

  const parseRoster = (text: string): string[] => {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="roster-input" className="block text-sm font-medium text-gray-700 mb-2">
          Import Roster (one name per line)
        </label>
        <textarea
          id="roster-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="PlayerName1&#10;PlayerName2&#10;PlayerName3"
        />
      </div>
      
      <button
        onClick={handleImport}
        disabled={isLoading || !input.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Importing...' : 'Import Roster'}
      </button>
      
      {message && (
        <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
