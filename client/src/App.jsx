import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';

export default function App() {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  // Starfield animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let animId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function initStars() {
      stars = [];
      const count = Math.floor((canvas.width * canvas.height) / 6000);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.1 + 0.2,
          a: Math.random(),
          da: (Math.random() - 0.5) * 0.004,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.a += s.da;
        if (s.a <= 0 || s.a >= 1) s.da *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,239,227,${s.a * 0.6})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    }

    function handleResize() { resize(); initStars(); }
    window.addEventListener('resize', handleResize);
    resize(); initStars(); draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  async function handleTryExample() {
    const example = 'Explain how machine learning works';
    setText(example);
    setFile(null);
    await handleGenerate(example, null);
  }

  async function handleGenerate(overrideText, overrideFile) {
    const activeFile = overrideFile !== undefined ? overrideFile : file;
    const activeText = overrideText !== undefined ? overrideText : text;

    setLoading(true);
    setError('');
    setOutput(null);

    try {
      let data;
      if (activeFile) {
        const form = new FormData();
        form.append('pdf', activeFile);
        ({ data } = await axios.post('http://localhost:5001/api/upload', form));
      } else {
        ({ data } = await axios.post('http://localhost:3000/generate', { text: activeText }));
      }
      setOutput(data);
    } catch (err) {
      setError(err.response?.data?.error || 'The ritual failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <canvas ref={canvasRef} className="stars-canvas" />

      <main className="narrify-main">

        {/* Wordmark */}
        <div className="wordmark">
          <h1 className="wordmark-title">Narrify</h1>
          <span className="wordmark-rune">Wisdom Made Legend</span>
          <div className="divider">
            <div className="divider-line" />
            <span className="divider-glyph">✦</span>
            <div className="divider-line right" />
          </div>
          <p className="tagline">Offer forth your scroll or speak the topic. The hosts shall illuminate its truths.</p>
        </div>

        {/* Input */}
        <InputSection
          value={text}
          onChange={setText}
          file={file}
          onFileChange={setFile}
          onSubmit={handleGenerate}
          onTryExample={handleTryExample}
          loading={loading}
        />

        {/* Error */}
        {error && (
          <div className="error-msg visible" style={{ maxWidth: 560, width: '100%', marginTop: '1rem' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="8" cy="8" r="7" stroke="#e8886a" strokeWidth="1.2" />
              <line x1="8" y1="5" x2="8" y2="9" stroke="#e8886a" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8" cy="11.5" r="0.8" fill="#e8886a" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Output */}
        {!loading && output && <OutputSection data={output} />}

        {/* Footer */}
        <div className="lore">
          <div className="wizards">
            <div>
              <div className="wizard-name">Host A</div>
              <div className="wizard-role">Questions the unknown</div>
            </div>
            <div>
              <div className="wizard-name">Host B</div>
              <div className="wizard-role">Keeper of all truths</div>
            </div>
          </div>
          <p className="lore-note">Your scroll is read in-memory. No text leaves this realm without your blessing.</p>
        </div>

      </main>
    </>
  );
}
