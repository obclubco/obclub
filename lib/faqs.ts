// Homepage FAQ content. Shared so the visible accordion (FAQ.tsx) and the
// FAQPage JSON-LD (app/page.tsx) stay in sync, exactly as Google requires.

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "What exactly is OB Club?",
    a: "OB Club is a private network for online entrepreneurs, builders, and operators. It runs on three things: curated in-person events, an active community, and real partnerships between members.",
  },
  {
    q: "Is it free to join?",
    a: "Yes, the community is free to join. Start in the WhatsApp group to meet members, then get invited to events as you get involved. Partnerships and premium events are handled case by case.",
  },
  {
    q: "Who is OB Club for?",
    a: "Founders, freelancers, and operators who are actually building, online businesses, agencies, and product companies. The bar is ambition and follow-through, not revenue.",
  },
  {
    q: "How do the events work?",
    a: "Events are intentionally small, private dinners and roundtables where every seat matters. You will meet a handful of the right people rather than a crowd of the wrong ones.",
  },
  {
    q: "Can my company partner with OB Club?",
    a: "Absolutely. We partner with brands that share our standard and can offer real value to members. Reach out through the contact section to start the conversation.",
  },
  {
    q: "Where is OB Club based?",
    a: "The community is online and global, with flagship events hosted in Riga and beyond. Wherever members are building, the network travels with them.",
  },
];
