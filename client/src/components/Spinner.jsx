export default function Spinner() {
  return (
    <div className="flex flex-col items-center gap-5 py-14">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-violet-400 dot-1" />
        <span className="w-2.5 h-2.5 rounded-full bg-violet-500 dot-2" />
        <span className="w-2.5 h-2.5 rounded-full bg-violet-600 dot-3" />
      </div>
      <p className="text-slate-500 text-sm tracking-wide">Crafting your story...</p>
    </div>
  );
}
