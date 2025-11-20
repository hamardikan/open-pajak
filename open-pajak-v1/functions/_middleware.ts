export async function onRequest(context: {
  request: Request
  next: () => Promise<Response>
  env: { ASSETS?: { fetch: (request: Request) => Promise<Response> } }
}): Promise<Response> {
  const { request, next, env } = context
  const url = new URL(request.url)
  const pathname = url.pathname

  const response = await next()

  const hasExtension = /\.[^/]+$/.test(pathname)
  
  if (hasExtension || response.ok) {
    return response
  }

  if (response.status === 404) {
    const indexUrl = new URL(request.url)
    indexUrl.pathname = '/index.html'
    const indexRequest = new Request(indexUrl.toString(), request)

    let indexResponse: Response
    if (env.ASSETS) {
      indexResponse = await env.ASSETS.fetch(indexRequest)
    } else {
      indexResponse = await fetch(indexRequest)
    }

    if (indexResponse.ok) {
      return new Response(indexResponse.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      })
    }
  }

  return response
}

