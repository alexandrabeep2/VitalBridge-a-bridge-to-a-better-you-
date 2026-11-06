import { ReactNode } from "react";
import { cn } from "../utils/cn";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-3xl bg-white p-5 shadow-[0_2px_24px_rgba(90,110,90,0.08)] ring-1 ring-[#7C9A82]/10", className)}>
      {children}
    </div>
  );
}

export function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between">
      <div>
        {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7C9A82]">{eyebrow}</p>}
        <h2 className="font-display text-[22px] font-semibold leading-tight text-[#2b332d]">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function Pill({ children, tone = "sage" }: { children: ReactNode; tone?: "sage" | "amber" | "rose" | "stone" | "white" }) {
  const tones: Record<string, string> = {
    sage: "bg-[#E8EFE9] text-[#3d5a43]",
    amber: "bg-amber-100 text-amber-800",
    rose: "bg-rose-100 text-rose-700",
    stone: "bg-stone-100 text-stone-600",
    white: "bg-white/90 text-[#3d5a43] backdrop-blur",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold", tones[tone])}>
      {children}
    </span>
  );
}

export function ProgressBar({ value, max = 100, className, barClass }: { value: number; max?: number; className?: string; barClass?: string }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-[#E8EFE9]", className)}>
      <div
        className={cn("h-full rounded-full bg-gradient-to-r from-[#7C9A82] to-[#9DB8A2] transition-all duration-700", barClass)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function Ring({ size = 92, stroke = 9, progress, children }: { size?: number; stroke?: number; progress: number; children?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#E8EFE9" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#sageGrad)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * Math.min(100, progress)) / 100}
          className="transition-all duration-1000"
        />
        <defs>
          <linearGradient id="sageGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7C9A82" />
            <stop offset="100%" stopColor="#B9CDBD" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}

export function SimulatedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#7C9A82]/40 bg-[#F2F6F2] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#506656]">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7C9A82]" />
      Simulated AI • Demo
    </span>
  );
}

export function ExampleDataBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-stone-500">
      Example data
    </span>
  );
}
