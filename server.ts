const staticFiles: Record<string, { path: string; type: string }> = {
  "/": { path: "index.html", type: "text/html; charset=utf-8" },
  "/index.html": { path: "index.html", type: "text/html; charset=utf-8" },
  "/style.css": { path: "style.css", type: "text/css; charset=utf-8" },
  "/logo.svg": { path: "logo.svg", type: "image/svg+xml" },
};

let cachedEnvModified = 0;
let cachedEnv: Record<string, string> = {};

function parseEnv(source: string) {
  const env: Record<string, string> = {};

  for (const line of source.split(/\r?\n/)) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*?)\s*$/);
    if (!match || match[1].startsWith("#")) continue;

    const value = match[2].replace(/^(['"])(.*)\1$/, "$2");
    env[match[1]] = value;
  }

  return env;
}

async function getConfig() {
  const envFile = Bun.file(".env");
  const exists = await envFile.exists();
  const modified = exists ? envFile.lastModified : 0;

  if (modified !== cachedEnvModified) {
    cachedEnvModified = modified;
    cachedEnv = exists ? parseEnv(await envFile.text()) : {};
  }

  return {
    redirectEnabled: cachedEnv.REDIRECT_ENABLED ?? Bun.env.REDIRECT_ENABLED,
    redirectTarget: cachedEnv.REDIRECT_TARGET ?? Bun.env.REDIRECT_TARGET,
  };
}

const server = Bun.serve({
  port: Number(Bun.env.PORT || 3000),
  async fetch(request) {
    const config = await getConfig();

    if (config.redirectEnabled === "true") {
      if (!config.redirectTarget) {
        return new Response("Missing REDIRECT_TARGET", { status: 500 });
      }

      return Response.redirect(config.redirectTarget, 302);
    }

    const { pathname } = new URL(request.url);
    const file = staticFiles[pathname];

    if (!file) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(Bun.file(file.path), {
      headers: { "Content-Type": file.type },
    });
  },
});

console.log(`Listening on http://localhost:${server.port}`);
