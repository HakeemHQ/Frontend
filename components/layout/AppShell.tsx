import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="min-h-screen md:pl-[240px]">
        <Navbar />
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
