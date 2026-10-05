// ─────────────────────────────────────────────────────────────────────────────
// OB Club, "Behind the Business" podcast content model.
//
// Each episode is a self-contained blog: a video, a written breakdown, and a set
// of "lessons" (mini-articles) distilled from the conversation, plus quick
// takeaways and SEO metadata. Adding an episode = appending one object below.
//
// NOTE: `lessons` are evergreen principles framed around each episode's theme,
// written for SEO + reader value. When the real transcript is available, tighten
// each lesson against what the guest actually said and add verbatim pull-quotes.
// Episodes without a `videoId` render as "recording soon" but keep the full blog.
// ─────────────────────────────────────────────────────────────────────────────

export type Lesson = {
  title: string;
  body: string[]; // paragraphs
};

export type Episode = {
  slug: string;
  number: number;
  title: string;
  videoId: string | null;
  guest: string | null;
  guestRole?: string;
  date: string; // ISO
  duration: string; // "48 min"
  tags: string[];
  excerpt: string; // one-line, used on cards
  intro: string[]; // opening paragraphs of the write-up
  lessons: Lesson[];
  takeaways: string[];
  pullQuote?: { text: string; attribution: string };
  seo: { title: string; description: string; keywords: string[] };
};

export const episodes: Episode[] = [
  {
    slug: "make-500k-a-month",
    number: 2,
    title: "How to make $500k a month, with Markuss Hussle",
    videoId: "FRzYUyZXXB4",
    guest: "Markuss Hussle",
    guestRole: "Founder & operator",
    date: "2026-07-08",
    duration: "58 min",
    tags: ["Scaling", "Revenue", "Operations"],
    excerpt:
      "Half a million a month is not a bigger hustle, it's a different machine. Markuss breaks down the offer, the team, and the distribution behind the number.",
    intro: [
      "There's a ceiling every founder hits where working harder stops working. Getting past it isn't about more hours, it's about building a machine that makes money without you in every transaction.",
      "Markuss has built to a scale most people only post screenshots of. In this conversation we pull apart what actually changes on the way to $500k a month: the offer, the distribution, the team, and the boring operational discipline underneath the headline number.",
    ],
    lessons: [
      {
        title: "One offer, priced and packaged to scale",
        body: [
          "Big monthly numbers almost never come from many small things. They come from one offer that's been sharpened until it converts predictably, then poured volume into.",
          "Before you scale anything, the unit has to work: a clear promise, a price the market accepts without friction, and margins that survive paid traffic. Scale multiplies whatever you already have, including the flaws.",
        ],
      },
      {
        title: "Distribution is the real product",
        body: [
          "The best offer nobody sees earns nothing. At scale, the constraint is almost always distribution: how reliably you can put the offer in front of new buyers.",
          "That means owning a channel, paid, content, or a network, and treating it as an asset you compound, not a tap you turn on when revenue dips. Predictable reach is what turns a good month into a good year.",
        ],
      },
      {
        title: "You can't scale what only you can do",
        body: [
          "The jump from six to seven figures a month is a jump from operator to owner. If the business needs your hands on every deal, it caps at your personal capacity.",
          "The work is to document, delegate, and build a team that runs the machine, so your time goes to the few decisions that actually move the number. Hire for the bottleneck, not the wish list.",
        ],
      },
      {
        title: "Boring operations beat exciting tactics",
        body: [
          "At scale, the exciting growth hacks matter less than unglamorous consistency: cash-flow discipline, clean numbers, fast follow-up, and systems that don't break when volume triples.",
          "The founders who sustain big revenue are rarely the flashiest. They're the ones who made the operation reliable enough that growth doesn't blow it up.",
        ],
      },
    ],
    takeaways: [
      "Perfect one offer before you pour on volume.",
      "Own a distribution channel; compound it.",
      "Delegate everything only-you can do.",
      "Reliable operations outlast clever tactics.",
    ],
    pullQuote: {
      text: "You don't get to $500k a month by hustling harder. You get there by building something that doesn't need you to hustle at all.",
      attribution: "Behind the Business, Ep. 2",
    },
    seo: {
      title:
        "How to Make $500k a Month: Scaling Lessons with Markuss Hussle | OB Club Podcast",
      description:
        "What actually changes on the way to $500k/month: one scalable offer, owned distribution, delegation, and boring operational discipline. Behind the Business Ep. 2.",
      keywords: [
        "how to make 500k a month",
        "scaling a business",
        "high revenue operations",
        "distribution strategy",
        "Markuss Hussle",
        "OB Club podcast",
      ],
    },
  },
  {
    slug: "first-big-paycheck",
    number: 1,
    title:
      "The first sales paycheck bigger than most people's yearly salary, with Edmunds Pošers",
    videoId: "2HWU7mA0kw4",
    guest: "Edmunds Pošers",
    guestRole: "High-ticket sales operator",
    date: "2026-06-18",
    duration: "52 min",
    tags: ["Sales", "High-ticket", "Mindset"],
    excerpt:
      "How a young operator went from cold outreach to a single commission worth more than a national average salary, and the system that made it repeatable.",
    intro: [
      "Most people treat their first big sales month as luck. Edmunds treats it as the output of a system: the right offer, in front of the right buyer, delivered with enough conviction that price stops being the conversation.",
      "In this episode we break down exactly how that first outsized paycheck happened, not the highlight-reel version, but the boring mechanics underneath it. Below are the lessons worth stealing, whether you sell your own service or close for someone else.",
    ],
    lessons: [
      {
        title: "Sell the outcome, not the hours",
        body: [
          "The fastest way to stay poor in sales is to price your time. Time is capped, there are only so many hours, so anyone who bills by the hour is negotiating against their own ceiling.",
          "The shift that unlocks high-ticket is pricing the transformation: what is it worth to the buyer to reach the outcome six months faster, or to avoid the mistake entirely? When you anchor to the value of the result, a five-figure fee stops sounding expensive and starts sounding cheap.",
        ],
      },
      {
        title: "Conviction is transferable: so is doubt",
        body: [
          "Buyers don't buy the product; they buy your certainty that the product works. If you flinch when you say the price, they feel it, and they price that flinch into their decision.",
          "The work, then, is upstream of the call: know your offer cold, know the objections before they're spoken, and have proof ready. Certainty on a call is just preparation that has already happened.",
        ],
      },
      {
        title: "Volume fixes almost everything early",
        body: [
          "A first big win is rarely a first attempt. Behind one closed deal are dozens of conversations that went nowhere, and each one sharpened the pitch.",
          "Early on, treat activity as the goal, not the result. Enough reps expose the real objections, the real buyer, and the real language that lands. Optimize for reps first; optimize for conversion once you have data.",
        ],
      },
      {
        title: "Your network sets your price ceiling",
        body: [
          "The single biggest lever on what you can charge is who you're standing next to. Sell into a room of people who think €500 is a lot, and you'll cap at €500. Sell into a room where five figures is normal, and your baseline resets.",
          "This is why the room matters more than the tactic. Proximity to operators who close bigger, faster, changes what you believe is possible, and belief shows up in your pricing.",
        ],
      },
    ],
    takeaways: [
      "Price the outcome, never the hour.",
      "Prepare objections in advance, certainty is rehearsed.",
      "Chase reps before conversion when you're starting.",
      "Change the room and you change your price ceiling.",
    ],
    pullQuote: {
      text: "The paycheck wasn't the moment it worked. It was the receipt for a system that had already been working.",
      attribution: "Behind the Business, Ep. 1",
    },
    seo: {
      title:
        "First Big Sales Paycheck: High-Ticket Lessons with Edmunds Pošers | OB Club Podcast",
      description:
        "How to land your first outsized commission: pricing outcomes over hours, building conviction, and letting your network reset your ceiling. Behind the Business Ep. 1.",
      keywords: [
        "high ticket sales",
        "first big paycheck",
        "sales mindset",
        "closing deals",
        "OB Club podcast",
        "Edmunds Pošers",
      ],
    },
  },
];

