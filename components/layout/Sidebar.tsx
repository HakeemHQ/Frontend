const navItems = [
  { label: "Home", href: "/home", icon: "Home" },
  { label: "Timeline", href: "/timeline", icon: "Clock" },
  { label: "Medical CV", href: "/medical-cv", icon: "FileText" },
  { label: "Upload", href: "/upload", icon: "Upload" },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-[240px] border-r border-slate-200 bg-white md:block">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sm font-black text-sky-900">
            H
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Hakeem
          </span>
        </div>

        <nav className="mt-8 flex-1 px-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-sky-900"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>

          <div className="my-6 border-t border-slate-200" />

          <a
            href="/settings"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-sky-900"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
              Settings
            </span>
            <span>Settings</span>
          </a>
        </nav>

        <div className="border-t border-slate-200 px-4 py-5">
          <button className="flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
            Collapse
          </button>
        </div>
      </div>
    </aside>
  );
}
