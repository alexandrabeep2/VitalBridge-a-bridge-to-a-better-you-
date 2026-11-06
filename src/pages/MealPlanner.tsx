import { useMemo, useState } from "react";
import { Wallet, Clock3, Flame, Check, ShoppingBasket, Info, ArrowRight, Leaf, ChefHat, RefreshCw, CalendarDays, Sparkles } from "lucide-react";
import { Card, SectionTitle, Pill, ProgressBar, ExampleDataBadge, SimulatedBadge } from "../components/ui";
import { MEALS, type Meal } from "../data/demoData";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { PageKey } from "../components/BottomNav";

type DayPlan = { day: string; short: string; breakfastId: string; lunchId: string; dinnerId: string };
type WeekPlan = { days: DayPlan[]; seed: number; budgetFor: number; generatedAt: string };

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Estimated pantry buy prices (NOT live store prices — clearly labeled estimates)
const PRICE_EST: Record<string, { qty: string; price: number; category: string }> = {
  "Rolled oats": { qty: "1 canister", price: 4.28, category: "Pantry" },
  "Peanut butter": { qty: "1 jar", price: 2.98, category: "Pantry" },
  "Banana": { qty: "6 ct", price: 1.44, category: "Produce" },
  "Chia seeds": { qty: "1 bag", price: 3.48, category: "Pantry" },
  "Low-fat milk": { qty: "1/2 gal", price: 2.2, category: "Dairy" },
  "Brown rice": { qty: "2 lb bag", price: 2.48, category: "Pantry" },
  "Black beans": { qty: "4 cans", price: 3.16, category: "Canned" },
  "Corn": { qty: "2 cans", price: 1.5, category: "Canned" },
  "Salsa": { qty: "1 jar", price: 2.24, category: "Pantry" },
  "Cabbage slaw": { qty: "1 bag", price: 1.98, category: "Produce" },
  "Chicken thigh": { qty: "3 lb pack", price: 5.97, category: "Protein" },
  "Frozen stir-fry blend": { qty: "2 bags", price: 4.96, category: "Frozen" },
  "Soy sauce (low-sodium)": { qty: "1 bottle", price: 1.98, category: "Pantry" },
  "Garlic": { qty: "1 head", price: 0.5, category: "Produce" },
  "Red lentils": { qty: "1 lb bag", price: 1.89, category: "Pantry" },
  "Carrots": { qty: "1 lb", price: 1.2, category: "Produce" },
  "Onion": { qty: "2 ct", price: 0.8, category: "Produce" },
  "Cumin": { qty: "pantry", price: 0, category: "Pantry" },
  "Vegetable broth": { qty: "1 carton", price: 1.98, category: "Canned" },
  "Whole-wheat tortilla": { qty: "8 ct", price: 2.24, category: "Bakery" },
  "Canned tuna": { qty: "4 cans", price: 3.76, category: "Canned" },
  "White beans": { qty: "2 cans", price: 1.58, category: "Canned" },
  "Greek yogurt": { qty: "1 tub", price: 3.5, category: "Dairy" },
  "Spinach": { qty: "1 box", price: 2.98, category: "Produce" },
  "Eggs": { qty: "1 dozen", price: 2.8, category: "Protein" },
  "Frozen peppers & onions": { qty: "1 bag", price: 1.98, category: "Frozen" },
  "Whole-wheat toast": { qty: "1 loaf", price: 2.0, category: "Bakery" },
  "Black pepper": { qty: "pantry", price: 0, category: "Pantry" },
};

function buildWeek(budget: number, seed: number): DayPlan[] {
  const breakfasts = MEALS.filter((m) => m.tag === "Breakfast");
  const lunches = MEALS.filter((m) => m.tag === "Lunch");
  const dinners = MEALS.filter((m) => m.tag === "Dinner");
  // Budget tier shifts picks toward cheaper meals when money is tight
  const cheapFirst = (a: Meal, b: Meal) => a.cost - b.cost;
  const bList = [...breakfasts].sort(cheapFirst);
  const lList = [...lunches].sort(cheapFirst);
  const dList = [...dinners].sort(cheapFirst);
  const tight = budget <= 35;
  return DAYS.map((day, i) => {
    const o = seed + i * (tight ? 1 : 2);
    return {
      day,
      short: SHORT[i],
      breakfastId: bList[o % bList.length].id,
      lunchId: lList[(o + (tight ? 0 : 1)) % lList.length].id,
      dinnerId: dList[(o + (i % 2)) % dList.length].id,
    };
  });
}

