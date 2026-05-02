import { useState, useRef } from 'react';

const MAX_BYTES = 20 * 1024 * 1024;

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function InputSection({ value, onChange, file, onFileChange, onSubmit, onTryExample, loading }) {
  const [tab, setTab] = useState('upload');
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);

  function handleFile(f) {
    setFileError('');
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      setFileError('Only PDF scrolls are accepted.');
      return;
    }
    if (f.size > MAX_BYTES) {
      setFileError(`File too large (${formatBytes(f.size)}). Limit is 20 MB.`);
      return;
    }
    onFileChange(f);
    onChange('');
  }

  function clearFile() {
    onFileChange(null);
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function switchTab(t) {
    setTab(t);
    setFileError('');
    if (t === 'text') onFileChange(null);
    if (t === 'upload') onChange('');
  }

  const canSubmit = !loading && (file !== null || value.trim() !== '');

  return (
    <div className="upload-card">

      {/* Tab switcher */}
      <div className="tab-switcher">
        <button className={`tab-btn${tab === 'upload' ? ' active' : ''}`} onClick={() => switchTab('upload')}>
          Upload Scroll
        </button>
        <button className={`tab-btn${tab === 'text' ? ' active' : ''}`} onClick={() => switchTab('text')}>
          Speak the Topic
        </button>
      </div>

      {tab === 'upload' ? (
        <>
          {/* Drop zone */}
          <div
            className={`drop-zone${dragOver ? ' drag-over' : ''}`}
            tabIndex={0}
            role="button"
            aria-label="Upload a PDF file"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef.current?.click(); } }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDragOver(false); }}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          >
            <span className="corner tr" />
            <span className="corner bl" />

            <svg className="drop-icon" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="6" width="32" height="40" rx="3" stroke="#c8922a" strokeWidth="1.5" fill="none" opacity="0.6" />
              <path d="M10 9 Q6 9 6 13 Q6 17 10 17" stroke="#c8922a" strokeWidth="1.5" fill="none" opacity="0.4" />
              <path d="M42 9 Q46 9 46 13 Q46 17 42 17" stroke="#c8922a" strokeWidth="1.5" fill="none" opacity="0.4" />
              <line x1="17" y1="20" x2="35" y2="20" stroke="#e8b84b" strokeWidth="1" opacity="0.5" />
              <line x1="17" y1="26" x2="35" y2="26" stroke="#e8b84b" strokeWidth="1" opacity="0.4" />
              <line x1="17" y1="32" x2="28" y2="32" stroke="#e8b84b" strokeWidth="1" opacity="0.3" />
              <path d="M26 38 L26 44 M23 41 L26 44 L29 41" stroke="#c8922a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
            </svg>

            <p className="drop-primary">Lay your scroll upon the altar</p>
            <p className="drop-secondary">
              Drop a PDF here, or{' '}
              <span onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>browse your tome</span>
            </p>
            <p className="drop-limit">PDF only · max 20 MB</p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              style={{ display: 'none' }}
              onChange={(e) => { if (e.target.files[0]) handleFile(e.target.files[0]); }}
            />
          </div>

          {/* File error */}
          {fileError && (
            <div className="error-msg visible">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="8" cy="8" r="7" stroke="#e8886a" strokeWidth="1.2" />
                <line x1="8" y1="5" x2="8" y2="9" stroke="#e8886a" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="8" cy="11.5" r="0.8" fill="#e8886a" />
              </svg>
              <span>{fileError}</span>
            </div>
          )}

          {/* File preview */}
          {file && (
            <div className="file-preview visible">
              <div className="file-icon-wrap">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="3" y="1" width="12" height="16" rx="2" stroke="#c8922a" strokeWidth="1.2" fill="none" />
                  <line x1="6" y1="6" x2="12" y2="6" stroke="#e8b84b" strokeWidth="1" opacity="0.7" />
                  <line x1="6" y1="9" x2="12" y2="9" stroke="#e8b84b" strokeWidth="1" opacity="0.5" />
                  <line x1="6" y1="12" x2="9" y2="12" stroke="#e8b84b" strokeWidth="1" opacity="0.4" />
                </svg>
              </div>
              <div className="file-info">
                <div className="file-name">{file.name}</div>
                <div className="file-meta">{formatBytes(file.size)} · PDF</div>
              </div>
              <button className="file-remove" onClick={clearFile} aria-label="Remove file">✕</button>
            </div>
          )}
        </>
      ) : (
        <>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste any topic, concept, or text you want to learn through a story..."
            rows={6}
            className="topic-textarea"
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button
              onClick={onTryExample}
              disabled={loading}
              className="try-example-btn"
            >
              ✦ Try Example
            </button>
          </div>
        </>
      )}

      {/* Loading / Summon button */}
      {loading ? (
        <div className="loading-overlay visible">
          <div className="loading-ring" />
          <p className="loading-text">The hosts consult the ancient texts…</p>
        </div>
      ) : (
        <button
          className={`summon-btn${canSubmit ? ' active' : ''}`}
          disabled={!canSubmit}
          onClick={onSubmit}
        >
          {file ? 'Summon the Hosts' : 'Generate Story'}
        </button>
      )}

    </div>
  );
}
