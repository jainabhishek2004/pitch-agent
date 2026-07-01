import { withEve } from "eve/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // @react-pdf/renderer ships native-ish assets (yoga WASM); keep it external
  // so Next/Turbopack doesn't try to bundle it.
  serverExternalPackages: ["@react-pdf/renderer"],
};

// withEve ships the Next.js frontend + the Eve agent (agent/) as one project,
// and mounts the /eve/v1 routes that useEveAgent talks to.
export default withEve(nextConfig);
