// Event shape + data. Add upcoming events to `upcomingEvents` below.
export type OBEvent = {
  date: string; // ISO yyyy-mm-dd
  title: string;
  type: string;
  place: string;
  time?: string; // "19:00"
  url?: string; // sign-up link; defaults to APPLY_URL
};

// Guests apply for events through OBC Networking.
export const APPLY_URL = "https://networking.obclub.co/apply/";

export const upcomingEvents: OBEvent[] = [
  {
    date: "2026-10-30",
    title: "Networking",
    type: "Networking",
    place: "Aston Hotel",
    time: "15:30",
  },
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function fmtDay(iso: string): { month: string; day: string; monthLong: string; weekday: string; long: string } {
  const [y, m, d] = iso.split("-").map(Number);
  return {
    month: MONTHS[m - 1].slice(0, 3).toUpperCase(),
    monthLong: `${MONTHS[m - 1]} ${y}`,
    day: String(d),
    weekday: WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()],
    long: `${d} ${MONTHS[m - 1]} ${y}`,
  };
}
