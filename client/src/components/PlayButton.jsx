import { useState, useRef } from 'react';
import axios from 'axios';

export default function PlayButton({ text }) {
  const [state, setState] = useState('idle'); // idle | loading | playing | error
  const audioRef = useRef(null);

  async function handlePlay() {
    if (state === 'playing') {
      audioRef.current?.pause();
      setState('idle');
      return;
    }

    setState('loading');
    try {
      const response = await axios.post(
        'http://localhost:3000/audio',
        { text },
        { responseType: 'blob' }
      );
      const url = URL.createObjectURL(response.data);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setState('playing');
        audioRef.current.onended = () => setState('idle');
      }
    } catch {
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    }
  }

  const label = { idle: '▶ Play Audio', loading: 'Loading...', playing: '⏸ Pause', error: 'Error — retry?' }[state];

  return (
    <>
      <audio ref={audioRef} hidden />
      <button
        onClick={handlePlay}
        disabled={state === 'loading'}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors
          ${state === 'error'
            ? 'bg-red-900/40 text-red-400 border border-red-800'
            : state === 'playing'
            ? 'bg-violet-700 text-white'
            : 'bg-[#1a1a24] border border-[#2e2e3e] text-slate-300 hover:border-violet-500 hover:text-violet-300'}
          disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {state === 'loading' && (
          <span className="w-3 h-3 border-2 border-slate-500 border-t-violet-400 rounded-full animate-spin" />
        )}
        {label}
      </button>
    </>
  );
}
