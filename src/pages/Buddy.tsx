import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Leaf, RotateCcw } from "lucide-react";
import { SimulatedBadge } from "../components/ui";
import { STARTER_CHATS, QUICK_PROMPTS, simulatedReply, type ChatMessage } from "../data/demoData";
import { useLocalStorage } from "../hooks/useLocalStorage";

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function Buddy({ userName, onRead }: { userName: string; onRead: () => void }) {
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>("vb_chat", STARTER_CHATS);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    onRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean || typing) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", text: clean, time: timeNow() };
    setMessages([...messages, userMsg]);
    setInput("");
    setTyping(true);
    const reply = simulatedReply(clean);
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: `b-${Date.now()}`, role: "buddy", text: reply, time: timeNow() }]);
      setTyping(false);
    }, 1400 + Math.min(1200, reply.length * 3));
  };

  const reset = () => {
    setMessages(STARTER_CHATS);
  };

  return (
    <div className="fade-up flex flex-col" style={{ height: "calc(100dvh - 210px)", minHeight: 480 }}>
      {/* Buddy header */}
      <div className="overflow-hidden rounded-[26px] bg-gradient-to-br from-[#425345] via-[#506656] to-[#7C9A82] p-4 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-[24px] backdrop-blur">🌱</div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-[#506656]" />
          </div>
          <div className="flex-1">
            <p className="flex items-center gap-1.5 text-[15px] font-bold">Vital Buddy <Sparkles className="h-3.5 w-3.5 text-emerald-200" /></p>
            <p className="text-[12px] text-white/75">Prevention coach for {userName.split(" ")[0]} • replies instantly</p>
          </div>
          <button onClick={reset} title="Reset demo chat" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25 active:scale-90">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-black/15 px-3 py-2 backdrop-blur">
          <SimulatedBadge />
          <span className="text-[10.5px] font-medium text-white/70">Keyword-matched demo • no real AI yet</span>
        </div>
      </div>

      {/* Messages */}
      <div className="nice-scroll mt-3 flex-1 space-y-3 overflow-y-auto rounded-[26px] bg-white p-4 shadow-[0_2px_24px_rgba(90,110,90,0.08)] ring-1 ring-[#7C9A82]/10">
        <div className="rounded-2xl border border-dashed border-[#7C9A82]/30 bg-[#F2F6F2]/70 p-3 text-center text-[12px] leading-relaxed text-[#506656]">
          <span className="font-bold">Welcome, {userName.split(" ")[0]}! 💚</span> Ask about affordable eating, quick exercise, or Type 2 prevention. Sample conversation shown — general info only, not medical advice.
        </div>
        {messages.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="page-enter flex justify-end">
              <div className="max-w-[82%]">
                <div className="rounded-3xl rounded-br-lg bg-gradient-to-br from-[#506656] to-[#425345] px-4 py-2.5 text-[13.5px] leading-relaxed text-white shadow-md">
                  {m.text}
                </div>
                <p className="mt-1 text-right text-[10.5px] font-medium text-stone-400">{m.time}</p>
              </div>
            </div>
          ) : (
            <div key={m.id} className="page-enter flex items-end gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7C9A82] to-[#506656] text-[15px] shadow">🌱</div>
              <div className="max-w-[82%]">
                <div className="rounded-3xl rounded-bl-lg bg-[#F4F0E6] px-4 py-2.5 text-[13.5px] leading-relaxed text-[#2b332d]">
                  {m.text}
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-[10.5px] font-medium text-stone-400">
                  {m.time} • <span className="inline-flex items-center gap-0.5 font-bold text-[#7C9A82]"><Leaf className="h-3 w-3" /> Simulated</span>
                </p>
              </div>
            </div>
          )
        )}
        {typing && (
          <div className="flex items-end gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#7C9A82] to-[#506656] text-[15px]">🌱</div>
            <div className="flex items-center gap-1.5 rounded-3xl rounded-bl-lg bg-[#F4F0E6] px-4 py-3">
              <span className="typing-dot h-2 w-2 rounded-full bg-[#7C9A82]" />
              <span className="typing-dot h-2 w-2 rounded-full bg-[#7C9A82]" />
              <span className="typing-dot h-2 w-2 rounded-full bg-[#7C9A82]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1 nice-scroll">
        {QUICK_PROMPTS.map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            className="shrink-0 rounded-full bg-white px-3.5 py-2 text-[12.5px] font-bold text-[#3d5a43] shadow-sm ring-1 ring-[#7C9A82]/25 transition hover:bg-[#E8EFE9] active:scale-95"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="mt-2 flex items-center gap-2 rounded-full bg-white p-1.5 pl-4 shadow-[0_4px_24px_rgba(90,110,90,0.12)] ring-1 ring-[#7C9A82]/15"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask Buddy anything, ${userName.split(" ")[0]}…`}
          className="flex-1 bg-transparent text-[14px] font-medium outline-none placeholder:text-stone-400"
        />
        <button
          type="submit"
          disabled={!input.trim() || typing}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7C9A82] to-[#425345] text-white shadow-md transition hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </form>
      <p className="mt-1.5 text-center text-[11px] text-stone-400">Simulated replies for demo • No real AI model • Not medical advice</p>
    </div>
  );
}
