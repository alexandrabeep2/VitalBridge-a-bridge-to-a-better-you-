import { Wallet, ArrowRight, Info, Calculator } from "lucide-react";
import { Card, ExampleDataBadge } from "../components/ui";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { PageKey } from "../components/BottomNav";

export default function Budget({ weeklyBudget, setWeeklyBudget, go }: { weeklyBudget: number; setWeeklyBudget: (n: number) => void; go: (p: PageKey) => void }) {
  // Simple, honest inputs — example numbers, fully editable. Not a full finance app.
  const [monthlyIncome, setMonthlyIncome] = useLocalStorage<number>("vb_monthly_income", 1250);
  const [monthlyBills, setMonthlyBills] = useLocalStorage<number>("vb_monthly_bills", 590);

  const maxWeekly = Math.max(0, monthlyIncome / 4);
  const sliderValue = Math.min(weeklyBudget, maxWeekly);
  const monthlyGrocery = weeklyBudget * 4.33;
  const remaining = monthlyIncome - monthlyBills - monthlyGrocery;

  const money = (n: number) =>
    n.toLocaleString([], { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-5">
      <div className="fade-up">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#7C9A82]">VitalBridge — Food Budget Planner</p>
        <h1 className="font-display text-[28px] font-semibold tracking-tight">Can I afford to eat well? 💰</h1>
        <p className="mt-1 text-[13.5px] text-stone-500">
          Enter what you have, pick a weekly food budget, then plan meals that fit. <ExampleDataBadge />
        </p>
      </div>

      {/* Steps */}
      <div className="fade-up stagger-1 grid grid-cols-4 gap-1.5">
        {["Enter income", "Enter bills", "Pick food budget", "Plan meals"].map((s, i) => (
          <div key={s} className="rounded-2xl bg-white p-2 text-center ring-1 ring-[#7C9A82]/10">
            <p className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-[#E8EFE9] text-[12px] font-extrabold text-[#2f4534]">{i + 1}</p>
            <p className="mt-1 text-[10px] font-bold leading-tight text-stone-600">{s}</p>
          </div>
        ))}
      </div>

      {/* Inputs */}
      <Card className="fade-up stagger-2">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="rounded-2xl bg-[#FAF8F3] p-3.5 ring-1 ring-stone-200/70 focus-within:ring-[#7C9A82]">
            <span className="text-[12px] font-bold text-stone-500">1 • Monthly income ($)</span>
            <span className="mt-1 flex items-center gap-1">
              <span className="text-[18px] font-extrabold text-stone-400">$</span>
              <input
                type="number"
                value={monthlyIncome}
                min={0}
                max={10000}
                onChange={(e) => {
                  const next = Math.max(0, Number(e.target.value) || 0);
                  setMonthlyIncome(next);
                  const nextMax = next / 4;
                  if (weeklyBudget > nextMax) setWeeklyBudget(Math.floor(nextMax));
                }}
                className="w-full bg-transparent text-[22px] font-extrabold text-[#2b332d] outline-none"
              />
            </span>
            <span className="text-[11px] text-stone-400">Example: campus job + support. Edit to match you.</span>
          </label>
          <label className="rounded-2xl bg-[#FAF8F3] p-3.5 ring-1 ring-stone-200/70 focus-within:ring-[#7C9A82]">
            <span className="text-[12px] font-bold text-stone-500">2 • Monthly bills ($)</span>
            <span className="mt-1 flex items-center gap-1">
              <span className="text-[18px] font-extrabold text-stone-400">$</span>
              <input
                type="number"
                value={monthlyBills}
                min={0}
                max={10000}
                onChange={(e) => setMonthlyBills(Math.max(0, Number(e.target.value) || 0))}
                className="w-full bg-transparent text-[22px] font-extrabold text-[#2b332d] outline-none"
              />
            </span>
            <span className="text-[11px] text-stone-400">Example: rent + transit + phone. Edit to match you.</span>
          </label>
        </div>

        <div className="mt-4 rounded-2xl bg-gradient-to-br from-white to-[#F2F6F2] p-4 ring-1 ring-[#7C9A82]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7C9A82] text-white"><Wallet className="h-4 w-4" /></span>
              <p className="text-[14px] font-bold">3 • Weekly food budget</p>
            </div>
            <p className="text-[24px] font-extrabold text-[#2f4534]">${weeklyBudget}</p>
          </div>
          <input
            type="range" min={0} max={maxWeekly} step={1} value={sliderValue}
            onChange={(e) => setWeeklyBudget(Math.max(0, Math.min(maxWeekly, Number(e.target.value))))}
            className="sage-range mt-3 w-full"
            style={{ ["--fill" as any]: `${maxWeekly > 0 ? (sliderValue / maxWeekly) * 100 : 0}%` }}
          />
          <div className="mt-1 flex justify-between text-[11px] font-bold text-stone-400"><span>$0 minimum</span><span>${maxWeekly.toFixed(0)} maximum (income ÷ 4)</span></div>
          <p className="mt-2 text-[12px] text-stone-500">
            This target controls what the Meal Planner can spend. Min is $0, max is your monthly income ÷ 4. Lower it for survival mode, raise it for more variety.
          </p>
        </div>
      </Card>

      {/* Result */}
      <div className="fade-up stagger-3 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#425345] via-[#506656] to-[#7C9A82] p-6 text-white shadow-[0_12px_40px_rgba(66,83,69,0.3)]">
        <div className="flex items-center gap-2 text-white/80">
          <Calculator className="h-4 w-4" />
          <p className="text-[12px] font-bold uppercase tracking-[0.12em]">Estimated monthly money remaining</p>
        </div>
        <p className="font-display mt-1 text-[42px] font-bold leading-none">${money(remaining)}</p>
        <p className="mt-1.5 text-[12.5px] text-white/80">After entered bills and estimated grocery spending, before other expenses</p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-[13px] sm:grid-cols-4">
          <div className="rounded-2xl bg-white/15 p-2.5 backdrop-blur">
            <p className="text-[11px] text-white/70">Monthly income</p>
            <p className="font-extrabold">${money(monthlyIncome)}</p>
          </div>
          <div className="rounded-2xl bg-white/15 p-2.5 backdrop-blur">
            <p className="text-[11px] text-white/70">Monthly bills</p>
            <p className="font-extrabold">−${money(monthlyBills)}</p>
          </div>
          <div className="rounded-2xl bg-white/15 p-2.5 backdrop-blur">
            <p className="text-[11px] text-white/70">Monthly groceries</p>
            <p className="font-extrabold">−${money(monthlyGrocery)}</p>
          </div>
          <div className="rounded-2xl bg-white p-2.5">
            <p className="text-[11px] font-bold text-stone-500">Money remaining</p>
            <p className="font-extrabold text-[#2f4534]">${money(remaining)}</p>
          </div>
        </div>
        <p className="mt-3 font-mono text-center text-[12px] text-white/70">
          {monthlyIncome.toLocaleString()} − {monthlyBills.toLocaleString()} − {monthlyGrocery.toFixed(0)} = {remaining.toFixed(0)}
        </p>
        <p className="mt-2 text-center text-[11px] italic leading-relaxed text-white/60">
          *Estimate assumes one grocery item at $4.33 minimum (weekly budget × 4.33 weeks/month).
        </p>
      </div>

      <div className="fade-up stagger-4 rounded-2xl border border-dashed border-[#7C9A82]/30 bg-[#F2F6F2]/70 p-3.5 text-[12.5px] leading-relaxed text-[#506656]">
        <span className="font-bold">Not total savings.</span> This is simply what's left after the bills and groceries you entered —
        transport, fun, and emergencies aren't included. Use it to sanity-check your food budget, not as a savings plan.
      </div>

      {/* Step 4 */}
      <Card className="fade-up stagger-4">
        <p className="text-[14px] font-bold">4 • Send it to the Meal Planner →</p>
        <p className="mt-1 text-[12.5px] text-stone-500">Your ${weeklyBudget}/week target becomes the spending cap for the 7-day sample plan, nutrition estimates, and derived grocery list.</p>
        <button onClick={() => go("meals")} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-[#7C9A82] py-3.5 text-[14px] font-bold text-white shadow-lg shadow-[#7C9A82]/25 transition hover:bg-[#64806a] active:scale-[0.98]">
          Use ${weeklyBudget}/week in Meal Planner <ArrowRight className="h-4 w-4" />
        </button>
        <p className="mt-2.5 flex items-start gap-1.5 text-[11.5px] text-stone-400">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Example student numbers shown — replace with your own. Buddy is a simulated demo companion, not a financial adviser.
        </p>
      </Card>
    </div>
  );
}
