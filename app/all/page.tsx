'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAllTeams } from '@/hooks/useAllTeams'
import type { Team } from '@/types/team'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD

const presets = [10, 50, 100]

function TeamCalculatorCard({
  team,
  onAdjust,
}: {
  team: Team
  onAdjust: (teamId: string, delta: number) => Promise<void>
}) {
  const [customValue, setCustomValue] = useState('')
  const [animating, setAnimating] = useState(false)

  async function handleAdjust(delta: number) {
    if (delta === 0) return
    setAnimating(true)
    await onAdjust(team.team_id, delta)
    setTimeout(() => setAnimating(false), 300)
  }

  return (
    <div
      className="flex flex-col p-4 rounded-lg bg-[#0A0A12] border"
      style={{ borderColor: `${team.color}30`, boxShadow: `0 0 15px ${team.color}10` }}
    >
      {/* Header row: name + points */}
      <div className="flex items-center justify-between mb-3">
        <h2
          className="text-base sm:text-lg tracking-[0.2em] uppercase neon-text-soft truncate mr-2"
          style={{ fontFamily: 'Orbitron, sans-serif', color: team.color }}
        >
          {team.name}
        </h2>
        <div
          className={`text-3xl font-bold flex-shrink-0 ${animating ? 'animate-number-pop' : ''}`}
          style={{
            fontFamily: 'Share Tech Mono, monospace',
            color: '#ffffff',
            textShadow: `0 0 12px ${team.color}`,
          }}
        >
          {team.points.toLocaleString()}
        </div>
      </div>

      {/* Divider */}
      <div
        className="w-full h-[1px] mb-3 opacity-20"
        style={{ background: `linear-gradient(90deg, transparent, ${team.color}, transparent)` }}
      />

      {/* Add Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        {presets.map(v => (
          <button
            key={`add-${v}`}
            onClick={() => handleAdjust(v)}
            className="cyber-btn h-10 rounded border text-sm font-bold"
            style={{
              fontFamily: 'Share Tech Mono, monospace',
              borderColor: '#00FF4140',
              color: '#00FF41',
              backgroundColor: '#00FF4110',
            }}
          >
            +{v}
          </button>
        ))}
      </div>

      {/* Deduct Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {presets.map(v => (
          <button
            key={`sub-${v}`}
            onClick={() => handleAdjust(-v)}
            className="cyber-btn h-10 rounded border text-sm font-bold"
            style={{
              fontFamily: 'Share Tech Mono, monospace',
              borderColor: '#FF00FF40',
              color: '#FF00FF',
              backgroundColor: '#FF00FF10',
            }}
          >
            -{v}
          </button>
        ))}
      </div>

      {/* Custom Amount */}
      <div className="flex gap-2 items-stretch">
        <input
          type="number"
          value={customValue}
          onChange={e => setCustomValue(e.target.value)}
          className="flex-1 min-w-0 bg-[#0D0D1F] border border-white/20 text-white text-center text-base p-2 rounded outline-none focus:border-[#00FFFF]/50 transition-colors"
          style={{ fontFamily: 'Share Tech Mono, monospace' }}
          placeholder="0"
          inputMode="numeric"
        />
        <button
          onClick={() => {
            const val = parseInt(customValue)
            if (!isNaN(val)) {
              handleAdjust(val)
              setCustomValue('')
            }
          }}
          className="cyber-btn rounded border font-bold text-xl flex-shrink-0"
          style={{
            fontFamily: 'Share Tech Mono, monospace',
            borderColor: '#00FFFF40',
            color: '#00FFFF',
            backgroundColor: '#00FFFF10',
            width: '40px',
            height: '40px',
          }}
        >
          +
        </button>
        <button
          onClick={() => {
            const val = parseInt(customValue)
            if (!isNaN(val)) {
              handleAdjust(-val)
              setCustomValue('')
            }
          }}
          className="cyber-btn rounded border font-bold text-xl flex-shrink-0"
          style={{
            fontFamily: 'Share Tech Mono, monospace',
            borderColor: '#FF00FF40',
            color: '#FF00FF',
            backgroundColor: '#FF00FF10',
            width: '40px',
            height: '40px',
          }}
        >
          -
        </button>
      </div>
    </div>
  )
}

