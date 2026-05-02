export default function Spinner() {
  return (
    <div className="flex flex-col items-center gap-3 py-12">
      <div className="w-10 h-10 rounded-full border-4 border-violet-800 border-t-violet-400 animate-spin" />
      <p className="text-slate-400 text-sm">Crafting your story...</p>
    </div>
  );
}
