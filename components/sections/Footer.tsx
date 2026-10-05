import { Button } from "../ui/primitives";
import { Reveal } from "../ui/motion";
import Wordmark from "./Wordmark";
import {
  IgYouTube,
  IgInstagram,
  IgFacebook,
  IgTikTok,
  IgSpotify,
} from "../ui/icons";

import { getEpisodes } from "../../lib/content";
import { COMPANY } from "../../lib/legal";

const WHATSAPP = "https://chat.whatsapp.com/KJfMcHDByFaCrceZFesOp9?mode=gi_t";
const CALENDLY = "https://calendly.com/obclubco/30min";
// four groups → a clean 2×2 grid
const makeCols = (latestEpisode: string) => [
  { title: "Explore", links: [["Home", "/"], ["Events", "/events"], ["Podcast", "/podcast"]] },
  { title: "Podcast", links: [["All episodes", "/podcast"], ["Latest episode", latestEpisode]] },
  { title: "The Club", links: [["Partners", "/partners"], ["Become a Partner", CALENDLY], ["FAQ", "/#faq"]] },
  { title: "Contact", links: [["Join community", WHATSAPP], ["Partnerships", CALENDLY], ["Get in touch", "/contact"]] },
];

// real OB Club destinations (handle: obclub.co / @OBCLUBCO)
const socials: [string, string, React.ReactNode][] = [
  ["https://www.youtube.com/@OBCLUBCO", "YouTube", <IgYouTube key="yt" className="h-4 w-4" />],
  ["https://www.instagram.com/obclub.co", "Instagram", <IgInstagram key="ig" className="h-4 w-4" />],
  ["https://www.facebook.com/obclub.co", "Facebook", <IgFacebook key="fb" className="h-4 w-4" />],
  ["https://www.tiktok.com/@obclub.co", "TikTok", <IgTikTok key="tt" className="h-4 w-4" />],
  ["https://open.spotify.com/show/033yWokMpeBTTzHrv4ujmS", "Spotify", <IgSpotify key="sp" className="h-4 w-4" />],
];

export default async function Footer() {
  const [latest] = await getEpisodes();
  const cols = makeCols(latest ? `/podcast/${latest.slug}` : "/podcast");
  return (
    <footer id="footer" data-wf="/#footer" className="relative mt-4">
      {/* giant brand wordmark — lowered, its bottom cut off by the hairline below */}
      <div className="relative overflow-hidden pt-16">
        <div className="translate-y-[20%]">
          <Wordmark />
        </div>
      </div>
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        <div className="hairline" />
      </div>

      {/* centred brand block + 2×2 links */}
      <Reveal className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-5 py-16 text-center sm:px-6">
        <a href="/" className="flex items-center" aria-label="OB Club home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/obc/logo.webp" alt="OB Club" className="h-14 w-auto" />
        </a>
        <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-[var(--text-muted)]">
          Where entrepreneurs meet, network, and build real business. A private
          ecosystem for builders, founders, and ambitious operators.
        </p>
        <div className="mt-7">
          <Button href={WHATSAPP}>Join Our Free Community</Button>
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          {socials.map(([href, label, icon], i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`OB Club on ${label}`}
              className="grid h-11 w-11 place-items-center rounded-lg border border-[var(--border-2)] text-[var(--text-muted)] transition-colors hover:border-white/50 hover:bg-white/5 hover:text-[var(--text)]"
            >
              <span aria-hidden="true">{icon}</span>
            </a>
          ))}
        </div>

        {/* links — 2×2 centred on mobile, 4×1 on desktop */}
        <div className="mt-14 grid w-full max-w-[400px] grid-cols-2 justify-items-center gap-x-8 gap-y-10 text-center md:max-w-[880px] md:grid-cols-4 md:justify-items-start md:text-left">
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)]">
                {c.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {c.links.map(([label, href]) => {
                  const external = /^https?:\/\//.test(href);
                  return (
                    <li key={label}>
                      <a
                        href={href}
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="inline-flex min-h-[24px] items-center text-[14px] text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
                      >
                        {label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        <div className="hairline" />
        <div className="flex w-full flex-col items-center justify-between gap-4 py-6 text-center text-[13px] text-[var(--text-faint)] sm:flex-row sm:text-left">
          <span>
            © {new Date().getFullYear()} {COMPANY.name} · Reg. no. {COMPANY.regNo}
            <span className="block text-[12px] sm:inline sm:before:mx-2 sm:before:content-['·']">{COMPANY.address}</span>
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            {[["Privacy", "/privacy"], ["Terms", "/terms"], ["Imprint", "/imprint"]].map(([l, h]) => (
              <a key={h} href={h} className="inline-flex min-h-[24px] items-center justify-center px-1 hover:text-[var(--text)]">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
