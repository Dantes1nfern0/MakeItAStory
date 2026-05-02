import { useState } from 'react';
import axios from 'axios';
import InputSection from './components/InputSection';
import Spinner from './components/Spinner';
import OutputSection from './components/OutputSection';

export default function App() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState('');

  async function handleTryExample() {
    const example = 'Explain how machine learning works';
    setText(example);
    await handleGenerate(example);
  }

  async function handleGenerate(overrideText) {
    setLoading(true);
    setError('');
    setOutput(null);
    try {
      const { data } = await axios.post('http://localhost:3000/generate', { text: overrideText ?? text });
      setOutput(data);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f13] flex flex-col items-center px-4 py-16">
      {/* Ambient glow behind header */}
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(ellipse at center, #7c3aed 0%, transparent 70%)' }}
      />

      <div className="w-full max-w-2xl flex flex-col items-center gap-8 relative">

        {/* Header */}
        <div className="text-center flex flex-col items-center gap-3 animate-fade-in">
          {/* Logo mark */}
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-1"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>

          <h1
            className="text-5xl font-bold tracking-tight"
            style={{ background: 'linear-gradient(135deg, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Narrify
          </h1>
          <p className="text-slate-400 text-lg">Turn any topic into a story worth remembering</p>

          <button
            onClick={handleTryExample}
            disabled={loading}
            className="mt-1 px-5 py-1.5 rounded-full border border-violet-700/60 text-violet-400 text-sm hover:bg-violet-900/30 hover:border-violet-500 transition-all disabled:opacity-40"
          >
            ✨ Try an example
          </button>
        </div>

        {/* Input */}
        <InputSection
          value={text}
          onChange={setText}
          onSubmit={handleGenerate}
          loading={loading}
        />

        {/* Error */}
        {error && (
          <div className="w-full px-4 py-3 rounded-xl bg-red-950/40 border border-red-800/50 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Spinner */}
        {loading && <Spinner />}

        {/* Output */}
        {!loading && output && <OutputSection data={output} />}

      </div>
    </div>
  );
}
