export function Input({ placeholder = "" }: { placeholder?: string }) {
  return (
    <input
      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-600"
      placeholder={placeholder}
    />
  );
}
