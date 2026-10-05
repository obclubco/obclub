import type { Metadata } from "next";
import PageHero from "../../components/sections/PageHero";
import EventsEmpty from "../../components/sections/EventsEmpty";
import EventsCalendar from "../../components/sections/EventsCalendar";
import { getEvents, getStats } from "../../lib/content";
import CTA from "../../components/sections/CTA";
import { OG_IMAGE } from "../../lib/site";

const WHATSAPP = "https://chat.whatsapp.com/KJfMcHDByFaCrceZFesOp9?mode=gi_t";

export const metadata: Metadata = {
  title: "Events: Private Dinners & Roundtables",
  description:
    "Curated OB Club events: private founder dinners, operator roundtables, and socials in Riga. See what's on the calendar, or join the list to hear about the next one first.",
  alternates: { canonical: "/events" },
  openGraph: {
    title: "OB Club Events: Rooms Worth Showing Up To",
    description:
      "Private dinners, roundtables, and socials for founders and operators. Be first to know when the next date goes live.",
    url: "/events",
    type: "website",
    images: [OG_IMAGE],
  },
};

export default async function EventsPage() {
  const [events, stats] = await Promise.all([getEvents(), getStats()]);
  return (
    <main>
      <PageHero
        kicker="Events"
        title="Rooms worth showing up to."
        titleNowrap
        subtitle="No filler panels. Just the right people around one table, private dinners, roundtables, and socials built for real connection."
        primary={{ label: "Join the Community", href: WHATSAPP }}
        secondary={{ label: "See the podcast", href: "/podcast" }}
      />
      {events.length > 0 ? (
        <EventsCalendar events={events} />
      ) : (
        <EventsEmpty members={stats.members} eventsHosted={stats.eventsHosted} />
      )}
      <CTA />
    </main>
  );
}
