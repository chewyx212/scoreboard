'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useTeam } from '@/hooks/useTeam'
import { PasswordModal } from '@/components/PasswordModal'

export default function CalculatorPage() {
  const { teamId } = useParams<{ teamId: string }>()
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    setIsAuthed(sessionStorage.getItem(`auth_${teamId}`) === 'true')
  }, [teamId])
  const { team, loading, adjustPoints } = useTeam(teamId!)
  const [customValue, setCustomValue] = useState('')
  const [animating, setAnimating] = useState(false)

  async function handleAdjust(delta: number) {
    if (delta === 0) return
    setAnimating(true)
    await adjustPoints(delta)
    setTimeout(() => setAnimating(false), 300)
  }

  if (!isAuthed) {
    return <PasswordModal teamId={teamId!} onSuccess={() => setIsAuthed(true)} />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div
          className="text-[#00FFFF] text-2xl tracking-[0.3em] neon-text-soft animate-pulse"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          LOADING...
        </div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="text-red-500 text-xl" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          TEAM NOT FOUND
        </div>
      </div>
    )
  }

  const presets = [10, 50, 100]

  return (
    <div className="min-h-screen bg-[#050508] cyber-grid scanlines flex items-center justify-center">
      <div className="flex flex-col items-center px-4 py-8 w-full max-w-md mx-auto">
        {/* Team Name */}
        <h1
          className="text-2xl sm:text-3xl tracking-[0.3em] uppercase neon-text-soft mt-4"
          style={{ fontFamily: 'Orbitron, sans-serif', color: team.color }}
        >
          {team.name}
        </h1>

        {/* Decorative line */}
        <div
          className="w-48 h-[1px] my-4 opacity-50"
          style={{ background: `linear-gradient(90deg, transparent, ${team.color}, transparent)` }}
        />

        {/* Current Points */}
        <div className="my-8 text-center">
          <p className="text-white/40 text-sm tracking-[0.5em] uppercase mb-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            CURRENT POINTS
          </p>
          <div
            className={`text-7xl sm:text-8xl font-bold ${animating ? 'animate-number-pop' : ''}`}
            style={{
              fontFamily: 'Share Tech Mono, monospace',
              color: '#ffffff',
              textShadow: `0 0 20px ${team.color}, 0 0 40px ${team.color}`,
            }}
          >
            {team.points.toLocaleString()}
          </div>
        </div>

        {/* Add Buttons */}
        <p
          className="text-xs tracking-[0.4em] uppercase mb-3 opacity-40"
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
        >
          ADD POINTS
        </p>
        <div className="grid grid-cols-3 gap-3 w-full">
          {presets.map(v => (
            <button
              key={`add-${v}`}
              onClick={() => handleAdjust(v)}
              className="cyber-btn h-16 rounded-lg border text-lg font-bold"
              style={{
                fontFamily: 'Share Tech Mono, monospace',
                borderColor: '#00FF4140',
                color: '#00FF41',
                backgroundColor: '#00FF4110',
                boxShadow: '0 0 10px rgba(0, 255, 65, 0.1)',
              }}
            >
              +{v}
            </button>
          ))}
        </div>

        {/* Deduct Buttons */}
        <p
          className="text-xs tracking-[0.4em] uppercase mb-3 mt-6 opacity-40"
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
        >
          DEDUCT POINTS
        </p>
        <div className="grid grid-cols-3 gap-3 w-full">
          {presets.map(v => (
            <button
              key={`sub-${v}`}
              onClick={() => handleAdjust(-v)}
              className="cyber-btn h-16 rounded-lg border text-lg font-bold"
              style={{
                fontFamily: 'Share Tech Mono, monospace',
                borderColor: '#FF00FF40',
                color: '#FF00FF',
                backgroundColor: '#FF00FF10',
                boxShadow: '0 0 10px rgba(255, 0, 255, 0.1)',
              }}
            >
              -{v}
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <p
          className="text-xs tracking-[0.4em] uppercase mb-3 mt-6 opacity-40"
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
        >
          CUSTOM AMOUNT
        </p>
        <div className="flex gap-3 w-full items-stretch">
          <input
            type="number"
            value={customValue}
            onChange={e => setCustomValue(e.target.value)}
            className="flex-1 min-w-0 bg-[#0D0D1F] border border-white/20 text-white text-center text-xl p-4 rounded-lg outline-none focus:border-[#00FFFF]/50 transition-colors"
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
            className="cyber-btn rounded-lg border font-bold text-2xl flex-shrink-0"
            style={{
              fontFamily: 'Share Tech Mono, monospace',
              borderColor: '#00FFFF40',
              color: '#00FFFF',
              backgroundColor: '#00FFFF10',
              width: '64px',
              height: '64px',
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
            className="cyber-btn rounded-lg border font-bold text-2xl flex-shrink-0"
            style={{
              fontFamily: 'Share Tech Mono, monospace',
              borderColor: '#FF00FF40',
              color: '#FF00FF',
              backgroundColor: '#FF00FF10',
              width: '64px',
              height: '64px',
            }}
          >
            -
          </button>
        </div>

        {/* Bottom spacer for mobile */}
        <div className="h-8" />
      </div>
    </div>
  )
}
