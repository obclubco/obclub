// ─────────────────────────────────────────────────────────────────────────────
// Blog posts — SEO "spokes" that cluster around each podcast episode ("pillar").
// 3 per episode. Each is a real, evergreen article sized to its stated read time
// (roughly 200 words per minute). Internal-link them from the episode page and
// vice-versa for topic-cluster SEO. Slugs are short and keyword-first. Swap or
// extend freely, but keep bodies substantial: a "5 min read" should be a 5 min read.
// ─────────────────────────────────────────────────────────────────────────────

export type BlogSection = { heading: string; body: string[] };

export type BlogPost = {
  slug: string;
  /** the podcast episode this article lives under (/podcast/<episode>/<slug>) */
  episodeSlug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  intro: string[];
  sections: BlogSection[];
  seo: { title: string; description: string; keywords: string[] };
};

export const blogPosts: BlogPost[] = [
  // ── Ep 1 — first-big-paycheck / high-ticket sales ───────────────────────────
  {
    slug: "price-high-ticket",
    episodeSlug: "first-big-paycheck",
    title: "How to price a high-ticket offer without flinching",
    excerpt:
      "The number on the invoice isn't the problem. Your relationship to it is. The full framework for pricing outcomes with a straight face, from anchor to silence.",
    date: "2026-06-20",
    readTime: "4 min read",
    intro: [
      "Most people don't lose high-ticket deals on the pitch. They lose them in the half second of hesitation before the price leaves their mouth. The buyer hears the pause, and the pause becomes the message: even the person selling this isn't sure it's worth the money.",
      "Pricing with a straight face isn't confidence you're born with. It's a series of decisions you make before the call, so that by the time you say the number there's nothing left to be nervous about. Here is the whole thing, in the order it actually matters.",
    ],
    sections: [
      {
        heading: "A price is only expensive next to the wrong number",
        body: [
          "A price never lands in a vacuum. It lands next to whatever figure the buyer is silently comparing it against, and most sellers hand them the wrong one for free. Set next to your hourly rate, a five-figure fee sounds absurd. Set next to a full year of the problem going unsolved, the exact same fee can sound like a discount.",
          "So before any call, decide out loud what the result is worth in the buyer's own terms. The revenue they'll add. The months they'll get back. The specific, expensive mistake they'll now avoid. Turn it into a real figure and write it down. That figure is your anchor, and it's almost always several times larger than what you're going to charge.",
          "When the money part of the conversation arrives, the anchor goes first and the price goes second. 'This usually returns somewhere north of X over the year. The investment is Y.' The order does the work. You're no longer defending a cost. You're quoting a fraction of a return.",
        ],
      },
      {
        heading: "Rehearse the number until the flinch is gone",
        body: [
          "Conviction isn't a personality trait, it's reps. The reason your voice tightens on the price is that you've said it out loud maybe a dozen times in your life, and half of those the answer was no. Of course it feels loaded. You've barely practised it, and every rep so far has been high-stakes.",
          "Fix it the boring way. Say your price, in a complete sentence, to an empty room, until it sounds like you're reading the time off a clock. 'The investment for this is twelve thousand euros.' Again. Again. If you can't say it calmly to a wall, you have no chance of saying it calmly to someone whose eyebrows are about to move.",
          "This sounds too basic to matter, which is exactly why almost nobody does it. It's the highest-return thing on this page. The buyer isn't pricing your service. They're pricing your certainty, and certainty is just preparation that already happened somewhere they couldn't see.",
        ],
      },
      {
        heading: "State it, then stop talking",
        body: [
          "There's a moment right after the price where the urge to keep talking is almost physical. Resist it. The instinct to fill that silence with a discount, a justification, or a nervous 'but we're flexible' is what quietly bleeds your margin dry before the buyer has even reacted.",
          "Say the number and let it sit. Three seconds feels like a minute to you and like normal thinking time to them. Whoever speaks first in that pause is usually the one who gives something up, so make sure it's them.",
          "When pushback comes, remember what it actually is: a request for a reason to say yes. Answer the real objection, plainly, then go quiet again. Silence on a sales call isn't awkward. It reads as calm, and calm is close to the most persuasive thing you can bring into the room.",
        ],
      },
      {
        heading: "Move the scope, never the price",
        body: [
          "The most expensive habit in high-ticket selling is dropping the number the second you feel resistance. Every time you do it, you teach the buyer two things: that your price was never real, and that patience gets rewarded. Both of those cost you far more than the discount itself, this deal and every one after it.",
          "If you genuinely have to move, move what's included, not what it costs. Take something out. A shorter engagement, one fewer deliverable, a slower timeline. The value per euro stays intact, and the buyer keeps their footing because they chose a smaller scope rather than talked you down.",
          "Hold the ceiling and you protect two things at once: the margin on this deal, and your reputation with every person that buyer will ever mention your name to.",
        ],
      },
      {
        heading: "Price for the client you actually want",
        body: [
          "Cheap prices attract expensive clients. The people who fight hardest over a small fee are almost always the ones who'll need the most reassurance, the most revisions, and the most late-night messages after they sign. A higher number filters most of them out before they ever reach your calendar.",
          "Price also changes how the work is received once it starts. People value what costs them something. The same plan handed over for two hundred euros gets skimmed and forgotten. Handed over for twenty thousand, it gets implemented that week. Part of what the buyer is paying for is the seriousness the price forces onto their own side of the table.",
          "So set the number at the level of the client you want to be working with a year from now, and let it do the sorting. The right price doesn't only pay you better. It hands you better clients to be paid by.",
        ],
      },
    ],
    seo: {
      title: "How to Price High-Ticket Offers Without Flinching | OB Club",
      description:
        "Anchor to outcomes, rehearse the number, hold the price, and let silence work. A practical framework for pricing high-ticket offers with conviction.",
      keywords: [
        "high ticket pricing",
        "how to price high ticket",
        "sales conviction",
        "value based pricing",
      ],
    },
  },
  {
    slug: "cold-outreach",
    episodeSlug: "first-big-paycheck",
    title: "Cold outreach that actually books calls",
    excerpt:
      "Volume without relevance is spam. Relevance without volume is a hobby. The full system that makes cold outreach book calls instead of getting deleted.",
    date: "2026-06-24",
    readTime: "4 min read",
    intro: [
      "Cold outreach has a bad reputation because most of it deserves one. The average cold message is lazy, self-centred, and obviously pasted to five hundred people at once. That's good news for you. When the baseline is that low, a message that shows a pulse stands out immediately.",
      "Done properly, cold outreach is still the fastest way to put your offer in front of buyers who've never heard of you and don't yet know they need you. Here's the system, from the research before the first line to the follow-up almost everyone quits on too early.",
    ],
    sections: [
      {
        heading: "Relevance and volume are not a trade-off",
        body: [
          "People treat these as opposites. Either you send a handful of hyper-personalised messages, or you blast a template to a huge list. Pick one, the thinking goes, because you can't do both at once. That framing is why most outreach fails before the first message goes out.",
          "The truth is you need both, layered. A repeatable structure you can send at volume, carrying two or three genuinely specific lines that prove this message was meant for this person. The structure gives you reach. The specifics earn the reply. Drop either half and the numbers collapse.",
          "Build the skeleton once and stop rewriting it. Then spend your real time on the parts that change per prospect, because those are the only parts doing the persuading.",
        ],
      },
      {
        heading: "Lead with their world, not yours",
        body: [
          "The first line decides everything. If it's about you, your company, your 'quick question', it gets deleted before the second sentence. If it proves you actually looked at their business, it buys you the next three lines and a real shot at a reply.",
          "Specific beats flattering every time. 'Love what you're building' is noise. 'You're hiring three closers but your site still routes demo requests to a generic inbox' is a message someone reads twice. One line says you sent five hundred of these. The other says you looked, at them, before you typed a word.",
          "You don't need an essay. One real observation, tied to a problem you can actually solve, is enough to lift you out of the pile and into the reply-worthy stack.",
        ],
      },
      {
        heading: "One message, one ask, one easy yes",
        body: [
          "Confused prospects don't reply, they just move on. The fastest way to confuse someone is to stack requests: book a call, and check out our deck, and follow us, and let me know your thoughts. Each extra ask lowers the odds of any single one happening.",
          "Every message should make exactly one request, and that request should be almost effortless to accept. Not 'buy my thing.' Not even 'hop on a forty-five minute call.' Something closer to 'worth me sending a ninety-second video showing how this would work for you?'",
          "Lower the height of the first step and more people take it. Once they're moving, the next step is always easier to propose than it was from a standing start.",
        ],
      },
      {
        heading: "The follow-up is where the money is",
        body: [
          "Most replies don't come from the first message. They come from the second, third, and fourth. And yet most people send one, hear nothing, decide outreach doesn't work, and stop. They quit at the exact point where the results were about to start.",
          "The mistake is following up like a stalker instead of a professional. 'Just bumping this' and 'did you see my last message' add nothing and mildly annoy. A good follow-up carries its own value: a relevant example, a short resource, a second angle on the problem. Each touch should be worth opening on its own, even if the person never buys.",
          "Space them out, keep them useful, and give it four or five contacts before you write someone off. A polite, genuinely helpful sequence over two weeks beats a single perfect message almost every time.",
        ],
      },
      {
        heading: "Track the reply rate, not your feelings",
        body: [
          "Cold outreach feels terrible when you judge it by individual rejections. Ten ignores in a row will convince you the whole thing is broken, even while the system is quietly working. Feelings are a useless metric here, and they punish you hardest right before things click.",
          "Numbers aren't. Track how many you sent, how many opened, how many replied, how many booked. Once you have a hundred sends of real data, the weak link becomes obvious: a subject line nobody opens, a first line nobody answers, an ask nobody accepts. Fix that one link and the whole chain lifts.",
          "Treat the first hundred messages as research, not results. You're not only hunting for deals, you're learning the exact words that make your specific buyer respond. That language is the real asset, and it only shows up at volume.",
        ],
      },
      {
        heading: "Warm the channel before you go cold",
        body: [
          "Pure cold works, but it works far better when the prospect has seen your name before they see your message. A thoughtful comment on their post, a share of their work, a useful reply in a thread they're already in: none of it is a pitch, all of it lowers the temperature of the outreach that follows.",
          "You don't need to become an influencer. You need to stop being a total stranger. Even one prior touch turns 'who is this' into 'oh, this person', and that small shift moves reply rates more than any subject-line trick you'll read this year.",
          "The people who make cold outreach look easy are usually doing this quietly in the background. The message that 'just worked' was set up by three weeks of showing up where the buyer already was.",
        ],
      },
    ],
    seo: {
      title: "Cold Outreach That Actually Books Calls | OB Club",
      description:
        "Relevance plus volume plus disciplined follow-up. How to write cold outreach that books sales calls instead of getting deleted, with the system behind it.",
      keywords: [
        "cold outreach",
        "cold email",
        "booking sales calls",
        "outbound sales",
      ],
    },
  },
  {
    slug: "outcome-selling",
    episodeSlug: "first-big-paycheck",
    title: "The mindset shift from hourly to outcome selling",
    excerpt:
      "Selling time caps your income at the clock. Selling outcomes uncaps it. The reframe that changes what you're allowed to charge.",
    date: "2026-06-28",
    readTime: "3 min read",
    intro: [
      "The single biggest lever on your income isn't how many hours you work. It's what you attach your price to. Attach it to time and you inherit time's ceiling, because there are only so many hours and you need some of them to sleep. Attach it to outcomes and the ceiling quietly disappears.",
      "This is the shift underneath every jump from scraping by to charging real money. It sounds like a mindset thing, and it is, but it's also a set of concrete changes in how you talk, quote, and deliver. Here's the whole reframe.",
    ],
    sections: [
      {
        heading: "Why hourly quietly keeps you poor",
        body: [
          "Bill by the hour and you get punished for getting good. The faster and sharper you become, the fewer hours a job takes, and the less you earn for the same result. Your own improvement works against you. It's the only model where competence is a pay cut.",
          "It also caps you at arithmetic. Your rate times your available hours is a hard number, and no amount of hustle moves it much. You can nudge the rate up, work a little more, skip a weekend, but you're renovating a ceiling, not removing it.",
        ],
      },
      {
        heading: "Sell the after, not the during",
        body: [
          "Buyers don't actually want your process. They don't care how many hours it takes, which tools you use, or how the sausage gets made. They want the state they'll be in once it's done: the pipeline full, the system running, the problem gone. That end state is the thing that has value to them.",
          "So price the destination, not the journey. When you quote the result, the conversation stops being about your rate and starts being about whether the outcome is worth it. And a good outcome is almost always worth far more than the hours behind it.",
          "This is why two people with identical skills can charge wildly different amounts. One sells 'twenty hours of work.' The other sells 'a booking system that stops you losing walk-ins.' Same labour, completely different number, because one named a cost and the other named a payoff.",
        ],
      },
      {
        heading: "Anchor to the value, then quote the fee",
        body: [
          "To sell outcomes you have to know what the outcome is worth, in the buyer's terms, before you open your mouth about money. Ask the questions that surface it. What does solving this add, or save, over a year? What has it already cost them to leave it broken this long?",
          "Once that number is on the table, your fee has something to stand next to. Ten thousand looks very different beside a hundred thousand of avoided loss than it does beside nothing at all. You didn't change the price. You changed what it gets compared against.",
        ],
      },
      {
        heading: "Guarantee the result, not the hours",
        body: [
          "Nothing signals outcome-thinking like tying your money to the outcome. You don't have to promise the moon, but shifting even part of the risk onto your own shoulders changes the whole conversation. It says you believe the thing will work, and belief is contagious across a table.",
          "It also forces discipline on your side. When you're paid for results, you stop selling to people you can't genuinely help, because their failure becomes your problem too. That filtering makes you better, and better results let you charge more, which is the entire loop.",
          "Start where hourly ends: name the outcome, price the outcome, and stand behind the outcome. Do that consistently and the clock stops being the thing that owns your income.",
        ],
      },
    ],
    seo: {
      title: "Hourly to Outcome-Based Selling: The Mindset Shift | OB Club",
      description:
        "Why billing by the hour caps your income and how pricing outcomes uncaps it. The reframe behind high-ticket selling, and how to make it concrete.",
      keywords: [
        "outcome based pricing",
        "stop charging hourly",
        "value selling",
        "raise your rates",
      ],
    },
  },

  // ── Ep 2 — make-500k-a-month / scaling ──────────────────────────────────────
  {
    slug: "scalable-offer",
    episodeSlug: "make-500k-a-month",
    title: "One offer, priced to scale: the pre-scale checklist",
    excerpt:
      "Scale multiplies whatever you already have, flaws included. The full checklist of what has to be true about your offer before you pour on volume.",
    date: "2026-07-09",
    readTime: "3 min read",
    intro: [
      "Founders love to add. More offers, more channels, more features, more everything. It feels like progress because it feels like motion. But the path to a genuinely large monthly number is almost always the opposite of adding. It's picking one thing, making it excellent, and then multiplying it.",
      "Before you multiply anything, the thing you're multiplying has to actually work. Scale is a magnifier. Pour volume onto a great offer and you get a great business. Pour it onto a leaky one and you just spread the leak faster. Here's the checklist to run before you spend a euro on growth.",
    ],
    sections: [
      {
        heading: "The unit has to work before the volume does",
        body: [
          "A scalable offer starts as a single transaction that already makes sense on its own. A clear promise the buyer understands in one sentence. A price the market accepts without a fight. Margins that survive the real cost of getting the customer. If any one of those is shaky, scale doesn't fix it, it enlarges it.",
          "Be honest about which of the three is weak, because there's always one. Usually it's margin, hidden by the fact that your current customers came cheap, through referrals and warm intros that won't exist at volume. The moment you start paying for traffic, thin margins turn into a loss on every single sale.",
        ],
      },
      {
        heading: "Predictable beats profitable, at first",
        body: [
          "You cannot scale a fluke. If you can't explain why the offer converts, you can't reliably make it convert more. Before you spend on growth, you need the boring thing: a known input producing a known output. Put this in, get roughly that out, most of the time.",
          "That means tracking the whole path. How many leads it takes to get a call, how many calls to get a sale, what a customer is worth once they're in. When those numbers hold steady across a few hundred people, you have a machine. Until then you have a lucky streak, and nobody should pour fuel on a lucky streak.",
        ],
      },
      {
        heading: "One offer, ruthlessly, before a second",
        body: [
          "Every additional offer splits your attention, your messaging, and your data. Two half-tuned offers will almost always lose to one fully-tuned one. The discipline is to resist the second thing until the first is genuinely humming, even when the second thing is exciting and the first has started to feel boring.",
          "There's a reason the biggest monthly numbers often come from a suspiciously simple menu. One core offer, sharpened over months, aimed at one clear buyer. Simplicity here isn't a lack of ambition. It's what ambition looks like once it's been focused down to a point.",
        ],
      },
      {
        heading: "Delivery has to hold at ten times the load",
        body: [
          "An offer that's a joy to deliver to five clients can quietly become a nightmare at fifty. Before you scale sales, look hard at fulfilment. What breaks when volume triples? Where are you personally the bottleneck? What quietly depends on you remembering to do it at the right moment?",
          "If the honest answer is that quality depends on your personal involvement in every delivery, you don't have a scalable offer yet. You have a busy job with your name on it. Systematise or staff the delivery first. Selling more of something you can't deliver well is just manufacturing refunds and bad reviews at scale.",
        ],
      },
      {
        heading: "Then, and only then, pour it on",
        body: [
          "Once the unit works, the numbers are predictable, the focus is on one offer, and delivery holds under load, scaling becomes almost mechanical. You already know that X in gets Y out, so growth turns into a simpler question: how much X can you afford to buy this month?",
          "That's the quiet secret behind the screenshots. The dramatic month wasn't a dramatic hack. It was an unglamorous offer, tuned until it was boringly reliable, then fed more volume than it had ever seen. Do the boring checklist first, and the exciting number tends to take care of itself.",
        ],
      },
    ],
    seo: {
      title: "One Offer, Priced to Scale: The Pre-Scale Checklist | OB Club",
      description:
        "What has to be true about your offer, promise, price, margin, delivery, before you pour on volume. The checklist to run before you spend on growth.",
      keywords: [
        "how to scale an offer",
        "pre scale checklist",
        "scalable offer",
        "unit economics",
      ],
    },
  },
  {
    slug: "owned-distribution",
    episodeSlug: "make-500k-a-month",
    title: "Own your distribution: build the channel, don't rent it",
    excerpt:
      "At scale the constraint is almost never the product. It's reach. Why owned distribution is the real asset, and how to build it instead of renting it.",
    date: "2026-07-12",
    readTime: "4 min read",
    intro: [
      "The best offer nobody sees earns nothing. It's an uncomfortable fact for people who love the craft: past a certain size, the quality of what you sell stops being the thing that decides how much you sell. Distribution takes over. How reliably you can put your offer in front of new buyers becomes the whole game.",
      "And there are only two ways to get that reach. You rent it, or you own it. Almost everyone starts by renting, and almost everyone who lasts eventually shifts to owning. Here's the difference, and how to make the move before a platform makes it for you.",
    ],
    sections: [
      {
        heading: "Rented reach can vanish overnight",
        body: [
          "Rented distribution is any channel you don't control. A social platform's algorithm. A single ad account. A marketplace that sends you customers. A big partner whose audience you borrow. It can be fantastic while it lasts, and that's exactly the trap, because it feels like an asset while you're really just a tenant.",
          "Then the rules change. The algorithm shifts and your reach halves. The ad account gets flagged on a Tuesday for a reason you'll never learn. The partner decides to compete with you instead. None of this is rare. It's the normal weather of building on land you don't own, and it always seems to arrive right after you've come to depend on it.",
        ],
      },
      {
        heading: "Owned reach is the thing you compound",
        body: [
          "Owned distribution is a direct line to people who chose to hear from you. An email list. A phone list. A community. An audience that follows you specifically, not a platform that occasionally decides to show you to them. The test is simple: if a platform disappeared tomorrow, could you still reach these people? If yes, you own it.",
          "Owned channels compound in a way rented ones never do. Every week you add subscribers, and last week's subscribers don't evaporate. The asset grows on top of itself. Rented reach resets constantly, always starting from zero attention. Owned reach accumulates, and accumulation is what eventually produces numbers that look impossible from the outside.",
        ],
      },
      {
        heading: "Use rented reach to build owned reach",
        body: [
          "This isn't an argument to abandon platforms. Rented channels are where the new people are, and ignoring them would be foolish. The mistake is treating attention on a rented channel as the finish line instead of the on-ramp.",
          "So set every rented channel to feed an owned one. A post that pops should send people to a list, not just earn a follow. An ad should capture an email, not only a sale. Think of platforms as rivers running past your land, and your job as digging channels that divert some of that water into a reservoir you keep. The reservoir is the business. The river is just weather.",
        ],
      },
      {
        heading: "Distribution is a habit, not a tap",
        body: [
          "The most common failure isn't picking the wrong channel. It's treating distribution as something you switch on when revenue dips and switch off when you're busy delivering. That start-stop pattern keeps you permanently fragile, always either drowning in work or scrambling for the next month's leads.",
          "Owned distribution gets built by showing up on a schedule you keep whether or not you feel like it. Publish weekly. Email the list on a rhythm. Add to the audience every single week, in good months and bad. It's unglamorous and slow at first, and then one day the reservoir is deep enough that a launch just works, because the reach was already sitting there waiting.",
        ],
      },
      {
        heading: "Own the relationship, not only the list",
        body: [
          "A list of addresses you never earn trust with is barely worth more than a rented feed. The real asset is the relationship: people who open because it's you, who reply, who buy without needing to be reconvinced from scratch every time. That trust gets built by being useful far more often than you sell.",
          "Give the audience reasons to stay before you give them reasons to pay. Answer their questions in public. Share the thinking, not only the pitch. Every genuinely useful thing you put out is a deposit, and when it's time to sell, you're making a withdrawal from an account you actually funded.",
        ],
      },
      {
        heading: "The payoff comes later than you want, and bigger than you expect",
        body: [
          "Owned distribution is a bad fit for anyone in a hurry. For months it looks like nothing. A small list, a quiet community, numbers that barely move. This is precisely where most people quit and go back to renting, because renting pays something today and owning pays nothing yet.",
          "But the curve isn't a line. An audience that took two years to reach ten thousand can reach fifty thousand in the next one, because reach helps you earn more reach. The founders sitting on channels that print demand didn't find a trick. They kept filling the reservoir long after it stopped being exciting, and then the depth did the work for them.",
        ],
      },
    ],
    seo: {
      title: "Own Your Distribution: Build the Channel, Don't Rent It | OB Club",
      description:
        "Why owned distribution is the real asset at scale, and how compounding reach beats turning the ad tap on and off. Build the reservoir before you need it.",
      keywords: [
        "owned distribution",
        "distribution strategy",
        "audience building",
        "scaling reach",
      ],
    },
  },
  {
    slug: "operator-to-owner",
    episodeSlug: "make-500k-a-month",
    title: "From operator to owner: what to delegate first",
    excerpt:
      "If the business needs your hands on every deal, it's capped at your capacity. The order in which to actually let go, and the few things to keep.",
    date: "2026-07-15",
    readTime: "4 min read",
    intro: [
      "There's a specific ceiling almost every founder hits, and it isn't the market or the offer. It's you. When the business needs your hands on every deal, every decision, and every delivery, it can only ever grow to the size of one very tired person. That's the operator's ceiling, and you don't break through it by working harder. You break through it by doing less, on purpose.",
      "The jump from operator to owner is really a jump in what you refuse to do yourself. But 'delegate more' is useless advice without an order of operations. Hand off the wrong things first and you'll create chaos, then quietly conclude that nobody can do it but you. Here's the order that actually works.",
    ],
    sections: [
      {
        heading: "Delegate the bottleneck, not the wish list",
        body: [
          "Most people delegate the tasks they dislike, which feels great and changes nothing. The tasks you find annoying are rarely the ones constraining growth. Hand off the inbox and you'll feel lighter for a week while the real limiter, maybe fulfilment, maybe sales, stays firmly on your plate.",
          "Instead, find the single thing that most constrains the business right now, and aim your first real hire straight at it. One excellent person placed on the true bottleneck outperforms five scattered helpers who each shave a little busywork off your day. Fix the constraint and the whole system speeds up. Everything else is just rearranging your own to-do list.",
        ],
      },
      {
        heading: "Document before you delegate",
        body: [
          "You can't hand off what only exists in your head. The reason 'only I can do this' feels true is usually that you've never written it down, so of course nobody else can do it, there's nothing to follow. The knowledge isn't rare. It's just trapped inside one person.",
          "Before you hire for a role, spend a week writing down how you do it, roughly. Not a polished manual, just the steps, the decisions, the things that go wrong and how you handle them. That rough document is what turns a task from 'trapped in the founder' into something a capable person can own, and eventually improve past you.",
        ],
      },
      {
        heading: "Hand over outcomes, not just tasks",
        body: [
          "There are two ways to delegate. You can assign tasks, where you stay the brain and they're the hands and you're still in every decision. Or you can assign outcomes, where you hand someone a result to own and the authority to make the calls that get there. Only the second one actually frees you.",
          "Task delegation feels safer, so most founders get stuck there and wonder why they're still the bottleneck. The whole point is to give away decisions, not only labour. That's uncomfortable, because work will get done differently than you'd do it, and sometimes worse before it gets better. Sitting with that discomfort is most of the job.",
        ],
      },
      {
        heading: "Keep the few things that are genuinely yours",
        body: [
          "Delegating everything is as much a mistake as delegating nothing. A handful of things should stay with you, probably for the life of the company: the vision, the culture you set by example, the biggest hires, and the one or two decisions that would sink the business if they went wrong.",
          "The goal isn't to touch nothing. It's to touch only the things where your involvement genuinely changes the outcome, and route everything else to someone who owns it. An owner's calendar should be mostly empty of tasks and mostly full of the few decisions that move the number. If yours is packed with work only you can do, you haven't finished the transition. You've just hired assistants.",
        ],
      },
      {
        heading: "Let people be worse than you, for a while",
        body: [
          "The quiet reason founders won't let go is that nobody does the work as well as they do. Often that's even true at first. A new hire will handle things at seventy percent of your quality for a stretch, and watching that is genuinely painful when your name is on all of it.",
          "But seventy percent that isn't yours to do beats a hundred percent that is, because the hundred percent doesn't scale and the seventy percent climbs. Given a clear outcome, a rough playbook, and room to make some mistakes, a good hire usually passes you at their one job, because it's their whole focus and it was only a slice of yours. Your job is to survive the dip long enough to reach the part where they're better than you ever were.",
        ],
      },
    ],
    seo: {
      title: "From Operator to Owner: What to Delegate First | OB Club",
      description:
        "Delegate the bottleneck, document before you hand off, give away outcomes not tasks. The order of delegation that turns an operator into an owner.",
      keywords: [
        "operator to owner",
        "what to delegate first",
        "scaling a team",
        "founder delegation",
      ],
    },
  },
];
