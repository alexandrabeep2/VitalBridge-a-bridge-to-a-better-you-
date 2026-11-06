export const DEMO_USER = {
  name: "Jane Doe",
  campus: "Riverside Community College",
  program: "Sophomore • Public Health",
  memberSince: "Aug 2026",
  streakDays: 12,
  riskFocus: "Prevention",
  avatarInitials: "JD",
};

export const WELLNESS_GOALS = [
  { id: "walk", label: "Walk 6,000 steps", detail: "Between classes • 45 min", points: 20, icon: "footprints" },
  { id: "water", label: "Drink 6 glasses of water", detail: "48 oz • refill bottle 3×", points: 15, icon: "droplet" },
  { id: "veggie", label: "Eat 2 veggie servings", detail: "Fresh, frozen or canned", points: 20, icon: "salad" },
  { id: "sleep", label: "Wind down by 11pm", detail: "7–8 hrs for glucose control", points: 15, icon: "moon" },
  { id: "sugar", label: "No sugary drinks today", detail: "Swap soda for citrus water", points: 30, icon: "cup" },
];

export const ACTIVITY_WEEK = [
  { day: "Mon", steps: 4820, activeMin: 22, water: 5 },
  { day: "Tue", steps: 7340, activeMin: 41, water: 6 },
  { day: "Wed", steps: 5210, activeMin: 28, water: 4 },
  { day: "Thu", steps: 8910, activeMin: 55, water: 7 },
  { day: "Fri", steps: 6480, activeMin: 35, water: 6 },
  { day: "Sat", steps: 9230, activeMin: 62, water: 8 },
  { day: "Sun", steps: 6105, activeMin: 31, water: 5 },
];

export const HEALTH_METRICS = [
  { id: "glucose", label: "Fasting glucose", value: "94", unit: "mg/dL", range: "70–99 normal", status: "good", trend: "-3 this week" },
  { id: "weight", label: "Weight", value: "152.4", unit: "lbs", range: "Goal 148 lbs", status: "steady", trend: "-0.8 lbs" },
  { id: "sleep", label: "Sleep avg", value: "7.2", unit: "hrs", range: "Target 7–9 hrs", status: "good", trend: "+0.4 hrs" },
  { id: "a1c", label: "Est. A1C", value: "5.5", unit: "%", range: "< 5.7% normal", status: "good", trend: "stable" },
];

export type Meal = {
  id: string;
  name: string;
  tag: string;
  time: string;
  cost: number;
  calories: number;
  protein: number;
  carbs: number;
  fiber: number;
  sugar: number;
  image: string;
  ingredients: string[];
  prepMin: number;
  diabetesNote: string;
};

export const MEALS: Meal[] = [
  {
    id: "oats",
    name: "Overnight Peanut Butter Oats",
    tag: "Breakfast",
    time: "5 min prep",
    cost: 1.35,
    calories: 380,
    protein: 14,
    carbs: 52,
    fiber: 9,
    sugar: 8,
    image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=600&q=80&auto=format&fit=crop",
    ingredients: ["Rolled oats", "Peanut butter", "Banana", "Chia seeds", "Low-fat milk"],
    prepMin: 5,
    diabetesNote: "High fiber slows glucose spikes. No added sugar.",
  },
  {
    id: "bowl",
    name: "Black Bean & Brown Rice Bowl",
    tag: "Lunch",
    time: "20 min",
    cost: 2.10,
    calories: 460,
    protein: 17,
    carbs: 68,
    fiber: 12,
    sugar: 5,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80&auto=format&fit=crop",
    ingredients: ["Brown rice", "Black beans", "Corn", "Salsa", "Cabbage slaw"],
    prepMin: 20,
    diabetesNote: "Beans + whole grain = steady energy for afternoon classes.",
  },
  {
    id: "stirfry",
    name: "Frozen Veggie Chicken Stir-Fry",
    tag: "Dinner",
    time: "18 min",
    cost: 2.85,
    calories: 420,
    protein: 28,
    carbs: 42,
    fiber: 7,
    sugar: 6,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80&auto=format&fit=crop",
    ingredients: ["Chicken thigh", "Frozen stir-fry blend", "Soy sauce (low-sodium)", "Brown rice", "Garlic"],
    prepMin: 18,
    diabetesNote: "Lean protein + non-starchy veg keeps evening glucose stable.",
  },
  {
    id: "lentil",
    name: "Red Lentil & Carrot Soup",
    tag: "Dinner",
    time: "25 min",
    cost: 1.65,
    calories: 340,
    protein: 15,
    carbs: 55,
    fiber: 11,
    sugar: 7,
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80&auto=format&fit=crop",
    ingredients: ["Red lentils", "Carrots", "Onion", "Cumin", "Vegetable broth"],
    prepMin: 25,
    diabetesNote: "Batch-friendly. Makes 4 servings under $7 total.",
  },
  {
    id: "tuna",
    name: "Tuna & White Bean Wrap",
    tag: "Lunch",
    time: "10 min",
    cost: 1.95,
    calories: 390,
    protein: 24,
    carbs: 48,
    fiber: 8,
    sugar: 3,
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&q=80&auto=format&fit=crop",
    ingredients: ["Whole-wheat tortilla", "Canned tuna", "White beans", "Greek yogurt", "Spinach"],
    prepMin: 10,
    diabetesNote: "Dorm-friendly, no stove needed.",
  },
  {
    id: "egg",
    name: "Veggie Scramble + Toast",
    tag: "Breakfast",
    time: "12 min",
    cost: 1.20,
    calories: 320,
    protein: 16,
    carbs: 32,
    fiber: 6,
    sugar: 4,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80&auto=format&fit=crop",
    ingredients: ["Eggs", "Frozen peppers & onions", "Whole-wheat toast", "Black pepper"],
    prepMin: 12,
    diabetesNote: "Protein-forward start prevents mid-morning crash.",
  },
];