const mealById = (id: string) => MEALS.find((m) => m.id === id)!;

export default function MealPlanner({ weeklyBudget, setWeeklyBudget, go }: { weeklyBudget: number; setWeeklyBudget: (n: number) => void; go: (p: PageKey) => void }) {
  const [week, setWeek] = useLocalStorage<WeekPlan | null>("vb_week_plan", null);
  const [checkedGrocery, setCheckedGrocery] = useLocalStorage<string[]>("vb_grocery_checked", []);
  const [activeDay, setActiveDay] = useState(0);
  const [generating, setGenerating] = useState(false);

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      const seed = Math.floor(Math.random() * 1000);
      setWeek({ days: buildWeek(weeklyBudget, seed), seed, budgetFor: weeklyBudget, generatedAt: new Date().toISOString() });
      setActiveDay(0);
      setGenerating(false);
    }, 900);
  };

  const swapMeal = (dayIdx: number, slot: "breakfastId" | "lunchId" | "dinnerId") => {
    if (!week) return;
    const pool = MEALS.filter((m) => m.tag === (slot === "breakfastId" ? "Breakfast" : slot === "lunchId" ? "Lunch" : "Dinner"));
    const current = week.days[dayIdx][slot];
    const alternatives = pool.filter((m) => m.id !== current);
    const next = alternatives[Math.floor(Math.random() * alternatives.length)];
    const days = week.days.map((d, i) => (i === dayIdx ? { ...d, [slot]: next.id } : d));
    setWeek({ ...week, days });
  };

  const allMeals = useMemo(() => {
    if (!week) return [];
    return week.days.flatMap((d) => [mealById(d.breakfastId), mealById(d.lunchId), mealById(d.dinnerId)]);
  }, [week]);

  const weeklyEst = useMemo(() => allMeals.reduce((s, m) => s + m.cost, 0), [allMeals]);
  const dailyAvg = useMemo(() => {
    if (!allMeals.length) return { cal: 0, protein: 0, carbs: 0, fiber: 0, sugar: 0, cost: 0 };
    const sum = (k: "calories" | "protein" | "carbs" | "fiber" | "sugar" | "cost") => allMeals.reduce((s, m) => s + m[k], 0);
    return { cal: Math.round(sum("calories") / 7), protein: Math.round(sum("protein") / 7), carbs: Math.round(sum("carbs") / 7), fiber: Math.round(sum("fiber") / 7), sugar: Math.round(sum("sugar") / 7), cost: sum("cost") / 7 };
  }, [allMeals]);

  const grocery = useMemo(() => {
    const seen = new Map<string, { name: string; qty: string; price: number; category: string; count: number }>();
    allMeals.forEach((m) => {
      m.ingredients.forEach((ing) => {
        const est = PRICE_EST[ing] ?? { qty: "1", price: 1.5, category: "Pantry" };
        if (!seen.has(ing)) seen.set(ing, { name: ing, ...est, count: 0 });
        seen.get(ing)!.count += 1;
      });
    });
    return [...seen.values()].filter((g) => g.price > 0);
  }, [allMeals]);

  const groceryEst = grocery.reduce((s, g) => s + g.price, 0);
  const checkedCount = grocery.filter((g) => checkedGrocery.includes(g.name)).length;
  const budgetLeft = weeklyBudget - weeklyEst;

  const toggleGrocery = (name: string) =>
    setCheckedGrocery(checkedGrocery.includes(name) ? checkedGrocery.filter((c) => c !== name) : [...checkedGrocery, name]);

  const dayPlan = week?.days[activeDay];

  return (
    <div className="space-y-5">
      <div className="fade-up">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#7C9A82]">Proposed VitalBridge Meal Planner</p>
        <h1 className="font-display text-[28px] font-semibold tracking-tight">Plan your healthy week 🥗</h1>
        <p className="mt-1 text-[13.5px] text-stone-500">Choose your grocery budget and generate an example meal plan. <ExampleDataBadge /></p>
        {/* Story steps for judges */}
        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {["Set budget", "Plan meals", "Check nutrition", "Shop affordably"].map((s, i) => (
            <div key={s} className={`rounded-2xl p-2 text-center ring-1 ${i === 0 || week ? "bg-[#E8EFE9] text-[#2f4534] ring-[#7C9A82]/20" : "bg-white text-stone-400 ring-stone-200"}`}>
              <p className="text-[15px] font-extrabold">{i + 1}</p>
              <p className="text-[10px] font-bold leading-tight">{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1 — budget + generate */}
      <Card className="fade-up stagger-1 border-2 !border-[#7C9A82]/20 bg-gradient-to-br from-white to-[#F2F6F2]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#7C9A82] text-white"><Wallet className="h-5 w-5" /></span>
            <div>
              <p className="text-[13px] font-bold">Weekly grocery budget</p>
              <p className="text-[12px] text-stone-500">Synced with Smart Budget • estimates only</p>
            </div>
          </div>
          <button onClick={() => go("budget")} className="flex items-center gap-1 rounded-full bg-[#E8EFE9] px-3 py-1.5 text-[12px] font-bold text-[#3d5a43] transition hover:bg-[#d9e6db]">
            Smart Budget <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-[22px] font-extrabold text-[#2f4534]">$</span>
          <input
            type="number"
            value={weeklyBudget}
            min={15}
            max={150}
            onChange={(e) => setWeeklyBudget(Math.max(15, Math.min(150, Number(e.target.value) || 0)))}
            className="w-24 rounded-2xl border-2 border-[#7C9A82]/25 bg-white px-3 py-2 text-[20px] font-extrabold text-[#2f4534] outline-none focus:border-[#7C9A82]"
          />
          <span className="text-[13px] font-medium text-stone-500">/ week</span>
          {week && (
            <div className="ml-auto text-right">
              <p className="text-[12px] font-semibold text-stone-500">Planned est.</p>
              <p className={`text-[18px] font-extrabold ${budgetLeft >= 0 ? "text-[#3d7a4c]" : "text-rose-500"}`}>${weeklyEst.toFixed(2)} est.</p>
            </div>
          )}
        </div>
        <input
          type="range" min={20} max={100} value={weeklyBudget}
          onChange={(e) => setWeeklyBudget(Number(e.target.value))}
          className="sage-range mt-3 w-full"
          style={{ ["--fill" as any]: `${((weeklyBudget - 20) / 80) * 100}%` }}
        />
        <button
          onClick={generate}
          disabled={generating}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#425345] py-3.5 text-[14px] font-bold text-white shadow-lg transition hover:bg-[#37453b] active:scale-[0.98] disabled:opacity-70"
        >
          {generating ? (<><RefreshCw className="h-4 w-4 animate-spin" /> Building your week…</>) : (<><ChefHat className="h-4.5 w-4.5" /> Generate my sample meal plan</>)}
        </button>
        {week && (
          <p className="mt-2 text-center text-[12px] text-stone-500">
            Planned for <span className="font-bold text-[#2f4534]">${week.budgetFor}/wk</span> • {budgetLeft >= 0 ? <span className="font-bold text-[#3d7a4c]">${budgetLeft.toFixed(2)} under budget ✓</span> : <span className="font-bold text-rose-500">${Math.abs(budgetLeft).toFixed(2)} over — raise budget or tap ⟳ on a meal</span>}
          </p>
        )}
      </Card>

      {!week ? (
        <Card className="fade-up stagger-2 text-center">
          <p className="text-[40px]">🗓️</p>
          <p className="font-display text-[19px] font-semibold">No plan yet</p>
          <p className="mx-auto mt-1 max-w-xs text-[13px] text-stone-500">Set a budget above and tap Generate — you'll get breakfast, lunch & dinner for all 7 days, plus nutrition and a derived grocery list.</p>
        </Card>
      ) : (
        <>
          {/* STEP 2 — 7-day plan */}
          <div className="fade-up stagger-2">
            <SectionTitle
              eyebrow="Step 2 • Your 7-day plan"
              title={`${week.days.length * 3} meals • $${weeklyEst.toFixed(2)} est.`}
              action={<SimulatedBadge />}
            />
            <div className="flex gap-1.5 overflow-x-auto pb-2 nice-scroll">
              {week.days.map((d, i) => {
                const cost = mealById(d.breakfastId).cost + mealById(d.lunchId).cost + mealById(d.dinnerId).cost;
                return (
                  <button
                    key={d.day}
                    onClick={() => setActiveDay(i)}
                    className={`shrink-0 rounded-2xl px-3.5 py-2 text-center transition active:scale-95 ${i === activeDay ? "bg-[#425345] text-white shadow-md" : "bg-white text-stone-500 ring-1 ring-stone-200"}`}
                  >
                    <span className="block text-[12px] font-extrabold">{d.short}</span>
                    <span className={`block text-[10px] font-semibold ${i === activeDay ? "text-white/70" : "text-stone-400"}`}>${cost.toFixed(2)}</span>
                  </button>
                );
              })}
            </div>

            {dayPlan && (
              <div className="page-enter space-y-2.5" key={activeDay}>
                {([
                  { slot: "breakfastId" as const, label: "Breakfast" },
                  { slot: "lunchId" as const, label: "Lunch" },
                  { slot: "dinnerId" as const, label: "Dinner" },
                ]).map(({ slot, label }) => {
                  const m = mealById(dayPlan[slot]);
                  return (
                    <div key={slot} className="flex gap-3 overflow-hidden rounded-3xl bg-white p-3 shadow-[0_2px_24px_rgba(90,110,90,0.08)] ring-1 ring-[#7C9A82]/10">
                      <img src={m.image} alt={m.name} className="h-20 w-20 shrink-0 rounded-2xl object-cover" loading="lazy" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7C9A82]">{dayPlan.day} • {label}</p>
                        <p className="truncate text-[14px] font-bold">{m.name}</p>
                        <p className="mt-0.5 flex items-center gap-2 text-[12px] text-stone-500">
                          <span className="flex items-center gap-1"><Clock3 className="h-3 w-3" />{m.time}</span>
                          <span className="flex items-center gap-1"><Flame className="h-3 w-3" />{m.calories} cal</span>
                          <span className="font-extrabold text-[#2f4534]">${m.cost.toFixed(2)} est.</span>
                        </p>
                      </div>
                      <button onClick={() => swapMeal(activeDay, slot)} title={`Swap ${label.toLowerCase()}`} className="flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-full bg-[#F2F6F2] text-[#3d5a43] transition hover:bg-[#E8EFE9] active:rotate-180 active:scale-90">
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
                <div className="flex gap-2">
                  <button onClick={generate} className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-white py-2.5 text-[13px] font-bold text-[#3d5a43] ring-1 ring-[#7C9A82]/25 transition hover:bg-[#F2F6F2]">
                    <RefreshCw className="h-4 w-4" /> Refresh full week
                  </button>
                  <div className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-[#F2F6F2] py-2.5 text-[13px] font-bold text-[#3d5a43]">
                    <CalendarDays className="h-4 w-4" /> Day total: ${(mealById(dayPlan.breakfastId).cost + mealById(dayPlan.lunchId).cost + mealById(dayPlan.dinnerId).cost).toFixed(2)} est.
                  </div>
                </div>
              </div>
            )}

            {/* Full week strip for judges */}
            <div className="mt-3 hidden gap-2 sm:grid sm:grid-cols-7">
              {week.days.map((d) => (
                <button key={d.day} onClick={() => setActiveDay(SHORT.indexOf(d.short))} className="rounded-2xl bg-white p-2 text-left ring-1 ring-[#7C9A82]/10 transition hover:ring-[#7C9A82]/40">
                  <p className="text-[11px] font-extrabold">{d.short}</p>
                  {[d.breakfastId, d.lunchId, d.dinnerId].map((id) => (
                    <img key={id} src={mealById(id).image} alt={mealById(id).name} title={mealById(id).name} className="mt-1 h-10 w-full rounded-lg object-cover" loading="lazy" />
                  ))}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 3 — nutrition */}
          <Card className="fade-up stagger-3">
            <SectionTitle eyebrow="Step 3 • Estimated nutrition" title="Planned daily nutrition" action={<SimulatedBadge />} />
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { l: "Calories", v: dailyAvg.cal, t: "1,800", pct: (dailyAvg.cal / 1800) * 100 },
                { l: "Protein", v: `${dailyAvg.protein}g`, t: "60g", pct: (dailyAvg.protein / 60) * 100 },
                { l: "Fiber", v: `${dailyAvg.fiber}g`, t: "28g", pct: (dailyAvg.fiber / 28) * 100 },
                { l: "Sugar", v: `${dailyAvg.sugar}g`, t: "<36g", pct: (dailyAvg.sugar / 36) * 100 },
              ].map((n) => (
                <div key={n.l} className="rounded-2xl bg-[#FAF8F3] p-3">
                  <p className="text-[16px] font-extrabold">{n.v}</p>
                  <p className="text-[11px] font-semibold text-stone-500">{n.l}</p>
                  <ProgressBar value={n.pct} className="mt-1.5 !h-1.5" />
                </div>
              ))}
            </div>
            <p className="mt-1 text-center text-[11px] font-semibold text-stone-400">Daily average across your 7-day plan • goal {`<60g protein shown as example`}</p>
            <p className="mt-2 flex items-start gap-1.5 text-[12px] leading-relaxed text-stone-500">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#7C9A82]" />
              Averaged from your planned 21 meals (~${dailyAvg.cost.toFixed(2)} est./day). High fiber + protein help steady blood sugar. Example estimates only — not medical advice.
            </p>
          </Card>

          {/* STEP 4 — grocery derived from plan */}
          <Card className="fade-up stagger-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBasket className="h-5 w-5 text-[#7C9A82]" />
                <h3 className="font-display text-[19px] font-semibold">Grocery list</h3>
              </div>
              <Pill tone="sage">${groceryEst.toFixed(2)} est. buy</Pill>
            </div>
            <p className="mt-1 flex items-center gap-1 text-[12px] text-stone-500"><Sparkles className="h-3.5 w-3.5 text-[#7C9A82]" /> Auto-derived from your 7-day plan • prices are estimates, not live store prices</p>
            <div className="mt-3 space-y-1.5">
              {grocery.map((g) => {
                const isChecked = checkedGrocery.includes(g.name);
                return (
                  <button key={g.name} onClick={() => toggleGrocery(g.name)} className={`flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition active:scale-[0.99] ${isChecked ? "bg-[#F2F6F2]/60 opacity-60" : "bg-[#FFFDF8] ring-1 ring-stone-100 hover:ring-[#7C9A82]/30"}`}>
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${isChecked ? "border-[#7C9A82] bg-[#7C9A82] text-white" : "border-stone-300"}`}>
                      {isChecked && <Check className="h-3.5 w-3.5" strokeWidth={3.5} />}
                    </span>
                    <span className="flex-1">
                      <span className={`block text-[13px] font-bold ${isChecked ? "line-through" : ""}`}>{g.name} <span className="ml-1 rounded-full bg-[#F4F0E6] px-1.5 py-0.5 text-[10px] font-bold text-stone-500">×{g.count} meals</span></span>
                      <span className="block text-[11px] text-stone-500">{g.qty} • {g.category} • est. price</span>
                    </span>
                    <span className="text-[13px] font-extrabold text-[#2f4534]">${g.price.toFixed(2)} est.</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 rounded-2xl bg-[#425345] p-4 text-white">
              <div className="flex justify-between text-[13px]">
                <span className="text-white/75">Items checked ({checkedCount}/{grocery.length})</span>
                <span className="font-bold">${grocery.filter((g) => checkedGrocery.includes(g.name)).reduce((s, g) => s + g.price, 0).toFixed(2)} est.</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-white/75">Planned meals cost (21 meals)</span>
                <span className="font-bold">${weeklyEst.toFixed(2)} est.</span>
              </div>
              <div className="mt-1 flex justify-between border-t border-white/20 pt-2 text-[13px] font-bold">
                <span>vs. ${weeklyBudget} budget</span>
                <span className={budgetLeft >= 0 ? "text-emerald-300" : "text-rose-300"}>{budgetLeft >= 0 ? `$${budgetLeft.toFixed(2)} left ✓` : `$${Math.abs(budgetLeft).toFixed(2)} over`}</span>
              </div>
            </div>
            <p className="mt-2 flex items-start gap-1.5 text-[11.5px] leading-relaxed text-stone-400">
              <Leaf className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Pantry staples (oils, spices) bought once stretch across weeks — weekly meal cost is the fair budget comparison. All prices are estimates for demo.
            </p>
          </Card>
        </>
      )}
    </div>
  );
}
