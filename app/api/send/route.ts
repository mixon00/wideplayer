const UMAMI_SEND_URL = "https://stats.mixon.dev/api/send";

function copyHeader(
  source: Headers,
  target: Headers,
  name: string,
  fallback?: string | null,
) {
  const value = source.get(name) ?? fallback;
  if (value) target.set(name, value);
}

function buildForwardHeaders(request: Request) {
  const incoming = request.headers;
  const headers = new Headers();
  const connectingIp = incoming.get("CF-Connecting-IP");
  const forwardedFor = incoming.get("X-Forwarded-For");
  const host = incoming.get("Host");

  copyHeader(incoming, headers, "Content-Type");
  copyHeader(incoming, headers, "User-Agent");
  copyHeader(incoming, headers, "Accept-Language");
  copyHeader(incoming, headers, "Referer");
  copyHeader(incoming, headers, "Origin");

  copyHeader(incoming, headers, "X-Real-IP", connectingIp);
  copyHeader(incoming, headers, "X-Forwarded-For", forwardedFor ?? connectingIp);
  copyHeader(incoming, headers, "X-Forwarded-Proto", incoming.get("X-Forwarded-Proto") ?? "https");
  copyHeader(incoming, headers, "X-Forwarded-Host", host);
  copyHeader(incoming, headers, "CF-Connecting-IP", connectingIp);
  copyHeader(incoming, headers, "CF-IPCountry");
  copyHeader(incoming, headers, "CF-RegionCode");
  copyHeader(incoming, headers, "CF-IPCity");

  return headers;
}

export async function POST(request: Request) {
  const response = await fetch(UMAMI_SEND_URL, {
    method: "POST",
    headers: buildForwardHeaders(request),
    body: await request.arrayBuffer(),
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": response.headers.get("Content-Type") ?? "application/json",
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
  });
}