// Upcoming episodes — teasers only (no page yet). Shown at the top of the podcast
// index with a placeholder thumbnail + a line of text. Newest first.
export type ComingSoon = {
  title: string;
  guest?: string;
  eta: string;
  tags: string[];
  excerpt: string;
};

export const comingSoon: ComingSoon[] = [
  {
    title: "Building a personal brand that prints clients",
    guest: "Guest to be announced",
    eta: "Recording soon",
    tags: ["Brand", "Marketing"],
    excerpt:
      "Attention is the new distribution. How founders turn a personal brand into a predictable pipeline of inbound deals.",
  },
  {
    title: "Your first hire: when, who, and how not to get burned",
    guest: "Guest to be announced",
    eta: "In production",
    tags: ["Team", "Hiring"],
    excerpt:
      "The move from doing everything yourself to leading a team, the roles to hire first and the mistakes that cost the most.",
  },
  {
    title: "Bootstrapped vs raised: the honest trade-offs",
    guest: "Guest to be announced",
    eta: "Coming soon",
    tags: ["Funding", "Strategy"],
    excerpt:
      "Two founders, two paths. What you actually give up and gain when you take money versus growing on your own cash.",
  },
];

export function getEpisode(slug: string): Episode | undefined {
  return episodes.find((e) => e.slug === slug);
}

export function episodeSlugs(): string[] {
  return episodes.map((e) => e.slug);
}
