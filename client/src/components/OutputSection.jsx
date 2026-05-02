import { useState } from 'react';
import PlayButton from './PlayButton';

function Card({ label, children, audioText }) {
  return (
    <div className="rounded-2xl bg-[#1a1a24] border border-[#2e2e3e] p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">{label}</span>
        {audioText && <PlayButton text={audioText} />}
      </div>
      {children}
    </div>
  );
}

function JourneyStep({ emoji, title, text }) {
  return (
    <div className="flex gap-3">
      <span className="text-2xl">{emoji}</span>
      <div>
        <p className="text-sm font-semibold text-slate-300 mb-1">{title}</p>
        <p className="text-slate-400 text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function ArticleDialogue({ dialogue }) {
  return (
    <div className="flex flex-col gap-3 mt-1">
      {dialogue.map((line, i) => (
        <div key={i} className={`flex ${line.speaker === 'Host B' ? 'justify-end' : ''}`}>
          <div className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed
            ${line.speaker === 'Host A'
              ? 'bg-[#252535] text-slate-300 rounded-tl-none'
              : 'bg-violet-900/50 text-violet-100 rounded-tr-none'}`}>
            <span className="block text-xs font-semibold mb-1 opacity-60">{line.speaker}</span>
            {line.line}
          </div>
        </div>
      ))}
    </div>
  );
}

function ScreenplayDialogue({ dialogue }) {
  return (
    <div className="flex flex-col gap-5 mt-1 font-mono">
      {dialogue.map((line, i) => (
        <div key={i}>
          <p className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-1">{line.speaker}:</p>
          <p className="text-slate-300 text-sm leading-relaxed pl-4 border-l-2 border-[#2e2e3e]">{line.line}</p>
        </div>
      ))}
    </div>
  );
}

function ModeToggle({ mode, onChange }) {
  return (
    <div className="flex items-center bg-[#1a1a24] border border-[#2e2e3e] rounded-xl p-1 gap-1 self-end">
      {['Article', 'Screenplay'].map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors
            ${mode === m
              ? 'bg-violet-600 text-white'
              : 'text-slate-400 hover:text-slate-200'}`}
        >
          {m}
        </button>
      ))}
    </div>
  );
}

export default function OutputSection({ data }) {
  const [mode, setMode] = useState('Article');

  if (!data) return null;

  return (
    <div
      className="w-full flex flex-col gap-4 mt-6"
      style={{ animation: 'fadeIn 0.5s ease-in-out' }}
    >
      <ModeToggle mode={mode} onChange={setMode} />

      {/* Hero's Journey */}
      <Card
        label="Hero's Journey"
        audioText={`Confusion: ${data.confusion}\n\nStruggle: ${data.struggle}\n\nBreakthrough: ${data.breakthrough}`}
      >
        <div className="flex flex-col gap-4 mt-1">
          <JourneyStep emoji="🌀" title="Confusion" text={data.confusion} />
          <JourneyStep emoji="⚔️" title="Struggle" text={data.struggle} />
          <JourneyStep emoji="💡" title="Breakthrough" text={data.breakthrough} />
        </div>
      </Card>

      {/* Story */}
      <Card label="Educational Story" audioText={data.story}>
        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{data.story}</p>
      </Card>

      {/* Podcast Dialogue */}
      <Card
        label="Podcast Dialogue"
        audioText={data.dialogue.map(l => `${l.speaker}: ${l.line}`).join('\n\n')}
      >
        {mode === 'Article'
          ? <ArticleDialogue dialogue={data.dialogue} />
          : <ScreenplayDialogue dialogue={data.dialogue} />}
      </Card>
    </div>
  );
}
