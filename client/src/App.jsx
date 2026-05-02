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
    <div className="min-h-screen bg-[#0f0f13] flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-2xl flex flex-col items-center gap-8">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white tracking-tight">Narrify</h1>
          <p className="text-slate-400 mt-2 text-lg">Turn knowledge into stories</p>
          <button
            onClick={handleTryExample}
            disabled={loading}
            className="mt-4 px-4 py-1.5 rounded-lg border border-violet-700 text-violet-400 text-sm hover:bg-violet-900/30 transition-colors disabled:opacity-40"
          >
            ✨ Try Example
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
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {/* Spinner */}
        {loading && <Spinner />}

        {/* Output */}
        {!loading && output && <OutputSection data={output} />}

      </div>
    </div>
  );
}
