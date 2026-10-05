import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | OB Club admin" },
  robots: { index: false, follow: false },
};

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-black text-[var(--text)]">{children}</div>;
}
