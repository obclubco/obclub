// Shared admin styles: same tokens and control shapes as the public site.
export const input =
  "w-full rounded-[10px] border border-[var(--border-2)] bg-transparent px-4 py-3 text-[15px] text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none transition-colors duration-200 focus:border-white/60";

export const label = "mb-1.5 block text-[12px] uppercase tracking-[0.14em] text-[var(--text-faint)]";

export const btnPrimary =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] bg-white px-5 text-[14px] font-medium text-black transition-opacity duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45";

export const btnGhost =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] border border-[var(--border-2)] px-4 text-[14px] text-[var(--text-muted)] transition-colors duration-200 hover:border-white/60 hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-45";

export const btnDanger =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] px-3 text-[14px] text-[#e5657a] transition-colors duration-200 hover:bg-[#e5657a]/10 disabled:opacity-45";

export const iconBtn =
  "grid h-9 w-9 place-items-center rounded-[8px] text-[var(--text-faint)] transition-colors hover:bg-white/10 hover:text-[var(--text)] disabled:opacity-30 disabled:hover:bg-transparent";
