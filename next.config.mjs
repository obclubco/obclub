import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages hosts static files only: `next build` writes the whole site to out/.
  output: "export",
  reactStrictMode: true,
  // We ship one lockfile per project; pin the tracing root so Next stops guessing
  // the monorepo parent.
  outputFileTracingRoot: __dirname,
  // No image optimization server on GitHub Pages; images are served as-is.
  images: { unoptimized: true },
  // Security headers can't be set on GitHub Pages (it serves its own); HTTPS is
  // enforced in the repo's Pages settings instead.
};
export default nextConfig;
