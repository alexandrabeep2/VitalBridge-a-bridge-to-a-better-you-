import { useEffect, useMemo, useState } from "react";
import { Footprints, Droplets, Salad, MoonStar, CupSoda, Flame, ChevronRight, Sparkles, Clock3, HeartPulse, ArrowRight, BadgeCheck, Gift, X } from "lucide-react";
import { Card, SectionTitle, Pill, ProgressBar, Ring, ExampleDataBadge } from "../components/ui";
import { WELLNESS_GOALS, HEALTH_METRICS, MEALS, ACTIVITY_WEEK } from "../data/demoData";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { PageKey } from "../components/BottomNav";

const ICONS: Record<string, any> = {
  footprints: Footprints,
  droplet: Droplets,
  salad: Salad,
  moon: MoonStar,
  cup: CupSoda,
};

export default function Dashboard({ userName, weeklyBudget, go }: { userName: string; weeklyBudget: number; go: (p: PageKey) => void }) {
  const [checked, setChecked] = useLocalStorage<Record<string, boolean>>("vb_goals", { walk: true, water: true });
  const [waterGlasses] = useLocalStorage<number>("vb_water_today", 4);
  const [celebratedDate, setCelebratedDate] = useLocalStorage<string>("vb_reward_popup_date", "");
  const [showPopup, setShowPopup] = useState(false);

  const todaySteps = 6105;
  const stepsGoal = 8000;
  const activeMin = 31;
  const firstName = userName.split(" ")[0] || "Jane";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const completedCount = useMemo(() => WELLNESS_GOALS.filter((g) => checked[g.id]).length, [checked]);
  const points = useMemo(() => WELLNESS_GOALS.filter((g) => checked[g.id]).reduce((s, g) => s + g.points, 0), [checked]);
  const progressPct = Math.round((completedCount / WELLNESS_GOALS.length) * 100);
  const allDone = completedCount === WELLNESS_GOALS.length;
  const todayKey = new Date().toISOString().slice(0, 10);

  const toggle = (id: string) => setChecked({ ...checked, [id]: !checked[id] });

  useEffect(() => {
    if (allDone && celebratedDate !== todayKey) {
      const t = setTimeout(() => setShowPopup(true), 600);
      return () => clearTimeout(t);
    }
  }, [allDone, celebratedDate, todayKey]);

  const closePopup = (claimed: boolean) => {
    setShowPopup(false);
    if (claimed) setCelebratedDate(todayKey);
  };

  return (
    <div className="space-y-5">
      {/* Greeting hero */}
      <div className="fade-up relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#425345] via-[#506656] to-[#7C9A82] p-6 text-white shadow-[0_12px_40px_rgba(66,83,69,0.3)]">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-[#D9E6DB]/20 blur-2xl" />
        <div className="absolute right-6 top-6 hidden text-[52px] opacity-90 sm:block">🌿</div>
        <div className="relative">
          <div className="flex items-center gap-2">
            <Pill tone="white">🔥 {12}-day streak</Pill>
            <ExampleDataBadge />
          </div>
          <h1 className="font-display mt-3 text-[30px] font-semibold leading-[1.1] tracking-tight">
            {greeting},<br />{firstName} 🌤️
          </h1>
          <p className="mt-2 max-w-[260px] text-[13.5px] leading-relaxed text-white/85">
            Small steps today keep Type 2 diabetes away. You're {Math.round((todaySteps / stepsGoal) * 100)}% to your step goal!
          </p>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={() => go("buddy")} className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-[13px] font-bold text-[#2f4534] shadow transition hover:scale-[1.03] active:scale-95">
              <Sparkles className="h-4 w-4 text-[#7C9A82]" /> Ask Buddy
            </button>
            <button onClick={() => go("meals")} className="flex items-center gap-1 rounded-full border border-white/40 px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-white/10 active:scale-95">
              Today's meals <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        {/* mini stats strip */}
        <div className="relative mt-5 grid grid-cols-3 gap-2">
          {[
            { v: `${(todaySteps / 1000).toFixed(1)}k`, l: "Steps" },
            { v: `${activeMin}m`, l: "Active" },
            { v: `${points} pts`, l: "Earned" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl bg-white/15 p-2.5 text-center backdrop-blur">
              <p className="text-[16px] font-bold">{s.v}</p>
              <p className="text-[11px] font-medium text-white/75">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity + goals */}
      <div className="grid gap-5 lg:grid-cols-5">
        <Card className="fade-up stagger-1 lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#7C9A82]">Activity progress</p>
            <button onClick={() => go("progress")} className="flex items-center gap-0.5 text-[12px] font-bold text-[#506656]">
              Details <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-4">
            <Ring progress={(todaySteps / stepsGoal) * 100}>
              <p className="text-[19px] font-extrabold leading-none text-[#2b332d]">{Math.round((todaySteps / stepsGoal) * 100)}%</p>
              <p className="mt-0.5 text-[10px] font-semibold text-stone-500">of 8k</p>
            </Ring>
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex justify-between text-[12px] font-semibold"><span>Steps</span><span className="text-stone-500">{todaySteps.toLocaleString()} / 8,000</span></div>
                <ProgressBar value={todaySteps} max={stepsGoal} className="mt-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-[12px] font-semibold"><span>Active minutes</span><span className="text-stone-500">{activeMin} / 45</span></div>
                <ProgressBar value={activeMin} max={45} className="mt-1.5" barClass="bg-gradient-to-r from-amber-400 to-orange-400" />
              </div>
              <div>
                <div className="flex justify-between text-[12px] font-semibold"><span>Water</span><span className="text-stone-500">{waterGlasses} / 8 glasses</span></div>
                <ProgressBar value={waterGlasses} max={8} className="mt-1.5" barClass="bg-gradient-to-r from-sky-400 to-cyan-300" />
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-1.5">
            {ACTIVITY_WEEK.map((d) => (
              <div key={d.day} className="flex-1 text-center">
                <div className="flex h-16 items-end justify-center rounded-lg bg-[#F4F0E6] p-1">
                  <div className="w-full rounded-md bg-gradient-to-t from-[#7C9A82] to-[#B9CDBD] transition-all" style={{ height: `${Math.max(12, (d.steps / 9230) * 100)}%` }} />
                </div>
                <p className="mt-1 text-[10px] font-bold text-stone-500">{d.day[0]}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="fade-up stagger-2 lg:col-span-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#7C9A82]">Daily wellness goals</p>
              <p className="font-display text-[19px] font-semibold">{completedCount}/5 complete • {points} pts</p>
            </div>
            <Ring size={56} stroke={7} progress={progressPct}>
              <Flame className="h-4 w-4 text-orange-500" />
            </Ring>
          </div>
          {allDone ? (
            <button
              onClick={() => setShowPopup(true)}
              className="page-enter mt-2 flex w-full items-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 p-3 text-left text-white shadow-lg shadow-orange-200 transition hover:scale-[1.01] active:scale-[0.99]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/25 text-[20px]">🎉</span>
              <span className="flex-1">
                <span className="block text-[13.5px] font-extrabold">All goals complete — coupons unlocked!</span>
                <span className="block text-[12px] text-white/85">Tap to reveal today's healthy-food deals →</span>
              </span>
              <Gift className="h-5 w-5 shrink-0" />
            </button>
          ) : (
            <button
              onClick={() => go("rewards")}
              className="mt-2 flex w-full items-center gap-2 rounded-2xl bg-[#F4F0E6] p-2.5 text-left transition hover:bg-[#E9E2D2] active:scale-[0.99]"
            >
              <Gift className="ml-1 h-4 w-4 shrink-0 text-[#7C9A82]" />
              <span className="text-[12px] font-semibold text-stone-600">
                Finish all 5 to unlock today's <span className="font-bold text-[#3d5a43]">Rewards coupons</span> • {5 - completedCount} to go
              </span>
            </button>
          )}
          <div className="mt-2 space-y-2">
            {WELLNESS_GOALS.map((g) => {
              const Icon = ICONS[g.icon];
              const done = !!checked[g.id];
              return (
                <button
                  key={g.id}
                  onClick={() => toggle(g.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-300 active:scale-[0.98] ${done ? "border-[#7C9A82]/30 bg-[#F2F6F2]" : "border-stone-100 bg-[#FFFDF8] hover:border-[#7C9A82]/25 hover:shadow-sm"}`}
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${done ? "bg-[#7C9A82] text-white" : "bg-[#E8EFE9] text-[#506656]"}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="flex-1">
                    <span className={`block text-[13.5px] font-bold ${done ? "text-[#3d5a43] line-through decoration-[#7C9A82]/60" : "text-[#2b332d]"}`}>{g.label}</span>
                    <span className="block text-[12px] text-stone-500">{g.detail}</span>
                  </span>
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${done ? "border-[#7C9A82] bg-[#7C9A82] text-white" : "border-stone-200 text-transparent"}`}>
                    <BadgeCheck className="h-4 w-4" />
                  </span>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Meals preview */}
      <div className="fade-up stagger-3">
        <SectionTitle
          eyebrow="Eat well for less"
          title="Today's picks"
          action={
            <button onClick={() => go("meals")} className="flex items-center gap-1 rounded-full bg-[#E8EFE9] px-3 py-1.5 text-[12px] font-bold text-[#3d5a43] transition hover:bg-[#d9e6db] active:scale-95">
              Meal plan <ChevronRight className="h-3.5 w-3.5" />
            </button>
          }
        />
        <div className="grid gap-3 sm:grid-cols-3">
          {MEALS.slice(0, 3).map((m) => (
            <button key={m.id} onClick={() => go("meals")} className="group overflow-hidden rounded-3xl bg-white text-left shadow-[0_2px_24px_rgba(90,110,90,0.08)] ring-1 ring-[#7C9A82]/10 transition hover:-translate-y-1 hover:shadow-lg active:scale-[0.98]">
              <div className="relative h-32 overflow-hidden">
                <img src={m.image} alt={m.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" loading="lazy" />
                <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#3d5a43] backdrop-blur">{m.tag}</span>
                <span className="absolute bottom-2.5 right-2.5 rounded-full bg-[#2b332d]/80 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">${m.cost.toFixed(2)}</span>
              </div>
              <div className="p-3.5">
                <p className="text-[14px] font-bold leading-snug">{m.name}</p>
                <p className="mt-1 flex items-center gap-1 text-[12px] text-stone-500"><Clock3 className="h-3 w-3" /> {m.time} • {m.calories} cal</p>
              </div>
            </button>
          ))}
        </div>
        <p className="mt-2 text-center text-[12px] text-stone-500">Tailored to your <button onClick={() => go("budget")} className="font-bold text-[#506656] underline decoration-[#7C9A82]/40 underline-offset-2">${weeklyBudget}/week grocery budget</button> • Example data</p>
      </div>

      {/* Health metrics */}
      <div className="fade-up stagger-4">
        <SectionTitle eyebrow="Prevention snapshot" title="Health metrics" action={<ExampleDataBadge />} />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {HEALTH_METRICS.map((h) => (
            <Card key={h.id} className="!p-4">
              <div className="flex items-center justify-between">
                <HeartPulse className="h-4 w-4 text-[#7C9A82]" />
                <Pill tone={h.status === "good" ? "sage" : "amber"}>{h.trend}</Pill>
              </div>
              <p className="mt-2 text-[12px] font-semibold text-stone-500">{h.label}</p>
              <p className="mt-0.5 text-[22px] font-extrabold tracking-tight">{h.value} <span className="text-[12px] font-semibold text-stone-400">{h.unit}</span></p>
              <p className="text-[11px] text-stone-500">{h.range}</p>
            </Card>
          ))}
        </div>
        <div className="mt-3 rounded-2xl border border-dashed border-[#7C9A82]/30 bg-[#F2F6F2]/70 p-3.5 text-center text-[12px] leading-relaxed text-[#506656]">
          VitalBridge is a wellness companion — not a medical device. Example health data shown. Always consult a clinician for diagnosis or treatment.
        </div>
      </div>

      {/* Coupon celebration popup — appears when all wellness goals are complete */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#2b332d]/50 p-4 backdrop-blur-sm sm:items-center">
          <div className="page-enter w-full max-w-sm overflow-hidden rounded-[28px] bg-white shadow-2xl">
            <div className="relative bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 p-6 text-center text-white">
              <button
                onClick={() => closePopup(false)}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/25 transition hover:bg-white/40"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white/25 text-[36px] shadow-lg backdrop-blur">🎉</div>
              <h3 className="font-display mt-3 text-[24px] font-bold leading-tight">All goals complete!</h3>
              <p className="mt-1 text-[13px] text-white/90">12-day streak maintained 🔥 • Coupons unlocked</p>
            </div>
            <div className="p-5">
              <div className="rounded-2xl border-2 border-dashed border-[#7C9A82]/30 bg-[#F2F6F2] p-3.5 text-center">
                <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#506656]">Today's reward preview</p>
                <div className="mt-2 flex justify-center gap-2">
                  {["$1.00", "$1.25", "$5.00"].map((v) => (
                    <span key={v} className="rounded-xl bg-white px-3 py-2 text-[14px] font-extrabold text-[#2f4534] shadow-sm ring-1 ring-[#7C9A82]/20">{v} off</span>
                  ))}
                </div>
                <p className="mt-2 text-[12px] text-stone-500">Oats • frozen veggies • $25 grocery basket + 3 more</p>
              </div>
              <button
                onClick={() => { closePopup(true); go("rewards"); }}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#425345] py-3.5 text-[14px] font-bold text-white shadow-lg transition hover:bg-[#37453b] active:scale-[0.98]"
              >
                <Gift className="h-4 w-4" /> Open my Rewards coupons
              </button>
              <button onClick={() => closePopup(true)} className="mt-2 w-full py-1 text-[12px] font-bold text-stone-400 hover:text-stone-600">
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
