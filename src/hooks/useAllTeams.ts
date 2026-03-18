import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import type { Team } from '../types/team';

export function useAllTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastChanged, setLastChanged] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('teams')
      .select('*')
      .order('team_id')
      .then(({ data }) => {
        if (data) setTeams(data);
        setLoading(false);
      });

    const channel = supabase
      .channel('teams-realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'teams' },
        (payload) => {
          const updated = payload.new as Team;
          setTeams(prev =>
            prev.map(t => t.team_id === updated.team_id ? updated : t)
          );
          setLastChanged(updated.team_id);
          setTimeout(() => setLastChanged(null), 2000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { teams, loading, lastChanged };
}
