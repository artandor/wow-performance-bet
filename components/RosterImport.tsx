'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Upload, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react'

interface RosterImportProps {
  onImport: (roster: string[]) => Promise<void>
  currentRoster: string[]
}

/** Parse a plain text block — one name per line */
function parseText(text: string): string[] {
  return text.split('\n').map(l => l.trim()).filter(Boolean)
}

/**
 * Parse CSV / TSV — first column is the player name.
 * Skips rows where col[0] is literally "name" (header guard).
 */
function parseCsv(text: string): string[] {
  return text
    .split('\n')
    .map(line => (line.split(/[,;\t]/)[0] ?? '').trim())
    .filter(name => name.length > 0 && !/^name$/i.test(name))
}

export default function RosterImport({ onImport }: RosterImportProps) {
  const [input, setInput]       = useState('')
  const [fileName, setFileName] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage]   = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = ev => {
      const names = parseCsv(ev.target?.result as string)
      setInput(names.join('\n'))
      setMessage('')
    }
    reader.readAsText(file)
  }

  const clearFile = () => {
    setFileName('')
    setInput('')
    setMessage('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleImport = async () => {
    setLoading(true)
    setMessage('')
    try {
      const names = parseText(input)
      if (names.length === 0) { setMessage('No players detected.'); return }
      await onImport(names)
      setMessage(`${names.length} player${names.length > 1 ? 's' : ''} imported!`)
      setInput('')
      setFileName('')
      if (fileRef.current) fileRef.current.value = ''
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Import failed')
    } finally {
      setLoading(false)
    }
  }

  const preview = parseText(input)
  const isSuccess = message.includes('imported')

  return (
    <div className="rounded-xl border border-white/10 bg-surface p-6 space-y-5">
      <div>
        <h3 className="text-sm font-bold text-bright uppercase tracking-widest mb-0.5">Import Roster</h3>
        <p className="text-xs text-muted">Upload a CSV (col 1&nbsp;=&nbsp;name) or paste names manually.</p>
      </div>

      {/* ── CSV upload ── */}
      <div>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.txt"
          onChange={handleFileChange}
          className="sr-only"
          id="roster-file"
        />
        <Label
          htmlFor="roster-file"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 bg-elevated hover:border-gold/40 cursor-pointer text-sm text-muted hover:text-bright transition-colors"
        >
          <FileText className="w-4 h-4 text-gold flex-shrink-0" />
          {fileName ? (
            <span className="flex items-center gap-2">
              <span className="truncate max-w-[180px]">{fileName}</span>
              <span
                role="button"
                tabIndex={0}
                onClick={e => { e.preventDefault(); clearFile() }}
                onKeyDown={e => e.key === 'Enter' && clearFile()}
                className="text-muted/60 hover:text-red-400 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </span>
            </span>
          ) : (
            'Choose CSV file…'
          )}
        </Label>
        <p className="text-[11px] text-muted/45 mt-1.5">.csv or .txt — first column is used as player name</p>
      </div>

      {/* ── divider ── */}
      <div className="flex items-center gap-3 text-xs text-muted/35">
        <div className="flex-1 h-px bg-white/5" />
        or paste manually
        <div className="flex-1 h-px bg-white/5" />
      </div>

      {/* ── Textarea ── */}
      <div className="space-y-1.5">
        <Label htmlFor="roster-input" className="text-xs text-muted">One name per line</Label>
        <textarea
          id="roster-input"
          value={input}
          onChange={e => { setInput(e.target.value); setFileName('') }}
          rows={6}
          className="w-full rounded-lg border border-white/10 bg-elevated px-3 py-2.5 text-sm text-bright placeholder:text-muted/35 focus:outline-none focus:ring-1 focus:ring-gold/40 focus:border-gold/30 resize-none transition-colors"
          placeholder={'Aralindë\nPyrethis\nGornak\n…'}
        />
        {preview.length > 0 && (
          <p className="text-xs text-gold">
            {preview.length} player{preview.length > 1 ? 's' : ''} ready to import
          </p>
        )}
      </div>

      <Button
        onClick={handleImport}
        disabled={isLoading || !input.trim()}
        className="gap-2 w-full sm:w-auto"
      >
        <Upload className="w-4 h-4" />
        {isLoading ? 'Importing…' : 'Import Roster'}
      </Button>

      {message && (
        <div className={`flex items-center gap-2 text-sm ${isSuccess ? 'text-goblin' : 'text-orange-400'}`}>
          {isSuccess
            ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            : <AlertCircle  className="w-4 h-4 flex-shrink-0" />}
          {message}
        </div>
      )}
    </div>
  )
}
