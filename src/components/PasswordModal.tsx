import { useState } from 'react';
import { checkPassword } from '../config/passwords';

interface PasswordModalProps {
  teamId: string;
  onSuccess: () => void;
}

export function PasswordModal({ teamId, onSuccess }: PasswordModalProps) {
  const [input, setInput] = useState('');
  const [shake, setShake] = useState(false);
  const [error, setError] = useState(false);

  function handleSubmit() {
    if (checkPassword(teamId, input)) {
      sessionStorage.setItem(`auth_${teamId}`, 'true');
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setError(false);
      }, 600);
      setInput('');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050508]/95 backdrop-blur-md">
      {/* Background grid effect */}
      <div className="absolute inset-0 cyber-grid opacity-30" />

      <div
        className={`relative w-full max-w-sm mx-4 p-8 rounded-lg bg-[#0A0A12] border ${
          error ? 'border-red-500' : 'border-[#00FFFF]/30'
        } ${shake ? 'animate-shake' : ''}`}
        style={{
          boxShadow: error
            ? '0 0 30px rgba(255, 0, 0, 0.3)'
            : '0 0 30px rgba(0, 255, 255, 0.1)',
        }}
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#00FFFF]" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#00FFFF]" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#00FFFF]" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#00FFFF]" />

        {/* Lock icon */}
        <div className="flex justify-center mb-4">
          <svg
            className="w-12 h-12 text-[#00FFFF] neon-text-soft"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>

        <h2
          className="text-center text-2xl tracking-[0.3em] mb-2 text-[#00FFFF] neon-text-soft"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          ACCESS
        </h2>
        <p className="text-center text-white/40 text-sm mb-6 tracking-wider">
          ENTER AUTHORIZATION CODE
        </p>

        <input
          type="password"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          className={`w-full bg-[#0D0D1F] border ${
            error ? 'border-red-500' : 'border-[#00FFFF]/30 focus:border-[#00FFFF]'
          } text-white text-center text-xl tracking-[0.5em] p-4 rounded outline-none transition-colors`}
          style={{ fontFamily: 'Share Tech Mono, monospace' }}
          placeholder="• • • • •"
          autoFocus
        />

        {error && (
          <p className="text-red-500 text-center text-sm mt-2 tracking-wider">
            ACCESS DENIED
          </p>
        )}

        <button
          onClick={handleSubmit}
          className="cyber-btn mt-6 w-full py-4 rounded text-[#050508] font-bold text-lg tracking-[0.2em] bg-[#00FFFF] hover:bg-white transition-colors"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          AUTHENTICATE
        </button>
      </div>
    </div>
  );
}
