import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Team } from '@/types/team'

export function useTeam(teamId: string) {
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTeam() {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('team_id', teamId)
        .single()

      if (error) setError(error.message)
      else setTeam(data)
      setLoading(false)
    }

    fetchTeam()

    // Subscribe to all team updates, filter client-side
    // (column-level filters require REPLICA IDENTITY FULL — avoid it)
    const channel = supabase
      .channel(`team-${teamId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'teams' },
        (payload) => {
          const updated = payload.new as Team
          if (updated.team_id === teamId) setTeam(updated)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [teamId])

  const adjustPoints = useCallback(async (delta: number) => {
    if (!team) return
    const newPoints = team.points + delta
    const { data, error } = await supabase
      .from('teams')
      .update({ points: newPoints, updated_at: new Date().toISOString() })
      .eq('team_id', teamId)
      .select()
      .single()

    if (!error && data) setTeam(data)
  }, [team, teamId])

  return { team, loading, error, adjustPoints }
}
