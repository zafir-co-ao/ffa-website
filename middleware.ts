import { next } from "@vercel/edge";

import { contentSecurityPolicy } from "./csp";

// Set CSP header
const cspHeader = Object.entries(contentSecurityPolicy)
	.map(([key, value]) => `${key} ${value.join(" ")}`)
	.join("; ");

// Middleware for vercel deployment
export default function middleware(request: Request) {
	// Store the response so we can modify its headers
	const response = next();

	// Set custom header
	response.headers.set(
		"Strict-Transport-Security",
		"max-age=31536000; includeSubDomains; preload"
	);
	response.headers.set("Cross-Origin-Embedder-Policy", "unsafe-none");
	response.headers.set("Cross-Origin-Resource-Policy", "cross-origin");
	response.headers.set("Cross-Origin-Opener-Policy", "cross-origin");
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

	response.headers.set("X-Content-Type-Options", "nosniff");

	if (!response.headers.has("Content-Security-Policy"))
		response.headers.set("Content-Security-Policy", cspHeader);

	response.headers.set(
		"Access-Control-Allow-Origin",
		request.headers.get("Origin") ?? "https://www.fatimafreitas.com"
	);

	// Return response
	return response;
}
