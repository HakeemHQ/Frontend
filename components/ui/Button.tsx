export function Button({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <button className={`rounded-xl bg-sky-900 px-4 py-2 text-sm font-bold text-white ${className}`}>{children}</button>
  );
}
