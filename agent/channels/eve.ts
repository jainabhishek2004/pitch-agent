import { eveChannel } from "eve/channels/eve";
import { none } from "eve/channels/auth";

// The default eve auth ([vercelOidc(), localDev()]) rejects browser users in
// production → 401 "Authorization is required for this route". `none()` grants
// anonymous (public) access so the web UI (useEveAgent) can call the agent.
//
// ⚠ This makes /eve/v1 callable by anyone who has the URL (and it spends your
// model credits). Gate the site with Vercel Deployment Protection, or replace
// none() with real auth (httpBasic / jwtHmac / a custom AuthFn) to lock it down.
export default eveChannel({
  auth: [none()],
});