export default function AllCalculatorsPage() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [pwInput, setPwInput] = useState('')
  const [pwShake, setPwShake] = useState(false)
  const [pwError, setPwError] = useState(false)

  const { teams, loading } = useAllTeams()

  useEffect(() => {
    setIsAuthed(sessionStorage.getItem('auth_admin') === 'true')
  }, [])

  function handleLogin() {
    if (pwInput === ADMIN_PASSWORD) {
      sessionStorage.setItem('auth_admin', 'true')
      setIsAuthed(true)
    } else {
      setPwError(true)
      setPwShake(true)
      setTimeout(() => {
        setPwShake(false)
        setPwError(false)
      }, 600)
      setPwInput('')
    }
  }

  const adjustPoints = useCallback(
    async (teamId: string, delta: number) => {
      const team = teams.find(t => t.team_id === teamId)
      if (!team) return
      await supabase
        .from('teams')
        .update({ points: team.points + delta, updated_at: new Date().toISOString() })
        .eq('team_id', teamId)
    },
    [teams]
  )

  if (!isAuthed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050508] cyber-grid">
        <div
          className={`relative w-full max-w-sm mx-4 p-8 rounded-lg bg-[#0A0A12] border ${
            pwError ? 'border-red-500' : 'border-[#00FFFF]/30'
          } ${pwShake ? 'animate-shake' : ''}`}
          style={{
            boxShadow: pwError ? '0 0 30px rgba(255,0,0,0.3)' : '0 0 30px rgba(0,255,255,0.15)',
          }}
        >
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#00FFFF]" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#00FFFF]" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#00FFFF]" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#00FFFF]" />

          <h2
            className="text-center text-2xl tracking-[0.3em] mb-2 text-[#00FFFF]"
            style={{ fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 10px #00FFFF' }}
          >
            UNIFIED CTRL
          </h2>
          <p className="text-center text-white/40 text-sm mb-6 tracking-wider">
            ADMIN ACCESS REQUIRED
          </p>

          <input
            type="password"
            value={pwInput}
            onChange={e => setPwInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className={`w-full bg-[#0D0D1F] border ${
              pwError
                ? 'border-red-500'
                : 'border-[#00FFFF]/30 focus:border-[#00FFFF]'
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
            className="cyber-btn mt-6 w-full py-4 rounded text-[#050508] font-bold text-lg tracking-[0.2em] bg-[#00FFFF] hover:bg-white transition-colors"
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
        <div
          className="text-[#00FFFF] text-2xl tracking-[0.3em] animate-pulse"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          LOADING...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050508] cyber-grid scanlines">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-2xl sm:text-3xl tracking-[0.3em] uppercase"
            style={{
              fontFamily: 'Orbitron, sans-serif',
              color: '#00FFFF',
              textShadow: '0 0 10px #00FFFF, 0 0 30px #00FFFF',
            }}
          >
            UNIFIED CONTROLLER
          </h1>
          <p
            className="text-white/30 text-sm tracking-[0.4em] uppercase mt-2"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            ALL GROUPS — SIMULTANEOUS CONTROL
          </p>
          <div
            className="w-48 h-[1px] mx-auto mt-4 opacity-30"
            style={{ background: 'linear-gradient(90deg, transparent, #00FFFF, transparent)' }}
          />
        </div>

        {/* Grid of calculators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {teams.map(team => (
            <TeamCalculatorCard key={team.team_id} team={team} onAdjust={adjustPoints} />
          ))}
        </div>
      </div>
    </div>
  )
}
