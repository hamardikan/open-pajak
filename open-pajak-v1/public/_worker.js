export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    // Try to serve the static asset first
    let response = await env.ASSETS.fetch(request)

    // If the request is for a SPA route (no dot in pathname) and we got 404,
    // fall back to index.html so the client router can handle it.
    if (response.status === 404 && request.method === 'GET' && !url.pathname.includes('.')) {
      const indexRequest = new Request(new URL('/index.html', request.url), request)
      response = await env.ASSETS.fetch(indexRequest)
    }

    return response
  },
}
