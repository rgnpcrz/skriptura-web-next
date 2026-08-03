// Shared plumbing for the three contact Route Handlers.

/** Apache/nginx set these; without a proxy every caller shares one bucket. */
export function clientIp(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

/** @returns {Promise<Object|null>} null when the body isn't JSON. */
export async function readJson(request) {
  try {
    const body = await request.json()
    return body && typeof body === 'object' ? body : null
  } catch {
    return null
  }
}

/**
 * Turns a service-layer error into a response. Errors thrown by
 * `inquiries.js` carry a stable `code` the client maps to a translation key;
 * anything else is a bug and must not leak its message to the visitor.
 */
export function failure(err, context) {
  if (!err.code) {
    console.error(`[Contact] ${context} failed:`, err)
    return Response.json({ error: 'server_error' }, { status: 500 })
  }

  const body = { error: err.code }
  if (err.retryAfter !== undefined) body.retryAfter = err.retryAfter
  if (err.remaining !== undefined) body.remaining = err.remaining
  return Response.json(body, { status: err.status || 400 })
}
