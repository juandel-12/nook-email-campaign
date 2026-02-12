/**
 * ActiveCampaign CORS Proxy — Cloudflare Worker
 *
 * This worker proxies requests from the browser to the ActiveCampaign API,
 * adding CORS headers so the frontend can call AC directly.
 *
 * Deploy: https://developers.cloudflare.com/workers/get-started/guide/
 *
 * Usage from the frontend:
 *   fetch("https://your-worker.your-subdomain.workers.dev/proxy", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({
 *       acUrl: "https://yourname.api-us1.com/api/3/users/me",
 *       acApiKey: "your-api-key",
 *       method: "GET",
 *       body: null
 *     })
 *   })
 *
 * Security:
 *   - Only proxies to *.api-us1.com and *.activehosted.com domains
 *   - Allowed origins restricted to your GitHub Pages + localhost
 *   - No credentials stored in the worker — the frontend sends them per-request
 */

// Allowed origins — update these to match your deployment
const ALLOWED_ORIGINS = [
  'https://juandel-12.github.io',
  'http://localhost:3000',
  'http://localhost:3001'
];

// Only proxy to ActiveCampaign API domains
const ALLOWED_HOSTS = [
  '.api-us1.com',
  '.activehosted.com'
];

function isAllowedOrigin(origin) {
  if (!origin) return false;
  return ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed));
}

function isAllowedTarget(url) {
  try {
    const parsed = new URL(url);
    return ALLOWED_HOSTS.some(host => parsed.hostname.endsWith(host));
  } catch {
    return false;
  }
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      if (isAllowedOrigin(origin)) {
        return new Response(null, { status: 204, headers: corsHeaders(origin) });
      }
      return new Response('Forbidden', { status: 403 });
    }

    // Only accept POST to /proxy
    const url = new URL(request.url);
    if (url.pathname !== '/proxy' || request.method !== 'POST') {
      return new Response('Not Found. Use POST /proxy', { status: 404 });
    }

    // Origin check
    if (!isAllowedOrigin(origin)) {
      return new Response('Origin not allowed', { status: 403 });
    }

    // Parse the proxy request
    let payload;
    try {
      payload = await request.json();
    } catch {
      return new Response('Invalid JSON body', {
        status: 400,
        headers: corsHeaders(origin)
      });
    }

    const { acUrl, acApiKey, method, body } = payload;

    if (!acUrl || !acApiKey) {
      return new Response('Missing acUrl or acApiKey', {
        status: 400,
        headers: corsHeaders(origin)
      });
    }

    // Validate the target URL is an ActiveCampaign domain
    if (!isAllowedTarget(acUrl)) {
      return new Response('Target URL not allowed. Must be an ActiveCampaign domain.', {
        status: 403,
        headers: corsHeaders(origin)
      });
    }

    // Forward the request to ActiveCampaign
    try {
      const acResponse = await fetch(acUrl, {
        method: method || 'GET',
        headers: {
          'Api-Token': acApiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        ...(body ? { body: JSON.stringify(body) } : {})
      });

      const responseBody = await acResponse.text();

      return new Response(responseBody, {
        status: acResponse.status,
        headers: {
          ...corsHeaders(origin),
          'Content-Type': 'application/json'
        }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 502,
        headers: {
          ...corsHeaders(origin),
          'Content-Type': 'application/json'
        }
      });
    }
  }
};