export const GROCERY_LIST = [
  { id: "g1", item: "Rolled oats (42 oz canister)", qty: "1", price: 4.28, store: "Aldi", checked: true, category: "Pantry" },
  { id: "g2", item: "Brown rice (2 lb bag)", qty: "1", price: 2.48, store: "Aldi", checked: true, category: "Pantry" },
  { id: "g3", item: "Black beans, canned (4×)", qty: "4 cans", price: 3.16, store: "Dollar General", checked: false, category: "Canned" },
  { id: "g4", item: "Frozen stir-fry blend (2 lb)", qty: "2 bags", price: 4.96, store: "Walmart", checked: false, category: "Frozen" },
  { id: "g5", item: "Chicken thighs (3 lb family pack)", qty: "1 pack", price: 5.97, store: "Walmart", checked: false, category: "Protein" },
  { id: "g6", item: "Bananas", qty: "6 ct", price: 1.44, store: "Aldi", checked: false, category: "Produce" },
  { id: "g7", item: "Baby spinach (5 oz)", qty: "1 box", price: 2.98, store: "Aldi", checked: false, category: "Produce" },
  { id: "g8", item: "Red lentils (1 lb)", qty: "1 bag", price: 1.89, store: "Aldi", checked: false, category: "Pantry" },
  { id: "g9", item: "Canned tuna in water (4×)", qty: "4 cans", price: 3.76, store: "Dollar General", checked: false, category: "Canned" },
  { id: "g10", item: "Whole-wheat tortillas (8 ct)", qty: "1 pack", price: 2.24, store: "Walmart", checked: false, category: "Bakery" },
];

export const BUDGET_DEFAULTS = {
  monthlyIncome: 1250,
  incomeSources: [
    { id: "job", label: "Part-time campus job", amount: 780 },
    { id: "aid", label: "Family support / aid", amount: 320 },
    { id: "side", label: "Weekend gig", amount: 150 },
  ],
  fixedExpenses: [
    { id: "rent", label: "Rent share", amount: 450 },
    { id: "transit", label: "Bus pass", amount: 45 },
    { id: "phone", label: "Phone", amount: 35 },
    { id: "school", label: "Supplies / fees", amount: 60 },
  ],
  groceryHistory: [52, 48, 61, 44, 57, 49, 54, 46],
  weeklyGroceryBudget: 45,
};

export const SAMPLE_PANTRY_RESULTS = [
  { name: "Brown rice", confidence: 98, health: "Excellent", note: "Whole grain • low glycemic", emoji: "🍚" },
  { name: "Black beans (canned)", confidence: 94, health: "Excellent", note: "High fiber • rinse to cut sodium 40%", emoji: "🫘" },
  { name: "Frozen broccoli blend", confidence: 91, health: "Excellent", note: "Non-starchy • great for glucose", emoji: "🥦" },
  { name: "Oats", confidence: 89, health: "Excellent", note: "Beta-glucan fiber steadies sugar", emoji: "🥣" },
  { name: "Soda (cola, 2L)", confidence: 96, health: "Limit", note: "65g sugar — swap for citrus water", emoji: "🥤" },
  { name: "Instant ramen (3 pack)", confidence: 87, health: "Limit", note: "High sodium • pair with veg + egg", emoji: "🍜" },
];

export type ChatMessage = {
  id: string;
  role: "user" | "buddy";
  text: string;
  time: string;
};

export const STARTER_CHATS: ChatMessage[] = [
  { id: "c1", role: "user", text: "Hey! I'm on a tight budget. How do I eat healthy without spending a lot? 🛒", time: "9:02 AM" },
  {
    id: "c2",
    role: "buddy",
    text: "Great question! My top 3 budget wins for steady energy: 1) Dry beans + lentils ($0.30/serving), 2) Frozen veggies (just as nutritious as fresh!), 3) Oats + peanut butter breakfasts. Want me to build a $45/week plan around what you already have?",
    time: "9:02 AM",
  },
  { id: "c3", role: "user", text: "Yes please — and I don't have much time between classes.", time: "9:04 AM" },
  {
    id: "c4",
    role: "buddy",
    text: "Perfect — I'll keep everything to 20 min or less with minimal dishes. Tuna-white bean wraps, overnight oats, and a big-batch lentil soup will cover you. Tip: a 10-min walk after lunch can lower your glucose spike by up to 30%. Want a 7-day walking plan too?",
    time: "9:04 AM",
  },
];

