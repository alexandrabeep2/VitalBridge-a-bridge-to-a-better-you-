import { useMemo } from "react";
import { Gift, Flame, Lock, ExternalLink, Scissors, BadgeCheck, Sparkles, Info } from "lucide-react";
import { Card, Pill, ProgressBar, ExampleDataBadge } from "../components/ui";
import { WELLNESS_GOALS } from "../data/demoData";
import { useLocalStorage } from "../hooks/useLocalStorage";

type Coupon = {
  id: string;
  brand: string;
  title: string;
  detail: string;
  code: string;
  value: string;
  expires: string;
  category: string;
  color: string;
  link: string;
  linkLabel: string;
  emoji: string;
};

const COUPONS: Coupon[] = [
  {
    id: "oats",
    brand: "Quaker Oats",
    title: "$1.00 off Rolled Oats",
    detail: "Any 42 oz canister • heart-healthy whole grain",
    code: "BRIDGE-OATS1",
    value: "$1.00",
    expires: "Dec 31, 2026",
    category: "Whole grains",
    color: "from-[#7C9A82] to-[#506656]",
    link: "https://www.coupons.com/coupons/grocery-coupons/",
    linkLabel: "coupons.com • grocery",
    emoji: "🥣",
  },
  {
    id: "frozen",
    brand: "Birds Eye",
    title: "$1.25 off Frozen Veggies",
    detail: "Any 2 steam-in-bag blends • same nutrition as fresh",
    code: "BRIDGE-VEG125",
    value: "$1.25",
    expires: "Dec 20, 2026",
    category: "Frozen",
    color: "from-sky-500 to-cyan-600",
    link: "https://www.coupons.com/coupons/grocery-coupons/",
    linkLabel: "coupons.com • frozen",
    emoji: "🥦",
  },
  {
    id: "beans",
    brand: "BUSH'S Beans",
    title: "$0.75 off Canned Beans",
    detail: "Any 4-pack black or pinto beans • rinse to cut sodium",
    code: "BRIDGE-BEAN75",
    value: "$0.75",
    expires: "Jan 15, 2027",
    category: "Pantry",
    color: "from-amber-500 to-orange-600",
    link: "https://www.smartsource.com/",
    linkLabel: "smartsource.com",
    emoji: "🫘",
  },
  {
    id: "greengiant",
    brand: "Green Giant",
    title: "$1.50 off 3 Canned Veg",
    detail: "Corn, green beans or peas • no salt added picks",
    code: "BRIDGE-GREEN150",
    value: "$1.50",
    expires: "Dec 28, 2026",
    category: "Canned",
    color: "from-emerald-500 to-teal-600",
    link: "https://www.coupons.com/coupons/grocery-coupons/",
    linkLabel: "coupons.com • canned veg",
    emoji: "🌽",
  },
  {
    id: "tuna",
    brand: "StarKist Tuna",
    title: "$1.00 off 4-pack Tuna",
    detail: "Chunk light in water • 24g protein per lunch wrap",
    code: "BRIDGE-TUNA1",
    value: "$1.00",
    expires: "Jan 10, 2027",
    category: "Protein",
    color: "from-[#506656] to-[#2f4534]",
    link: "https://www.smartsource.com/",
    linkLabel: "smartsource.com",
    emoji: "🐟",
  },
  {
    id: "store",
    brand: "Healthy Pantry Week",
    title: "$5 off $25 Groceries",
    detail: "Fresh + frozen produce & whole grains • VitalBridge partner demo",
    code: "BRIDGE-5OFF25",
    value: "$5.00",
    expires: "Dec 31, 2026",
    category: "Store-wide",
    color: "from-violet-500 to-purple-700",
    link: "https://www.coupons.com/",
    linkLabel: "coupons.com • store deals",
    emoji: "🛒",
  },
];

