import { useState } from 'react';
import PlayButton from './PlayButton';

function JourneyCard({ data }) {
  const steps = [
    { emoji: '🌀', title: 'Confusion', text: data.confusion },
    { emoji: '⚔️', title: 'Struggle',  text: data.struggle },
    { emoji: '💡', title: 'Breakthrough', text: data.breakthrough },
  ];

  const audioText = `Confusion: ${data.confusion}\n\nStruggle: ${data.struggle}\n\nBreakthrough: ${data.breakthrough}`;

  return (
    <div className="output-card">
      <div className="card-label">
        <span>Hero&apos;s Journey</span>
        <PlayButton text={audioText} />
      </div>
      {steps.map(({ emoji, title, text }) => (
        <div className="journey-step" key={title}>
          <span className="journey-emoji">{emoji}</span>
          <div>
            <p className="journey-title">{title}</p>
            <p className="journey-text">{text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function StoryCard({ story }) {
  return (
    <div className="output-card">
      <div className="card-label">
        <span>Educational Story</span>
        <PlayButton text={story} />
      </div>
      <p className="card-body" style={{ whiteSpace: 'pre-line' }}>{story}</p>
    </div>
  );
}

function DialogueCard({ dialogue }) {
  const [mode, setMode] = useState('Article');
  const audioText = dialogue.map(l => `${l.speaker}: ${l.line}`).join('\n\n');

  return (
    <div className="output-card">
      <div className="card-label">
        <span>Podcast Dialogue</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <PlayButton text={audioText} />
          <div className="mode-toggle">
            {['Article', 'Screenplay'].map((m) => (
              <button
                key={m}
                className={`mode-btn${mode === m ? ' active' : ''}`}
                onClick={() => setMode(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {mode === 'Article' ? (
        <div className="dialogue-list">
          {dialogue.map((line, i) => (
            <div key={i} className={line.speaker === 'Host B' ? 'dialogue-line-b' : 'dialogue-line-a'}>
              <div className="dialogue-speaker">{line.speaker}</div>
              <div className="dialogue-bubble">{line.line}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ marginTop: '0.5rem' }}>
          {dialogue.map((line, i) => (
            <div key={i} className="screenplay-line">
              <p className="screenplay-speaker">{line.speaker}:</p>
              <p className="screenplay-text">{line.line}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OutputSection({ data }) {
  if (!data) return null;

  return (
    <div className="output-section">
      <JourneyCard data={data} />
      <StoryCard story={data.story} />
      <DialogueCard dialogue={data.dialogue} />
    </div>
  );
}
