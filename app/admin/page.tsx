'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Team } from '@/types/team'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD

export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [pwInput, setPwInput] = useState('')
  const [pwShake, setPwShake] = useState(false)
  const [pwError, setPwError] = useState(false)

  const router = useRouter()
  const [teams, setTeams] = useState<Team[]>([])
  const [names, setNames] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsAuthed(sessionStorage.getItem('auth_admin') === 'true')
  }, [])

  useEffect(() => {
    if (!isAuthed) return
    supabase
      .from('teams')
      .select('*')
      .order('team_id')
      .then(({ data }) => {
        if (data) {
          setTeams(data)
          const initNames: Record<string, string> = {}
          data.forEach(t => { initNames[t.team_id] = t.name })
          setNames(initNames)
        }
        setLoading(false)
      })
  }, [isAuthed])

  function handleLogin() {
    if (pwInput === ADMIN_PASSWORD) {
      sessionStorage.setItem('auth_admin', 'true')
      setIsAuthed(true)
    } else {
      setPwError(true)
      setPwShake(true)
      setTimeout(() => { setPwShake(false); setPwError(false) }, 600)
      setPwInput('')
    }
  }

  async function handleSave(teamId: string) {
    const newName = names[teamId]?.trim()
    if (!newName) return
    setSaving(prev => ({ ...prev, [teamId]: true }))
    await supabase
      .from('teams')
      .update({ name: newName })
      .eq('team_id', teamId)
    setSaving(prev => ({ ...prev, [teamId]: false }))
    setSaved(prev => ({ ...prev, [teamId]: true }))
    setTimeout(() => setSaved(prev => ({ ...prev, [teamId]: false })), 2000)
  }

  if (!isAuthed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050508] cyber-grid">
        <div
          className={`relative w-full max-w-sm mx-4 p-8 rounded-lg bg-[#0A0A12] border ${
            pwError ? 'border-red-500' : 'border-[#BF00FF]/30'
          } ${pwShake ? 'animate-shake' : ''}`}
          style={{ boxShadow: pwError ? '0 0 30px rgba(255,0,0,0.3)' : '0 0 30px rgba(191,0,255,0.15)' }}
        >
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#BF00FF]" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#BF00FF]" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#BF00FF]" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#BF00FF]" />

          <h2
            className="text-center text-2xl tracking-[0.3em] mb-2 text-[#BF00FF]"
            style={{ fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 10px #BF00FF' }}
          >
            ADMIN
          </h2>
          <p className="text-center text-white/40 text-sm mb-6 tracking-wider">
            ADMIN ACCESS ONLY
          </p>

          <input
            type="password"
            value={pwInput}
            onChange={e => setPwInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className={`w-full bg-[#0D0D1F] border ${
              pwError ? 'border-red-500' : 'border-[#BF00FF]/30 focus:border-[#BF00FF]'
            } text-white text-center text-xl tracking-[0.5em] p-4 rounded outline-none transition-colors`}
            style={{ fontFamily: 'Share Tech Mono, monospace' }}
            placeholder="• • • • •"
            autoFocus
          />
          {pwError && (
            <p className="text-red-500 text-center text-sm mt-2 tracking-wider">ACCESS DENIED</p>
          )}
          <button
            onClick={handleLogin}
            className="cyber-btn mt-6 w-full py-4 rounded text-[#050508] font-bold text-lg tracking-[0.2em] bg-[#BF00FF] hover:bg-white transition-colors"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            AUTHENTICATE
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="text-[#BF00FF] text-2xl tracking-[0.3em] animate-pulse" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          LOADING...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050508] cyber-grid scanlines flex items-center justify-center">
      <div className="flex flex-col items-center px-4 py-8 w-full max-w-lg mx-auto">

        <h1
          className="text-2xl sm:text-3xl tracking-[0.3em] uppercase mb-2"
          style={{ fontFamily: 'Orbitron, sans-serif', color: '#BF00FF', textShadow: '0 0 10px #BF00FF, 0 0 30px #BF00FF' }}
        >
          ADMIN
        </h1>
        <p className="text-white/30 text-sm tracking-[0.4em] uppercase mb-8" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          MANAGE GROUP NAMES
        </p>

        {/* Name editors */}
        <div className="flex flex-col gap-4 w-full">
          {teams.map(team => (
            <div key={team.team_id} className="flex items-center gap-3">
              {/* Color dot */}
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: team.color, boxShadow: `0 0 6px ${team.color}` }}
              />

              {/* Name input */}
              <input
                type="text"
                value={names[team.team_id] ?? ''}
                onChange={e => setNames(prev => ({ ...prev, [team.team_id]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleSave(team.team_id)}
                className="flex-1 min-w-0 bg-[#0D0D1F] border border-white/20 text-white px-4 rounded-lg outline-none focus:border-[#BF00FF]/60 transition-colors h-14 text-lg"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              />

              {/* Save button */}
              <button
                onClick={() => handleSave(team.team_id)}
                disabled={saving[team.team_id]}
                className="cyber-btn flex-shrink-0 h-14 px-5 rounded-lg border font-bold text-sm tracking-widest transition-colors"
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  borderColor: saved[team.team_id] ? '#00FF4140' : '#BF00FF40',
                  color: saved[team.team_id] ? '#00FF41' : '#BF00FF',
                  backgroundColor: saved[team.team_id] ? '#00FF4110' : '#BF00FF10',
                  minWidth: '80px',
                }}
              >
                {saving[team.team_id] ? '...' : saved[team.team_id] ? 'SAVED' : 'SAVE'}
              </button>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          className="w-full h-[1px] my-8 opacity-20"
          style={{ background: 'linear-gradient(90deg, transparent, #BF00FF, transparent)' }}
        />

        {/* Quick access to team calculators */}
        <p className="text-white/30 text-sm tracking-[0.4em] uppercase mb-4" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          QUICK ACCESS — CALCULATORS
        </p>
        <div className="grid grid-cols-2 gap-3 w-full">
          {teams.map(team => (
            <button
              key={team.team_id}
              onClick={() => router.push(`/team/${team.team_id}`)}
              className="cyber-btn h-16 rounded-lg border font-bold text-base tracking-widest flex items-center justify-center gap-3"
              style={{
                fontFamily: 'Orbitron, sans-serif',
                borderColor: `${team.color}40`,
                color: team.color,
                backgroundColor: `${team.color}10`,
                boxShadow: `0 0 10px ${team.color}20`,
                textShadow: `0 0 8px ${team.color}`,
              }}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: team.color, boxShadow: `0 0 6px ${team.color}` }}
              />
              {names[team.team_id] || team.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
