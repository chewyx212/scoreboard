import { useAllTeams } from '../hooks/useAllTeams';
import { TeamCard } from '../components/TeamCard';

export function ScoreboardPage() {
  const { teams, loading, lastChanged } = useAllTeams();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div
          className="text-[#00FFFF] text-3xl tracking-[0.3em] neon-text-soft animate-pulse"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          INITIALIZING...
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#050508] scanlines cyber-grid">
      <div className="grid grid-cols-3 grid-rows-2 h-full w-full">
        {teams.map(team => (
          <TeamCard
            key={team.team_id}
            team={team}
            isHighlighted={lastChanged === team.team_id}
          />
        ))}
      </div>
    </div>
  );
}
