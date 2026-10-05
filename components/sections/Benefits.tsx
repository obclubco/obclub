"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Section, Kicker, Button } from "../ui/primitives";
import { Reveal, SplitWords } from "../ui/motion";
import { Users } from "../ui/icons";

const WHATSAPP = "https://chat.whatsapp.com/KJfMcHDByFaCrceZFesOp9?mode=gi_t";
const EASE = [0.22, 1, 0.36, 1] as const;

// An illustrative feed of the kind of chatter the community runs on. These are
// representative, not real member posts, so they make no specific claims.
const feed: { who: string; msg: string; me?: boolean }[] = [
  { who: "Kārlis", msg: "Anybody know a great video editor?" },
  { who: "Elza", msg: "Yes, DMing you two now. Both members." },
  { who: "You", msg: "This is exactly why I joined.", me: true },
  { who: "Roberts", msg: "Who's coming to the Rīga dinner Thursday?" },
  { who: "Anete", msg: "Me. Bringing a founder you'll want to meet." },
  { who: "Jānis", msg: "Anyone got a Stripe-savvy dev they rate?" },
  { who: "You", msg: "Sending you mine, he's excellent.", me: true },
  { who: "Mārtiņš", msg: "Happy to intro a couple of people for that." },
  { who: "Anete", msg: "Anyone in Dubai next month? Coffee's on me." },
  { who: "Kārlis", msg: "Glad that intro worked out." },
  { who: "You", msg: "Same. Good room to be in.", me: true },
];

type Shown = { id: number; who: string; msg: string; me?: boolean };

function AnimatedChat({ members }: { members: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });
  const [msgs, setMsgs] = useState<Shown[]>([]);
  const [typingMe, setTypingMe] = useState<boolean | null>(null);
  const idRef = useRef(0);
  const iRef = useRef(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMsgs(feed.slice(0, 3).map((m) => ({ ...m, id: idRef.current++ })));
      return;
    }
    let timers: ReturnType<typeof setTimeout>[] = [];
    let alive = true;

    const step = () => {
      if (!alive) return;
      const m = feed[iRef.current % feed.length];
      setTypingMe(!!m.me);
      const dwell = m.me ? 1000 : 1650; // longer "typing" beat — slower, heavier
      timers.push(
        setTimeout(() => {
          if (!alive) return;
          setTypingMe(null);
          setMsgs((prev) => [...prev, { ...m, id: idRef.current++ }].slice(-4));
          iRef.current += 1;
          timers.push(setTimeout(step, 1500)); // long pause before the next person
        }, dwell),
      );
    };
    timers.push(setTimeout(step, 700));
    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, [inView]);

  return (
    <div ref={ref} className="relative">
      {/* header */}
      <div className="mb-3 flex items-center gap-3 border-b border-[var(--border)] pb-4">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-[var(--bg)]">
          <Users className="h-5 w-5" />
        </span>
        <div>
          <div className="text-[15px] font-semibold">OBC · Community</div>
          <div className="text-[12px] text-[var(--text-faint)]">{members} members</div>
        </div>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-[var(--border-2)] px-2.5 py-1 text-[11px] text-[var(--text-faint)]">
          Illustration
        </span>
      </div>

      {/* FIXED-HEIGHT window, messages anchored to the bottom so it never resizes
         or jumps — new messages push older ones up and clip at the top (real chat).
         layout + slow/heavy easing makes every shift smooth. */}
      <div className="flex h-[300px] flex-col justify-end gap-3 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_14%)]">
        <AnimatePresence initial={false} mode="popLayout">
          {msgs.map((c) => (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, y: 26, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.55, ease: EASE } }}
              transition={{ duration: 0.85, ease: EASE }}
              className={`flex ${c.me ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-[13.5px] ${
                  c.me
                    ? "bg-white text-[var(--bg)]"
                    : "border border-[var(--border-2)] bg-transparent text-[var(--text-muted)]"
                }`}
              >
                {!c.me && (
                  <div className="mb-0.5 text-[11px] font-medium text-[var(--text-faint)]">
                    {c.who}
                  </div>
                )}
                {c.msg}
              </div>
            </motion.div>
          ))}

          {typingMe !== null && (
            <motion.div
              key="typing"
              layout
              initial={{ opacity: 0, y: 16, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.4, ease: EASE } }}
              transition={{ duration: 0.6, ease: EASE }}
              className={`flex ${typingMe ? "justify-end" : "justify-start"}`}
            >
              <div className="inline-flex items-center gap-1 rounded-2xl border border-[var(--border-2)] px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-[var(--text-faint)]"
                    animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Benefits({ members }: { members: string }) {
  return (
    <Section id="clothing" data-wf="/#community" className="py-24 sm:py-28">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <Reveal>
            <Kicker>Inside the Community</Kicker>
          </Reveal>
          <h2 className="display mt-6 max-w-[15ch] text-[clamp(32px,4.4vw,56px)] leading-[1.05]">
            <SplitWords text="Every connection is a door." />
          </h2>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[46ch] text-[17px] leading-relaxed text-[var(--text-muted)]">
              Referrals, partnerships, and quiet introductions that move the needle. The
              community runs every day. Here is an illustration of how the room tends to
              work.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={WHATSAPP}>Join OB Club</Button>
              <Button href="/podcast" variant="dark">
                Hear the stories
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal y={30}>
          <div className="bracket relative overflow-hidden rounded-2xl border border-[var(--border-2)] bg-[#0b0b0d] p-6">
            <div className="grid-lines" />
            <AnimatedChat members={members} />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
