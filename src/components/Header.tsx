import { useState } from "react";
import { Bell, Check, CloudUpload, Leaf, Pencil } from "lucide-react";
import { DEMO_USER } from "../data/demoData";

export default function Header({
  userName,
  setUserName,
  syncState,
}: {
  userName: string;
  setUserName: (n: string) => void;
  syncState: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(userName);
  const [showNotif, setShowNotif] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-[#7C9A82]/10 bg-[#FAF8F3]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C9A82] to-[#506656] text-white shadow-lg shadow-[#7C9A82]/30">
            <Leaf className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <div>
            <p className="font-display text-[19px] font-bold leading-none tracking-tight text-[#2b332d]">
              Vital<span className="text-[#7C9A82]">Bridge</span>
            </p>
            <p className="font-display mt-0.5 text-[11px] font-medium italic leading-none tracking-wide text-[#7C9A82]">
              a bridge to a better you
            </p>
            <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-stone-500">
              {syncState === "saving" ? (
                <>
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" /> Saving to server…
                </>
              ) : (
                <>
                  <CloudUpload className="h-3 w-3 text-[#7C9A82]" /> Saved to server database
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-3 shadow-sm ring-1 ring-[#7C9A82]/15 sm:flex">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#7C9A82] text-[11px] font-bold text-white">
              {userName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || DEMO_USER.avatarInitials}
            </div>
            {editing ? (
              <span className="flex items-center gap-1">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="w-28 rounded-lg border border-[#7C9A82]/30 bg-[#FAF8F3] px-2 py-0.5 text-[13px] font-semibold outline-none"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && draft.trim()) {
                      setUserName(draft.trim());
                      setEditing(false);
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (draft.trim()) setUserName(draft.trim());
                    setEditing(false);
                  }}
                  className="rounded-full bg-[#7C9A82] p-1 text-white"
                >
                  <Check className="h-3 w-3" />
                </button>
              </span>
            ) : (
              <button onClick={() => { setDraft(userName); setEditing(true); }} className="group flex items-center gap-1 text-[13px] font-semibold text-[#2b332d]">
                {userName}
                <Pencil className="h-3 w-3 text-stone-400 opacity-0 transition group-hover:opacity-100" />
              </button>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowNotif((v) => !v)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-[#7C9A82]/15 transition hover:scale-105 active:scale-95"
            >
              <Bell className="h-[18px] w-[18px] text-[#506656]" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-400 ring-2 ring-white" />
            </button>
            {showNotif && (
              <div className="page-enter absolute right-0 top-12 w-72 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5">
                <p className="text-[13px] font-bold">Today for you</p>
                <div className="mt-2 space-y-2 text-[13px] leading-snug text-stone-600">
                  <p className="rounded-xl bg-[#F2F6F2] p-2.5">🚶 10-min post-lunch walk keeps glucose steady</p>
                  <p className="rounded-xl bg-amber-50 p-2.5">🥣 Overnight oats prep tonight — 5 min!</p>
                  <p className="rounded-xl bg-[#F2F6F2] p-2.5">💧 2 more glasses to hit your water goal</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
