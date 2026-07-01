// Render an HTML string to a PDF Buffer.
// Local: uses installed Chrome/Edge (fast, zero deps). Serverless/Vercel: uses
// puppeteer-core + @sparticuz/chromium (install those for deploy).
import { execFileSync } from "node:child_process";
import { writeFileSync, readFileSync, existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const LOCAL_BROWSERS = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium-browser",
  "/usr/bin/chromium",
].filter(Boolean);

const isServerless = () => !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

export async function renderPdfBuffer(html) {
  const localBrowser = LOCAL_BROWSERS.find((p) => existsSync(p));

  if (!isServerless() && localBrowser) {
    const dir = mkdtempSync(join(tmpdir(), "pitch-"));
    const htmlPath = join(dir, "p.html");
    const pdfPath = join(dir, "p.pdf");
    writeFileSync(htmlPath, html);
    execFileSync(localBrowser, [
      "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
      "--run-all-compositor-stages-before-draw", "--virtual-time-budget=12000",
      `--print-to-pdf=${pdfPath}`, "file:///" + htmlPath.replace(/\\/g, "/"),
    ], { stdio: "ignore" });
    return readFileSync(pdfPath);
  }

  // Serverless path: puppeteer-core + @sparticuz/chromium (deploy deps).
  const chromium = (await import("@sparticuz/chromium")).default;
  const puppeteer = (await import("puppeteer-core")).default;
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    return await page.pdf({ printBackground: true, preferCSSPageSize: true });
  } finally {
    await browser.close();
  }
}

// Convenience for the CLI / local file output.
export function renderPdfToFile(html, pdfPath) {
  const localBrowser = LOCAL_BROWSERS.find((p) => existsSync(p));
  if (!localBrowser) throw new Error("No local Chrome/Edge. Set CHROME_PATH.");
  const htmlPath = pdfPath.replace(/\.pdf$/, ".html");
  writeFileSync(htmlPath, html);
  execFileSync(localBrowser, [
    "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
    "--run-all-compositor-stages-before-draw", "--virtual-time-budget=12000",
    `--print-to-pdf=${pdfPath}`, "file:///" + htmlPath.replace(/\\/g, "/"),
  ], { stdio: "ignore" });
  return pdfPath;
}
