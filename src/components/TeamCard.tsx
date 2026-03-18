import type { Team } from '../types/team';

interface TeamCardProps {
  team: Team;
  isHighlighted: boolean;
}

export function TeamCard({ team, isHighlighted }: TeamCardProps) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center border h-[50vh] ${
        isHighlighted ? 'animate-pulse-glow' : ''
      }`}
      style={{
        '--team-color': team.color,
        borderColor: `${team.color}40`,
        backgroundColor: '#0A0A12',
      } as React.CSSProperties}
    >
      {/* Animated border overlay */}
      <div
        className="neon-border absolute inset-0 pointer-events-none"
        style={{ '--team-color': team.color } as React.CSSProperties}
      />

      {/* Corner accents */}
      <div
        className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2"
        style={{ borderColor: team.color }}
      />
      <div
        className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2"
        style={{ borderColor: team.color }}
      />
      <div
        className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2"
        style={{ borderColor: team.color }}
      />
      <div
        className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2"
        style={{ borderColor: team.color }}
      />

      {/* Decorative line */}
      <div
        className="absolute top-6 left-1/2 -translate-x-1/2 h-[1px] w-1/2 opacity-30"
        style={{ background: `linear-gradient(90deg, transparent, ${team.color}, transparent)` }}
      />

      {/* Team Name */}
      <span
        className="text-3xl lg:text-4xl xl:text-5xl tracking-[0.3em] uppercase mb-6 neon-text-soft"
        style={{ fontFamily: 'Orbitron, sans-serif', color: team.color }}
      >
        {team.name}
      </span>

      {/* Points */}
      <span
        className={`text-[clamp(5rem,12vw,10rem)] leading-none text-white font-bold ${
          isHighlighted ? 'animate-number-pop' : ''
        }`}
        style={{
          fontFamily: 'Share Tech Mono, monospace',
          textShadow: `0 0 20px ${team.color}, 0 0 40px ${team.color}, 0 0 80px ${team.color}`,
        }}
      >
        {team.points.toLocaleString()}
      </span>

      {/* Label */}
      <span
        className="mt-4 text-sm lg:text-base tracking-[0.5em] uppercase opacity-40"
        style={{ fontFamily: 'Rajdhani, sans-serif' }}
      >
        POINTS
      </span>

      {/* Bottom decorative line */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 h-[1px] w-1/2 opacity-30"
        style={{ background: `linear-gradient(90deg, transparent, ${team.color}, transparent)` }}
      />
    </div>
  );
}
