import { useState } from 'react';
import PlayButton from './PlayButton';

const CARD_ACCENTS = {
  journey:  'border-t-violet-500',
  story:    'border-t-indigo-500',
  podcast:  'border-t-fuchsia-500',
};

function Card({ label, children, audioText, accent = 'border-t-violet-500', className = '' }) {
  return (
    <div className={`rounded-2xl bg-[#1a1a24] border border-[#2e2e3e] border-t-2 ${accent} p-5 flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</span>
        {audioText && <PlayButton text={audioText} />}
      </div>
      {children}
    </div>
  );
}

function JourneyStep({ emoji, title, text, color }) {
  return (
    <div className="flex gap-3 items-start">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${color}`}>
        {emoji}
      </div>
      <div className="pt-0.5">
        <p className="text-sm font-semibold text-slate-200 mb-1">{title}</p>
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
              : 'bg-violet-900/40 text-violet-100 rounded-tr-none border border-violet-800/30'}`}>
            <span className="block text-xs font-semibold mb-1 opacity-50">{line.speaker}</span>
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
          <p className="text-fuchsia-400 text-xs font-bold uppercase tracking-widest mb-1">{line.speaker}:</p>
          <p className="text-slate-300 text-sm leading-relaxed pl-4 border-l-2 border-[#2e2e3e]">{line.line}</p>
        </div>
      ))}
    </div>
  );
}

function ModeToggle({ mode, onChange }) {
  return (
    <div className="flex items-center bg-[#14141c] border border-[#2e2e3e] rounded-xl p-1 gap-1 self-end">
      {['Article', 'Screenplay'].map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all
            ${mode === m
              ? 'text-white'
              : 'text-slate-500 hover:text-slate-300'}`}
          style={mode === m ? { background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' } : {}}
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
    <div className="w-full flex flex-col gap-4 mt-4">
      <ModeToggle mode={mode} onChange={setMode} />

      {/* Hero's Journey */}
      <Card
        label="Hero's Journey"
        accent={CARD_ACCENTS.journey}
        audioText={data.breakthrough.slice(0, 300)}
        className="card-stagger-1"
      >
        <div className="flex flex-col gap-4 mt-1">
          <JourneyStep emoji="🌀" title="Confusion"    text={data.confusion}    color="bg-violet-900/40" />
          <JourneyStep emoji="⚔️" title="Struggle"     text={data.struggle}     color="bg-indigo-900/40" />
          <JourneyStep emoji="💡" title="Breakthrough" text={data.breakthrough} color="bg-fuchsia-900/40" />
        </div>
      </Card>

      {/* Story */}
      <Card label="Educational Story" accent={CARD_ACCENTS.story} audioText={data.story.slice(0, 400)} className="card-stagger-2">
        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{data.story}</p>
      </Card>

      {/* Podcast Dialogue */}
      <Card
        label="Podcast Dialogue"
        accent={CARD_ACCENTS.podcast}
        audioText={data.dialogue.slice(0, 3).map(l => `${l.speaker}: ${l.line}`).join('\n\n').slice(0, 400)}
        className="card-stagger-3"
      >
        {mode === 'Article'
          ? <ArticleDialogue dialogue={data.dialogue} />
          : <ScreenplayDialogue dialogue={data.dialogue} />}
      </Card>
    </div>
  );
}
