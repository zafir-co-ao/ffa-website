import { next } from "@vercel/edge";

const contentSecurityPolicy = {
	"script-src": [
		"'self'", // Fallback value, will be ignored by browsers level 3
		"'nonce-{{nonce}}'", // Enables CSP nonce support for scripts in SSR mode, supported browsers level 2 & 3
		"https://www.google.com",
		"https://www.googletagmanager.com/",
		"https://cdn.tiny.cloud/",
	],
	"style-src": [
		"'self'", // Enables loading of stylesheets hosted on self origin
		"'nonce-{{nonce}}'", // Enables CSP nonce support for scripts in SSR mode, supported browsers level 2 & 3
		"https://fonts.googleapis.com",
		"https://cdn.jsdelivr.net",
		"https://cdn.tiny.cloud",
	],
	"img-src": [
		"'self'", // Enables loading of images hosted on self origin
		"blob:", // If you use Blob to construct images dynamically from javascript
		"data:", // If you use base64 encoded images
		"https://cms.fatimafreitas.com",
		"https://i.ytimg.com",
		"https://sp.tinymce.com",
	],
	"font-src": [
		"'self'", // Enables loading of fonts hosted on self origin
		"https://cdn.jsdelivr.net",
		"https://fonts.gstatic.com",
	],
	"worker-src": [
		"'self'", // Enables loading service worker from self origin,
		"blob:", // If you use PWA, it is likely that the worker will be instantiated from Blob
	],

	"object-src": ["'none'"],
	"base-uri": ["'none'"],
	"connect-src": [
		"'self'",
		"https://cms.fatimafreitas.com",
		"https://www.google-analytics.com",
		"https://cdn.tiny.cloud",
	],
	"frame-src": ["https://www.google.com", "https://www.youtube.com"],
	"media-src": ["'self'", "https://cms.fatimafreitas.com"],
	"manifest-src": ["'none'"],
};

// Set CSP header
const cspHeader = Object.entries(contentSecurityPolicy)
	.map(([key, value]) => `${key} ${value.join(" ")}`)
	.join("; ");

// Middleware for vercel deployment
export function middleware(request: Request) {
	// Store the response so we can modify its headers
	const response = next();

	// Set custom header
	response.headers.set(
		"Strict-Transport-Security",
		"max-age=31536000; includeSubDomains; preload"
	);
	response.headers.set("Cross-Origin-Embedder-Policy", "require-corp");
	response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
	response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	response.headers.set("Content-Security-Policy", cspHeader);
	response.headers.set("x-modified-edge", "true");

	// Return response
	return response;
}
