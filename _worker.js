export default {
  async fetch(request, env) {
    if (env.REDIRECT_ENABLED === "true") {
      if (!env.REDIRECT_TARGET) {
        return new Response("Redirect target not configured.", { status: 500 });
      }

      return Response.redirect(env.REDIRECT_TARGET, 302);
    }

    return env.ASSETS.fetch(request);
  },
};
