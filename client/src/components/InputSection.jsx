export default function InputSection({ value, onChange, onSubmit, loading }) {
  const MAX = 1000;
  const count = value.length;

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="relative group">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX))}
          placeholder="Paste any topic, concept, or text you want to learn through a story..."
          rows={6}
          className="w-full rounded-2xl bg-[#1a1a24] border border-[#2e2e3e] text-slate-200 placeholder-slate-600 p-4 pb-8 text-base resize-none focus:outline-none focus:border-violet-500/80 transition-colors"
          style={{ boxShadow: 'none' }}
          onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)'}
          onBlur={e => e.currentTarget.style.boxShadow = 'none'}
        />
        <span className={`absolute bottom-3 right-4 text-xs tabular-nums transition-colors ${count > MAX * 0.9 ? 'text-violet-400' : 'text-slate-600'}`}>
          {count}/{MAX}
        </span>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading || !value.trim()}
        className="w-full py-3 rounded-2xl text-white font-semibold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
          boxShadow: value.trim() && !loading ? '0 4px 20px rgba(124,58,237,0.35)' : 'none',
        }}
        onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.filter = 'brightness(1.15)'; }}
        onMouseLeave={e => { e.currentTarget.style.filter = ''; }}
      >
        {loading ? 'Generating...' : 'Generate Story'}
      </button>
    </div>
  );
}
