import { currentAdmin } from "../../lib/auth";
import { db } from "../../lib/db";
import { getAnalytics, listAllContent, listLeads } from "../../lib/admin-data";
import LoginForm from "../../components/admin/LoginForm";
import AdminApp from "../../components/admin/AdminApp";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin" };

// The whole admin is this one page: sign-in when logged out, otherwise every
// section loads here in a single request and switches in the browser.
export default async function AdminPage() {
  if (!(await currentAdmin())) {
    return (
      <main className="grid min-h-screen place-items-center px-5">
        <div className="w-full max-w-[360px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/obc/logo.webp" alt="OB Club" className="mx-auto h-12 w-auto" />
          <h1 className="serif mt-8 text-center text-[28px] font-bold">Admin</h1>
          <p className="mt-2 text-center text-[14px] text-[var(--text-faint)]">Sign in to manage the site.</p>
          <LoginForm />
        </div>
      </main>
    );
  }

  const hasDb = !!db();
  const [content, leads, analytics] = await Promise.all([listAllContent(), listLeads(), getAnalytics()]);
  const plain = (rows: { id: string; data: Record<string, unknown>; sort: number; published: boolean }[] = []) =>
    rows.map(({ id, data, sort, published }) => ({ id, data, sort, published }));

  return (
    <AdminApp
      hasDb={hasDb}
      analytics={analytics}
      leads={leads.map((l) => ({ ...l, created_at: new Date(l.created_at).toISOString() }))}
      content={Object.fromEntries(Object.entries(content).map(([k, v]) => [k, plain(v)]))}
    />
  );
}
