import { Home, UtensilsCrossed, ScanLine, MessagesSquare, ChartLine, Wallet, Gift } from "lucide-react";
import { cn } from "../utils/cn";

export type PageKey = "dashboard" | "meals" | "scan" | "buddy" | "progress" | "budget" | "rewards";

const ITEMS: { key: PageKey; label: string; icon: any }[] = [
  { key: "dashboard", label: "Home", icon: Home },
  { key: "budget", label: "Budget", icon: Wallet },
  { key: "meals", label: "Meals", icon: UtensilsCrossed },
  { key: "scan", label: "Scan", icon: ScanLine },
  { key: "progress", label: "Progress", icon: ChartLine },
  { key: "buddy", label: "Buddy", icon: MessagesSquare },
  { key: "rewards", label: "Rewards", icon: Gift },
];

export default function BottomNav({
  active,
  onChange,
  buddyUnread,
  rewardsGlow,
}: {
  active: PageKey;
  onChange: (p: PageKey) => void;
  buddyUnread: boolean;
  rewardsGlow?: boolean;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 px-2 pb-3 pt-2 sm:px-6 sm:pb-5">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-stretch justify-between gap-0.5 rounded-[26px] border border-white/40 bg-white/90 p-1.5 shadow-[0_8px_40px_rgba(60,80,60,0.18)] backdrop-blur-2xl sm:gap-1 sm:p-2">
          {ITEMS.map((it) => {
            const Icon = it.icon;
            const isActive = active === it.key;
            const isScan = it.key === "scan";
            if (isScan) {
              return (
                <button
                  key={it.key}
                  onClick={() => onChange(it.key)}
                  className="group flex min-w-0 flex-1 flex-col items-center gap-0.5"
                >
                  <span
                    className={cn(
                      "-mt-7 flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg transition-all duration-300 active:scale-95",
                      isActive
                        ? "bg-gradient-to-br from-[#7C9A82] to-[#425345] text-white shadow-[#7C9A82]/40 rotate-0"
                        : "bg-gradient-to-br from-[#7C9A82] to-[#5a7a60] text-white shadow-[#7C9A82]/30 group-hover:scale-105 group-hover:-rotate-3"
                    )}
                  >
                    <Icon className="h-6 w-6" strokeWidth={2.2} />
                  </span>
                  <span className={cn("text-[9px] font-bold tracking-wide sm:text-[10px]", isActive ? "text-[#425345]" : "text-stone-400")}>
                    {it.label}
                  </span>
                </button>
              );
            }
            const glow = it.key === "rewards" && rewardsGlow && !isActive;
            return (
              <button
                key={it.key}
                onClick={() => onChange(it.key)}
                className={cn(
                  "relative flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-0.5 py-2 transition-all duration-300 active:scale-95",
                  isActive
                    ? "bg-[#E8EFE9] text-[#2f4534]"
                    : glow
                      ? "bg-amber-50 text-amber-600 ring-1 ring-amber-300 animate-pulse"
                      : "text-stone-400 hover:bg-stone-50 hover:text-stone-600"
                )}
              >
                <Icon className={cn("h-[18px] w-[18px] transition-transform sm:h-5 sm:w-5", isActive && "scale-110")} strokeWidth={isActive ? 2.4 : 2} />
                <span className="text-[9px] font-bold tracking-wide sm:text-[10px]">{it.label}</span>
                {it.key === "buddy" && buddyUnread && (
                  <span className="absolute right-1/2 top-1 mr-[-18px] flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white">
                    1
                  </span>
                )}
                {it.key === "rewards" && rewardsGlow && !isActive && (
                  <span className="absolute right-1/2 top-0.5 mr-[-20px] flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] text-white ring-2 ring-white">
                    ★
                  </span>
                )}
                {isActive && <span className="h-1 w-5 rounded-full bg-[#7C9A82] sm:w-6" />}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
