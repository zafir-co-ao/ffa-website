export const contentSecurityPolicy = {
	"base-uri": ["'none'"],
	"connect-src": [
		"'self'",
		"https://cms.fatimafreitas.com",
		"https://www.google-analytics.com",
		"https://cdn.tiny.cloud",
		"https://cdn.jsdelivr.net",
        
	],
	"form-action": ["'self'"],
	"frame-ancestors": ["'self'"],
	"frame-src": ["https://www.google.com", "https://www.youtube.com"],
	"font-src": [
		"'self'", // Enables loading of fonts hosted on self origin
		"https://cdn.jsdelivr.net",
		"https://fonts.gstatic.com",
	],
	"img-src": [
		"'self'", // Enables loading of images hosted on self origin
		"blob:", // If you use Blob to construct images dynamically from javascript
		"data:", // If you use base64 encoded images
		"https://cms.fatimafreitas.com",
		"https://i.ytimg.com",
		"https://sp.tinymce.com",
	],
	"media-src": ["'self'", "https://cms.fatimafreitas.com"],
	"manifest-src": ["'none'"],
	"object-src": ["'none'"],
	"script-src": [
		"'self'", // Fallback value, will be ignored by browsers level 3
		"'nonce-{{nonce}}'", // Enables CSP nonce support for scripts in SSR mode, supported browsers level 2 & 3
		"https://www.google.com",
		"https://www.googletagmanager.com/",
		"https://cdn.tiny.cloud/",
		"https://cdn.jsdelivr.net",
	],
	"style-src": [
		"'self'", // Enables loading of stylesheets hosted on self origin
		"'nonce-{{nonce}}'", // Enables CSP nonce support for scripts in SSR mode, supported browsers level 2 & 3
		"https://fonts.googleapis.com",
		"https://cdn.jsdelivr.net",
		"https://cdn.tiny.cloud",
	],
	"worker-src": [
		"'self'", // Enables loading service worker from self origin,
		"blob:", // If you use PWA, it is likely that the worker will be instantiated from Blob
	],
};
