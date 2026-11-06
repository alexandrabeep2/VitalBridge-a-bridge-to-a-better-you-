import { useState } from "react";
import Header from "./components/Header";
import BottomNav, { type PageKey } from "./components/BottomNav";
import Dashboard from "./pages/Dashboard";
import MealPlanner from "./pages/MealPlanner";
import PantryScanner from "./pages/PantryScanner";
import Buddy from "./pages/Buddy";
import Progress from "./pages/Progress";
import Budget from "./pages/Budget";
import Rewards from "./pages/Rewards";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { BUDGET_DEFAULTS, WELLNESS_GOALS } from "./data/demoData";

export default function App() {
  const [page, setPage] = useState<PageKey>("dashboard");
  const [userName, setUserName, syncState] = useLocalStorage<string>("vb_username", "Jane Doe");
  const [weeklyBudget, setWeeklyBudget] = useLocalStorage<number>("vb_weekly_budget", BUDGET_DEFAULTS.weeklyGroceryBudget);
  const [goals] = useLocalStorage<Record<string, boolean>>("vb_goals", { walk: true, water: true });
  const [buddyUnread, setBuddyUnread] = useState(true);

  const go = (p: PageKey) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const allGoalsDone = WELLNESS_GOALS.every((g) => goals[g.id]);

  return (
    <div className="min-h-dvh bg-[#FAF8F3] bg-[radial-gradient(ellipse_at_top,rgba(124,154,130,0.12),transparent_55%)]">
      <Header userName={userName} setUserName={setUserName} syncState={syncState} />

      <main className="mx-auto w-full max-w-5xl px-4 pb-32 pt-5 sm:px-6">
        {/* Mobile name editor (visible on small screens) */}
        <div className="mb-4 flex items-center justify-between rounded-2xl bg-white px-4 py-2.5 shadow-sm ring-1 ring-[#7C9A82]/10 sm:hidden">
          <p className="text-[13px] text-stone-500">
            Cooking for <span className="font-bold text-[#2b332d]">{userName}</span>
          </p>
          <button
            onClick={() => {
              const next = prompt("What should we call you?", userName);
              if (next?.trim()) setUserName(next.trim());
            }}
            className="text-[12px] font-bold text-[#506656] underline decoration-[#7C9A82]/40 underline-offset-2"
          >
            Edit name
          </button>
        </div>

        <div key={page} className="page-enter">
          {page === "dashboard" && <Dashboard userName={userName} weeklyBudget={weeklyBudget} go={go} />}
          {page === "meals" && <MealPlanner weeklyBudget={weeklyBudget} setWeeklyBudget={setWeeklyBudget} go={go} />}
          {page === "scan" && <PantryScanner />}
          {page === "buddy" && <Buddy userName={userName} onRead={() => setBuddyUnread(false)} />}
          {page === "progress" && <Progress />}
          {page === "budget" && <Budget weeklyBudget={weeklyBudget} setWeeklyBudget={setWeeklyBudget} go={go} />}
          {page === "rewards" && <Rewards />}
        </div>

        <footer className="mt-10 rounded-3xl bg-white p-5 text-center shadow-sm ring-1 ring-[#7C9A82]/10">
          <p className="font-display text-[16px] font-semibold text-[#2b332d]">
            Vital<span className="text-[#7C9A82]">Bridge</span> 💚
          </p>
          <p className="font-display text-[11px] italic text-[#7C9A82]">a bridge to a better you</p>
          <p className="mx-auto mt-1.5 max-w-md text-[11.5px] leading-relaxed text-stone-500">
            Demo v1 — local sample data + browser storage, synced to server database (simulated). AI replies are keyword-matched simulations. Example health data only. Not a medical device — consult a professional for diagnosis or treatment.
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {(["dashboard", "meals", "scan", "buddy", "progress", "budget", "rewards"] as PageKey[]).map((p) => (
              <button
                key={p}
                onClick={() => go(p)}
                className={`rounded-full px-3 py-1 text-[11px] font-bold capitalize transition ${page === p ? "bg-[#425345] text-white" : "bg-[#F4F0E6] text-stone-500 hover:bg-[#E9E2D2]"}`}
              >
                {p === "meals" ? "Meal Planner" : p === "scan" ? "Pantry Scan" : p}
              </button>
            ))}
          </div>
        </footer>
      </main>

      <BottomNav active={page} onChange={go} buddyUnread={buddyUnread && page !== "buddy"} rewardsGlow={allGoalsDone} />
    </div>
  );
}
