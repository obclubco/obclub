import { db } from "../../../../lib/db";

// Admin-uploaded images (partner logos, member photos). Ids are random and
// never reused, so responses are cached forever.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f0-9]{16}\.(png|jpg|webp|svg|avif)$/.test(id)) return new Response("Not found", { status: 404 });
  const sql = db();
  if (!sql) return new Response("Not found", { status: 404 });
  const [row] = await sql<{ mime: string; bytes: Buffer }[]>`select mime, bytes from obc_media where id = ${id}`;
  if (!row) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(row.bytes), {
    headers: {
      "Content-Type": row.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
      // SVGs are served as images only; block any script inside them
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