export default function Rewards() {
  const [checked] = useLocalStorage<Record<string, boolean>>("vb_goals", { walk: true, water: true });
  const [clipped, setClipped] = useLocalStorage<string[]>("vb_coupons_clipped", []);
  const [streak] = useLocalStorage<number>("vb_streak", 12);

  const completedCount = useMemo(() => WELLNESS_GOALS.filter((g) => checked[g.id]).length, [checked]);
  const allDone = completedCount === WELLNESS_GOALS.length;
  const todayStr = new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

  const toggleClip = (id: string) =>
    setClipped(clipped.includes(id) ? clipped.filter((c) => c !== id) : [...clipped, id]);

  return (
    <div className="space-y-5">
      <div className="fade-up">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#7C9A82]">VitalBridge perks</p>
        <h1 className="font-display text-[30px] font-semibold tracking-tight">Rewards 🎟️</h1>
        <p className="mt-1 text-[13.5px] text-stone-500">{todayStr} • <ExampleDataBadge /></p>
      </div>

      {/* Why you receive coupons */}
      <Card className="fade-up stagger-1 border-2 !border-[#7C9A82]/20 bg-gradient-to-br from-white to-[#F2F6F2]">
        <div className="flex items-center gap-2.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg">
            <Gift className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[14px] font-bold">Why did I get these coupons?</p>
            <p className="flex items-center gap-1 text-[12px] font-semibold text-[#506656]">
              <Flame className="h-3.5 w-3.5 text-orange-500" /> {streak}-day streak • {completedCount}/5 goals today
            </p>
          </div>
          <div className="ml-auto">
            {allDone ? <Pill tone="sage">✓ Unlocked</Pill> : <Pill tone="amber">🔒 {5 - completedCount} to go</Pill>}
          </div>
        </div>
        <p className="mt-3 rounded-2xl bg-white/80 p-3.5 text-[13.5px] leading-relaxed text-stone-600 ring-1 ring-[#7C9A82]/15">
          Every day that your streak is maintained and you have all your daily wellness goals completed you will be
          given coupons to help you shop for better deals on healthy food options. Finish all 5 goals — walks, water,
          veggies, sleep and no sugary drinks — and today's healthy-food coupons unlock automatically. 💚
        </p>
        <ProgressBar value={completedCount} max={5} className="mt-3" />
        <p className="mt-1.5 text-[12px] font-semibold text-stone-500">
          {allDone
            ? "All 5 complete — coupons unlocked! Clip them below."
            : `${completedCount} of 5 done — finish ${5 - completedCount} more on the Home tab to unlock.`}
        </p>
      </Card>

      {/* Streak banner */}
      <div className="fade-up stagger-2 relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#425345] via-[#506656] to-[#7C9A82] p-5 text-white shadow-lg">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 text-[32px] backdrop-blur">🏆</div>
          <div className="flex-1">
            <p className="font-display text-[20px] font-semibold leading-tight">
              {allDone ? "Streak protected + rewarded!" : "Protect your streak today"}
            </p>
            <p className="mt-0.5 text-[12.5px] text-white/80">
              {allDone
                ? `${streak} days strong. Tomorrow's coupons unlock the same way.`
                : "Complete every wellness goal to keep your streak alive and earn coupons."}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[26px] font-extrabold">{streak}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">days</p>
          </div>
        </div>
      </div>

      {/* Coupons */}
      <div className={allDone ? "" : "relative"}>
        {!allDone && (
          <div className="absolute inset-x-0 top-0 z-10 flex justify-center pt-2">
            <span className="flex items-center gap-1.5 rounded-full bg-[#2b332d]/85 px-4 py-2 text-[12px] font-bold text-white shadow-lg backdrop-blur">
              <Lock className="h-3.5 w-3.5" /> Locked — finish all goals to clip
            </span>
          </div>
        )}
        <div className={`grid gap-3 pt-8 sm:grid-cols-2 ${allDone ? "!pt-0" : ""} ${allDone ? "" : "pointer-events-none select-none blur-[1.5px] opacity-70"}`}>
          {COUPONS.map((c, i) => {
            const isClipped = clipped.includes(c.id);
            return (
              <div
                key={c.id}
                className="fade-up overflow-hidden rounded-3xl bg-white shadow-[0_2px_24px_rgba(90,110,90,0.08)] ring-1 ring-[#7C9A82]/10"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className={`relative bg-gradient-to-br p-4 text-white ${c.color}`}>
                  <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/15 blur-xl" />
                  <div className="relative flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-[24px] backdrop-blur">{c.emoji}</span>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/75">{c.brand}</p>
                        <p className="text-[15px] font-extrabold leading-tight">{c.title}</p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-xl bg-white px-2.5 py-1.5 text-center shadow">
                      <span className="block text-[15px] font-extrabold leading-none text-[#2f4534]">{c.value}</span>
                      <span className="block text-[9px] font-bold uppercase text-stone-500">off</span>
                    </span>
                  </div>
                  {/* perforation */}
                  <div className="relative mt-3 flex items-center gap-1">
                    <div className="h-px flex-1 bg-white/30" />
                    <Scissors className="h-3.5 w-3.5 text-white/70" />
                    <div className="h-px flex-1 bg-white/30" />
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[12.5px] text-stone-600">{c.detail}</p>
                  <div className="mt-2 flex items-center justify-between text-[11.5px]">
                    <span className="rounded-full bg-[#F4F0E6] px-2.5 py-1 font-bold text-stone-600">{c.category}</span>
                    <span className="font-semibold text-stone-400">Exp. {c.expires}</span>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between rounded-2xl bg-[#FAF8F3] px-3 py-2 ring-1 ring-dashed ring-[#7C9A82]/30">
                    <span className="font-mono text-[13px] font-extrabold tracking-wider text-[#2f4534]">{c.code}</span>
                    <button
                      onClick={() => toggleClip(c.id)}
                      className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-bold transition active:scale-95 ${isClipped ? "bg-[#7C9A82] text-white" : "bg-[#425345] text-white hover:bg-[#37453b]"}`}
                    >
                      {isClipped ? (<><BadgeCheck className="h-3.5 w-3.5" /> Clipped ✓</>) : "Clip"}
                    </button>
                  </div>
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-2.5 flex items-center justify-center gap-1.5 rounded-xl bg-white py-2 text-[12px] font-bold text-[#506656] ring-1 ring-[#7C9A82]/25 transition hover:bg-[#F2F6F2]"
                  >
                    View sample coupon source <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <p className="mt-1 text-center text-[10.5px] text-stone-400">{c.linkLabel} • sample link, demo only</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Card className="fade-up flex items-start gap-2 !bg-[#FFFDF8]">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#7C9A82]" />
        <p className="text-[12px] leading-relaxed text-stone-500">
          <span className="font-bold text-stone-600">How it works:</span> sample coupons are for demo only and don't
          hold real store value — the linked coupon sites are real places to find live savings. Clipped coupons save to
          this browser + server database (simulated). Keep your streak: {clipped.length} clipped so far.{" "}
          <span className="inline-flex items-center gap-1 font-bold text-[#506656]"><Sparkles className="h-3 w-3" /> New deals drop daily when goals are complete.</span>
        </p>
      </Card>
    </div>
  );
}
