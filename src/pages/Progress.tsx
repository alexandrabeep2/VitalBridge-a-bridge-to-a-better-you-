import { useMemo, useState } from "react";
import { Droplets, Plus, Footprints, TrendingDown, Scale, MoonStar, HeartPulse, Trash2 } from "lucide-react";
import { Card, SectionTitle, Pill, ProgressBar, ExampleDataBadge } from "../components/ui";
import { ACTIVITY_WEEK } from "../data/demoData";
import { useLocalStorage } from "../hooks/useLocalStorage";

type Measure = { id: string; date: string; weight: string; glucose: string; sleep: string };

export default function Progress() {
  const [water, setWater] = useLocalStorage<number>("vb_water_today", 4);
  const [measures, setMeasures] = useLocalStorage<Measure[]>("vb_measures", [
    { id: "m1", date: "Mon", weight: "153.2", glucose: "97", sleep: "6.8" },
    { id: "m2", date: "Wed", weight: "152.8", glucose: "95", sleep: "7.0" },
    { id: "m3", date: "Fri", weight: "152.4", glucose: "94", sleep: "7.2" },
  ]);
  const [tab, setTab] = useState<"activity" | "water" | "health">("activity");
  const [form, setForm] = useState({ weight: "", glucose: "", sleep: "" });

  const maxSteps = Math.max(...ACTIVITY_WEEK.map((d) => d.steps));
  const totalSteps = ACTIVITY_WEEK.reduce((s, d) => s + d.steps, 0);
  const avgWater = (ACTIVITY_WEEK.reduce((s, d) => s + d.water, 0) / 7).toFixed(1);

  const glucoseVals = useMemo(() => measures.map((m) => Number(m.glucose) || 0), [measures]);

  const addMeasure = () => {
    if (!form.weight && !form.glucose && !form.sleep) return;
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    setMeasures([
      ...measures,
      {
        id: `m-${Date.now()}`,
        date: `${days[new Date().getDay()]} ${new Date().getDate()}`,
        weight: form.weight || "—",
        glucose: form.glucose || "—",
        sleep: form.sleep || "—",
      },
    ].slice(-8));
    setForm({ weight: "", glucose: "", sleep: "" });
  };

  // SVG line path for glucose
  const linePath = useMemo(() => {
    if (glucoseVals.length < 2) return "";
    const w = 300, h = 90, pad = 12;
    const min = Math.min(...glucoseVals) - 3, max = Math.max(...glucoseVals) + 3;
    return glucoseVals.map((v, i) => {
      const x = pad + (i * (w - pad * 2)) / (glucoseVals.length - 1);
      const y = h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    }).join(" ");
  }, [glucoseVals]);

  return (
    <div className="space-y-5">
      <div className="fade-up">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#7C9A82]">Your progress</p>
        <h1 className="font-display text-[28px] font-semibold tracking-tight">Small wins add up 📈</h1>
        <p className="mt-1 text-[13.5px] text-stone-500">Activity, hydration & measurements. <ExampleDataBadge /></p>
      </div>

      {/* Tabs */}
      <div className="fade-up stagger-1 grid grid-cols-3 gap-1.5 rounded-3xl bg-white p-1.5 shadow-sm ring-1 ring-[#7C9A82]/10">
        {([
          { k: "activity", l: "Activity", icon: Footprints },
          { k: "water", l: "Water", icon: Droplets },
          { k: "health", l: "Health", icon: HeartPulse },
        ] as const).map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`flex items-center justify-center gap-1.5 rounded-2xl py-2.5 text-[13px] font-bold transition-all active:scale-95 ${tab === t.k ? "bg-[#425345] text-white shadow" : "text-stone-500 hover:bg-stone-50"}`}
          >
            <t.icon className="h-4 w-4" /> {t.l}
          </button>
        ))}
      </div>

      {tab === "activity" && (
        <div className="page-enter space-y-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] font-semibold text-stone-500">This week</p>
                <p className="font-display text-[26px] font-bold leading-none">{totalSteps.toLocaleString()} <span className="text-[13px] font-semibold text-stone-400">steps</span></p>
              </div>
              <Pill tone="sage"><TrendingDown className="h-3 w-3 rotate-180" /> +18% vs last week</Pill>
            </div>
            <div className="mt-4 flex h-40 items-end justify-between gap-2">
              {ACTIVITY_WEEK.map((d, i) => (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="text-[10px] font-extrabold text-[#506656]">{(d.steps / 1000).toFixed(1)}k</span>
                  <div className="flex w-full flex-1 items-end justify-center rounded-xl bg-[#F4F0E6] p-1">
                    <div
                      className={`w-full rounded-lg transition-all duration-700 ${i === 5 ? "bg-gradient-to-t from-[#425345] to-[#7C9A82] shadow-md" : "bg-gradient-to-t from-[#7C9A82]/80 to-[#B9CDBD]"}`}
                      style={{ height: `${Math.max(10, (d.steps / maxSteps) * 100)}%` }}
                    />
                  </div>
                  <span className={`text-[11px] font-bold ${i === 6 ? "text-[#425345]" : "text-stone-400"}`}>{d.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                { l: "Avg / day", v: `${Math.round(totalSteps / 7).toLocaleString()}` },
                { l: "Active min", v: "274 min" },
                { l: "Best day", v: "Sat 9.2k" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl bg-[#FAF8F3] p-2.5 ring-1 ring-stone-100">
                  <p className="text-[14px] font-extrabold">{s.v}</p>
                  <p className="text-[11px] text-stone-500">{s.l}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-[#425345] to-[#506656] !text-white">
            <p className="font-display text-[17px] font-semibold">After-meal walks = glucose magic ✨</p>
            <p className="mt-1 text-[13px] text-white/85">A 10-minute walk after lunch blunts your glucose spike by up to 30%. You've done 4/7 this week — 3 more for a perfect week!</p>
            <ProgressBar value={4} max={7} className="mt-3 !bg-white/20" barClass="!bg-gradient-to-r !from-amber-300 !to-emerald-300" />
          </Card>
        </div>
      )}

      {tab === "water" && (
        <div className="page-enter space-y-4">
          <Card className="text-center">
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-sky-600">Today's hydration</p>
            <div className="mx-auto mt-3 flex h-36 w-28 items-end justify-center overflow-hidden rounded-b-full rounded-t-3xl border-4 border-sky-100 bg-sky-50/50">
              <div className="w-full bg-gradient-to-t from-sky-400 to-cyan-200 transition-all duration-700" style={{ height: `${(water / 8) * 100}%` }}>
                <div className="flex h-full items-center justify-center text-[26px]">💧</div>
              </div>
            </div>
            <p className="mt-3 text-[22px] font-extrabold">{water} / 8 <span className="text-[13px] font-semibold text-stone-400">glasses</span></p>
            <div className="mx-auto mt-3 flex max-w-[280px] items-center justify-center gap-3">
              <button onClick={() => setWater(Math.max(0, water - 1))} className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[20px] font-bold text-stone-500 shadow ring-1 ring-stone-200 transition active:scale-90">−</button>
              <button onClick={() => setWater(Math.min(12, water + 1))} className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 text-white shadow-lg transition hover:scale-105 active:scale-95">
                <Plus className="h-6 w-6" strokeWidth={2.5} />
              </button>
              <button onClick={() => setWater(Math.max(0, water - 1))} className="invisible flex h-11 w-11 items-center justify-center rounded-full">−</button>
            </div>
            <p className="mt-2 text-[12px] text-stone-500">{water >= 8 ? "🎉 Goal crushed! Amazing for steady energy." : `${8 - water} more to go — your bottle refill counts as 3!`}</p>
          </Card>
          <Card>
            <SectionTitle eyebrow="This week" title={`${avgWater} glasses / day avg`} />
            <div className="flex items-end justify-between gap-1.5">
              {ACTIVITY_WEEK.map((d, i) => (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex w-full flex-col items-center gap-0.5">
                    {Array.from({ length: 8 }).map((_, g) => (
                      <div key={g} className={`h-2.5 w-full rounded-full ${g < d.water ? (i === 6 ? "bg-sky-500" : "bg-sky-300") : "bg-sky-100"}`} />
                    ))}
                  </div>
                  <span className="mt-1 text-[10px] font-bold text-stone-400">{d.day}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === "health" && (
        <div className="page-enter space-y-4">
          <Card>
            <SectionTitle eyebrow="Fasting glucose trend" title="Steady & in range" action={<Pill tone="sage">94 avg</Pill>} />
            <svg viewBox="0 0 300 100" className="w-full">
              <defs>
                <linearGradient id="gluFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C9A82" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#7C9A82" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[25, 50, 75].map((y) => (
                <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#eee" strokeWidth="1" strokeDasharray="4 4" />
              ))}
              {linePath && (
                <>
                  <path d={`${linePath} L288,100 L12,100 Z`} fill="url(#gluFill)" />
                  <path d={linePath} fill="none" stroke="#506656" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </>
              )}
              {measures.map((m, i) => {
                const vals = measures.map((x) => Number(x.glucose) || 94);
                const min = Math.min(...vals) - 3, max = Math.max(...vals) + 3;
                const x = 12 + (i * (300 - 24)) / Math.max(1, measures.length - 1);
                const y = 100 - 12 - (((Number(m.glucose) || 94) - min) / (max - min || 1)) * (100 - 24);
                return (
                  <g key={m.id}>
                    <circle cx={x} cy={y} r="5" fill="#7C9A82" stroke="white" strokeWidth="2.5" />
                    <text x={x} y={y - 10} textAnchor="middle" fontSize="10" fontWeight="800" fill="#425345">{m.glucose}</text>
                  </g>
                );
              })}
            </svg>
            <div className="mt-1 flex justify-between text-[10px] font-bold text-stone-400">
              {measures.map((m) => <span key={m.id}>{m.date}</span>)}
            </div>
            <p className="mt-2 rounded-xl bg-[#F2F6F2] p-2.5 text-[12px] text-[#3d5a43]">Normal fasting range 70–99 mg/dL. Example demo data — log with your own meter and share trends with campus health.</p>
          </Card>

          <Card>
            <h3 className="font-display text-[18px] font-semibold">Log a measurement ✍️</h3>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { k: "weight", l: "Weight (lbs)", icon: Scale, ph: "152.0" },
                { k: "glucose", l: "Glucose", icon: Droplets, ph: "94" },
                { k: "sleep", l: "Sleep (hrs)", icon: MoonStar, ph: "7.5" },
              ].map((f) => (
                <label key={f.k} className="rounded-2xl bg-[#FAF8F3] p-2.5 ring-1 ring-stone-200/70 focus-within:ring-[#7C9A82]">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-stone-500"><f.icon className="h-3 w-3" />{f.l}</span>
                  <input
                    value={(form as any)[f.k]}
                    onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                    placeholder={f.ph}
                    inputMode="decimal"
                    className="mt-1 w-full bg-transparent text-[16px] font-extrabold outline-none placeholder:text-stone-300"
                  />
                </label>
              ))}
            </div>
            <button onClick={addMeasure} className="mt-3 w-full rounded-2xl bg-[#425345] py-3 text-[14px] font-bold text-white transition hover:bg-[#37453b] active:scale-[0.98]">
              Save to server database
            </button>
            <div className="mt-3 space-y-1.5">
              {[...measures].reverse().map((m) => (
                <div key={m.id} className="flex items-center gap-3 rounded-2xl bg-[#FFFDF8] p-2.5 ring-1 ring-stone-100">
                  <span className="rounded-xl bg-[#E8EFE9] px-2.5 py-1.5 text-[11px] font-extrabold text-[#3d5a43]">{m.date}</span>
                  <span className="flex-1 text-[12.5px] font-semibold text-stone-600">{m.weight} lbs • {m.glucose} mg/dL • {m.sleep}h sleep</span>
                  <button onClick={() => setMeasures(measures.filter((x) => x.id !== m.id))} className="text-stone-300 transition hover:text-rose-400"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
