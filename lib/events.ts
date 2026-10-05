// Event shape + seed data. Live events are managed in /admin/event (lib/content.ts).
export type OBEvent = {
  date: string; // ISO yyyy-mm-dd
  title: string;
  type: string;
  place: string;
  time?: string; // "19:00"
  url?: string; // sign-up link; falls back to the WhatsApp group
};

export const upcomingEvents: OBEvent[] = [];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function fmtDay(iso: string): { month: string; day: string; monthLong: string } {
  const [y, m, d] = iso.split("-").map(Number);
  return {
    month: MONTHS[m - 1].slice(0, 3).toUpperCase(),
    monthLong: `${MONTHS[m - 1]} ${y}`,
    day: String(d),
  };
}