export function simulatedReply(input: string): string {
  const t = input.toLowerCase();
  if (t.includes("budget") || t.includes("cheap") || t.includes("afford") || t.includes("money") || t.includes("cost") || t.includes("$")) {
    return "Absolutely — eating for prevention on a budget is my specialty! 💚 With your ~$45/week grocery budget, focus on: frozen produce, dry beans/lentils, oats, brown rice, eggs, and canned tuna. That's ~$1.50–$2.50 per diabetes-friendly meal. I updated your Meal Planner with 3 new picks under $2. Want me to make a full $35 emergency-week version?";
  }
  if (t.includes("exercise") || t.includes("workout") || t.includes("walk") || t.includes("gym") || t.includes("active") || t.includes("run")) {
    return "You don't need a gym! For Type 2 prevention, the CDC shows 150 min/week of brisk walking cuts risk by ~58%. Try: 10-min walks after meals (best for glucose!), bodyweight circuits in your dorm, and taking stairs. I logged a starter streak for you — 22 min today counts! Want a no-equipment 15-min routine?";
  }
  if (t.includes("sugar") || t.includes("soda") || t.includes("diabetes") || t.includes("glucose") || t.includes("a1c") || t.includes("carb")) {
    return "Smart to ask! For prevention, think *steady* not *perfect*: pair carbs with fiber + protein (e.g., rice + beans + veg), swap soda for sparkling water + lime, and aim for half-plate non-starchy veg. Your example fasting glucose of 94 mg/dL is in the normal range — keep up daily walks + sleep. This is general info only, not medical advice — check with campus health for personal guidance. 💚";
  }
  if (t.includes("meal") || t.includes("recipe") || t.includes("eat") || t.includes("food") || t.includes("dinner") || t.includes("lunch") || t.includes("breakfast") || t.includes("snack")) {
    return "Here's a tasty today-plan (~$5.40 total!): 🥣 Breakfast — overnight peanut butter oats ($1.35), 🫘 Lunch — black bean & brown rice bowl ($2.10), 🍲 Dinner — red lentil soup, batch 4 servings ($1.65). All high-fiber, 30g+ protein at lunch/dinner, and under 10g added sugar. Check the Meal Planner tab for full nutrition + grocery list!";
  }
  if (t.includes("water") || t.includes("drink") || t.includes("sleep") || t.includes("stress") || t.includes("tired")) {
    return "Hydration + sleep are glucose superpowers! 💧 Aim for 6–8 glasses of water (your bottle = 24oz, so 3 refills). For sleep, a consistent 11pm wind-down keeps morning glucose steadier — even 30 extra minutes helps. I see you're averaging 7.2 hrs — lovely progress, Jane! Want a bedtime reminder set?";
  }
  if (t.includes("pantry") || t.includes("scan") || t.includes("photo") || t.includes("ingredient")) {
    return "Yes! Snap anything in your pantry or fridge with the Pantry Scanner 📸 and I'll flag what's great for glucose (beans, oats, frozen veg) vs. what to enjoy in smaller portions (soda, instant ramen). Last scan found 4 excellent staples in your kitchen — want recipe ideas from those?";
  }
  if (t.includes("spend") || t.includes("income") || t.includes("wallet") || t.includes("saving")) {
    return "I peeked at your Smart Budget (with permission!): you're spending ~$51/week on groceries against a $45 target — frozen swaps + one batch-cook day could save ~$24/month. Your savings rate is ~28%, which is fantastic on a student income! Want me to re-tailor your meal plan to hit $40/week?";
  }
  if (t.includes("hi") || t.includes("hello") || t.includes("hey") || t.includes("thanks") || t.includes("thank")) {
    return "Hey Jane! 💚 So glad you're here. I'm your prevention buddy — ask me about affordable meals, quick dorm workouts, understanding glucose, or making your grocery budget stretch. What's on your mind today?";
  }
  return "Love that you're thinking about this! 💚 Here's my take: small, consistent habits beat perfect ones — a daily 15-min walk, one veggie-packed meal, and water instead of soda cover ~80% of prevention. Tell me more — are you curious about meals, movement, budget tips, or understanding diabetes risk? (Reminder: I'm a simulated demo companion, not a medical professional.)";
}

export const QUICK_PROMPTS = [
  "Cheap healthy meals?",
  "Quick dorm workouts",
  "Lower my sugar intake",
  "Stretch my $45 budget",
];
