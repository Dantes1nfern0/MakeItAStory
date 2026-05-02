export default function InputSection({ value, onChange, onSubmit, loading }) {
  return (
    <div className="w-full flex flex-col gap-4">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste any topic, concept, or text you want to learn through a story..."
        rows={6}
        className="w-full rounded-2xl bg-[#1a1a24] border border-[#2e2e3e] text-slate-200 placeholder-slate-500 p-4 text-base resize-none focus:outline-none focus:border-violet-500 transition-colors"
      />
      <button
        onClick={onSubmit}
        disabled={loading || !value.trim()}
        className="w-full py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-base transition-colors"
      >
        {loading ? 'Generating...' : 'Generate Story'}
      </button>
    </div>
  );
}
