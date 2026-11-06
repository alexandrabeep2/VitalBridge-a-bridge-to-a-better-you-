import { useRef, useState } from "react";
import {
  Camera, ImagePlus, ScanLine, Sparkles, RefreshCw,
  CheckCircle2, AlertTriangle, ChefHat, X,
} from "lucide-react";
import { Card, SimulatedBadge, ExampleDataBadge } from "../components/ui";
import { SAMPLE_PANTRY_RESULTS } from "../data/demoData";

type Ingredient = {
  name: string;
  confidence: number;
  health: "Excellent" | "Limit" | "Moderate";
  note: string;
  emoji: string;
};

const SAMPLE_RECIPE = {
  name: "Black Bean & Brown Rice Bowl",
  description:
    "Uses 3 scanned staples, $2.10/serving, 12g fiber. Add frozen broccoli on the side for extra volume. High fiber + protein help keep glucose steady.",
};

const SAMPLE_URLS = [
  "https://images.unsplash.com/photo-1584473457409-cee0b27f4b0f?w=800&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=70&auto=format&fit=crop",
];

export default function PantryScanner() {
  const [previews, setPreviews] = useState<string[]>([]);
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<Ingredient[] | null>(null);
  const [recipe, setRecipe] = useState<{ name: string; description: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const urls: string[] = [];
    Array.from(files).slice(0, 4 - previews.length).forEach((f) => {
      if (f.type.startsWith("image/")) urls.push(URL.createObjectURL(f));
    });
    if (!urls.length) return;
    setPreviews((p) => [...p, ...urls].slice(0, 4));
    setResults(null);
    setRecipe(null);
  };

  const useSampleImages = () => {
    setPreviews(SAMPLE_URLS);
    setResults(null);
    setRecipe(null);
  };

  const removeAt = (index: number) => {
    setPreviews((old) => old.filter((_, j) => j !== index));
    setResults(null);
    setRecipe(null);
  };

  const runScan = () => {
    if (!previews.length) return;
    setScanning(true);
    setResults(null);
    setRecipe(null);
    setTimeout(() => {
      setScanning(false);
      setResults(SAMPLE_PANTRY_RESULTS as Ingredient[]);
      setRecipe(SAMPLE_RECIPE);
    }, 2200);
  };

  const clear = () => {
    setPreviews([]);
    setResults(null);
    setRecipe(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const excellent = results?.filter((r) => r.health === "Excellent") ?? [];
  const moderate = results?.filter((r) => r.health === "Moderate") ?? [];
  const limit = results?.filter((r) => r.health === "Limit") ?? [];

  return (
    <div className="space-y-5">
      <div className="fade-up">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#7C9A82]">Pantry scanner</p>
        <h1 className="font-display text-[28px] font-semibold tracking-tight">What's in your kitchen? 📸</h1>
        <p className="mt-1 text-[13.5px] text-stone-500">
          Snap a photo — we'll spot diabetes-friendly staples &amp; smart swaps. <ExampleDataBadge />
        </p>
      </div>

      {/* Upload zone */}
      <Card className="fade-up stagger-1 !p-4">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
        />
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          className={`cursor-pointer rounded-3xl border-2 border-dashed p-6 text-center transition-all duration-300 ${dragOver ? "scale-[1.01] border-[#7C9A82] bg-[#F2F6F2]" : previews.length ? "border-[#7C9A82]/30 bg-[#F2F6F2]/40" : "border-[#7C9A82]/30 bg-gradient-to-b from-[#F2F6F2]/60 to-white hover:border-[#7C9A82]/60 hover:bg-[#F2F6F2]/60"}`}
        >
          {previews.length === 0 ? (
            <>
              <div className="pulse-soft mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[#7C9A82] to-[#425345] text-white shadow-lg">
                <Camera className="h-7 w-7" />
              </div>
              <p className="mt-3 text-[15px] font-bold">Tap to upload or drag photos here</p>
              <p className="mt-1 text-[12.5px] text-stone-500">Pantry shelf, fridge, or grocery haul — JPG/PNG up to 4 photos</p>
              <div className="mt-4 flex justify-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-[#425345] px-4 py-2 text-[13px] font-bold text-white"><ImagePlus className="h-4 w-4" /> Upload photos</span>
                <span className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-bold text-[#3d5a43] ring-1 ring-[#7C9A82]/25"><ScanLine className="h-4 w-4" /> Use sample</span>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2.5">
                {previews.map((src, i) => (
                  <div key={`${src}-${i}`} className="page-enter relative overflow-hidden rounded-2xl shadow ring-1 ring-black/5">
                    <img src={src} alt={`Upload ${i + 1}`} className="h-36 w-full object-cover sm:h-44" />
                    {scanning && (
                      <>
                        <div className="shimmer absolute inset-0 opacity-60" />
                        <div className="scan-line absolute inset-x-3 h-0.5 rounded-full bg-[#7C9A82] shadow-[0_0_16px_rgba(124,154,130,0.9)]" />
                        <div className="absolute inset-3 rounded-xl border-2 border-[#7C9A82]/70" />
                      </>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); removeAt(i); }}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/75"
                      aria-label="Remove photo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <span className="absolute bottom-2 left-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                      Photo {i + 1}
                    </span>
                  </div>
                ))}
                {previews.length < 4 && (
                  <button onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }} className="flex h-36 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-[#7C9A82]/30 text-[#506656] transition hover:bg-white sm:h-44">
                    <ImagePlus className="h-6 w-6" /><span className="text-[12px] font-bold">Add more</span>
                  </button>
                )}
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); runScan(); }}
                  disabled={scanning}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#7C9A82] py-3 text-[14px] font-bold text-white shadow-lg shadow-[#7C9A82]/30 transition hover:bg-[#64806a] active:scale-[0.98] disabled:opacity-70"
                >
                  {scanning
                    ? (<><RefreshCw className="h-4 w-4 animate-spin" /> Analyzing…</>)
                    : (<><Sparkles className="h-4 w-4" /> Scan {previews.length} photo{previews.length > 1 ? "s" : ""}</>)}
                </button>
                <button onClick={(e) => { e.stopPropagation(); clear(); }} className="rounded-2xl bg-white px-4 py-3 text-[13px] font-bold text-stone-500 ring-1 ring-stone-200 transition hover:bg-stone-50">Clear</button>
              </div>
            </>
          )}
        </div>

        {previews.length === 0 && (
          <button
            onClick={useSampleImages}
            className="mt-3 w-full rounded-2xl bg-[#F4F0E6] py-2.5 text-[13px] font-bold text-[#5a6a5e] transition hover:bg-[#E9E2D2] active:scale-[0.99]"
          >
            ✨ No photo handy? Try with sample pantry images
          </button>
        )}
      </Card>

      {/* Scanning state */}
      {scanning && (
        <Card className="page-enter">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8EFE9]"><ScanLine className="h-5 w-5 animate-pulse text-[#506656]" /></span>
            <div className="flex-1">
              <p className="text-[14px] font-bold">Simulated AI is reading your pantry…</p>
              <p className="text-[12px] text-stone-500">Identifying ingredients • checking fiber &amp; sugar • finding recipes</p>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {["Detecting items", "Scoring for glucose-friendliness", "Matching budget recipes"].map((s, i) => (
              <div key={s} className="flex items-center gap-2 text-[13px] font-medium text-stone-600">
                <span className={`h-2 w-2 rounded-full ${i === 0 ? "bg-[#7C9A82]" : "animate-pulse bg-stone-200"}`} /> {s}{i === 0 ? " ✓" : "…"}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Results */}
      {results && !scanning && (
        <div className="page-enter space-y-4">
          <Card className="border-2 !border-[#7C9A82]/25 bg-gradient-to-br from-white to-[#F2F6F2]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#3d7a4c]" />
                <h3 className="font-display text-[19px] font-semibold">Found {results.length} ingredients</h3>
              </div>
              <SimulatedBadge />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-[#7C9A82] p-3 text-center text-white">
                <p className="text-[22px] font-extrabold">{excellent.length}</p>
                <p className="text-[11px] font-semibold text-white/85">Excellent</p>
              </div>
              <div className="rounded-2xl bg-sky-100 p-3 text-center">
                <p className="text-[22px] font-extrabold text-sky-800">{moderate.length}</p>
                <p className="text-[11px] font-semibold text-sky-700">Okay</p>
              </div>
              <div className="rounded-2xl bg-amber-100 p-3 text-center">
                <p className="text-[22px] font-extrabold text-amber-800">{limit.length}</p>
                <p className="text-[11px] font-semibold text-amber-700">Moderation</p>
              </div>
            </div>
          </Card>

          {excellent.length > 0 && (
            <div>
              <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.12em] text-[#3d5a4c]">✓ Pantry wins — build meals around these</p>
              <div className="space-y-2">
                {excellent.map((r) => (
                  <div key={r.name} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-[#7C9A82]/15">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F2F6F2] text-[22px]">{r.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-bold">{r.name} <span className="ml-1 rounded-full bg-[#E8EFE9] px-1.5 py-0.5 text-[10px] font-bold text-[#3d5a43]">{r.confidence}%</span></p>
                      <p className="text-[12px] text-stone-500">{r.note}</p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-[#7C9A82]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {moderate.length > 0 && (
            <div>
              <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.12em] text-sky-700">○ Solid staples — pair with veg + protein</p>
              <div className="space-y-2">
                {moderate.map((r) => (
                  <div key={r.name} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-sky-200">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-[22px]">{r.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-bold">{r.name} <span className="ml-1 rounded-full bg-sky-100 px-1.5 py-0.5 text-[10px] font-bold text-sky-700">{r.confidence}%</span></p>
                      <p className="text-[12px] text-stone-500">{r.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {limit.length > 0 && (
            <div>
              <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.12em] text-amber-600">⚠ Smart swaps</p>
              <div className="space-y-2">
                {limit.map((r) => (
                  <div key={r.name} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-amber-200">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-[22px]">{r.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-bold">{r.name} <span className="ml-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">{r.confidence}%</span></p>
                      <p className="text-[12px] text-stone-500">{r.note}</p>
                    </div>
                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <Card className="bg-gradient-to-br from-[#425345] to-[#506656] !text-white">
            <div className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              <p className="font-display text-[17px] font-semibold">You can make tonight:</p>
            </div>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/90">
              {recipe ? `${recipe.name} — ${recipe.description}` : "No recipe suggestion available."}
            </p>
            <div className="mt-3 flex gap-2">
              <button className="flex-1 rounded-xl bg-white py-2.5 text-[13px] font-bold text-[#2f4534] transition active:scale-[0.98]">View recipe</button>
              <button className="flex-1 rounded-xl border border-white/40 py-2.5 text-[13px] font-bold text-white transition hover:bg-white/10">More ideas</button>
            </div>
            <p className="mt-2.5 text-center text-[11px] text-white/60">Sample suggestion • Example data — not a medical assessment</p>
          </Card>
        </div>
      )}

      {!results && !scanning && previews.length === 0 && (
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { e: "🫘", l: "Beans & lentils" },
            { e: "🥦", l: "Frozen veg" },
            { e: "🥣", l: "Whole grains" },
          ].map((t) => (
            <div key={t.l} className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-[#7C9A82]/10">
              <p className="text-[26px]">{t.e}</p>
              <p className="mt-1 text-[11px] font-bold text-stone-600">{t.l}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
