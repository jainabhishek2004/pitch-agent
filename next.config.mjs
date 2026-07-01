import { withEve } from "eve/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // The generate_pitch_pdf tool renders with headless chromium on the server.
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
};

// withEve ships the Next.js frontend + the Eve agent (agent/) as one project,
// and mounts the /eve/v1 routes that useEveAgent talks to.
export default withEve(nextConfig);
