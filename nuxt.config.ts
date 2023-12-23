// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	sourcemap: {
		server: true,
		client: true,
	},

	css: ["~~/assets/sass/fatimafreitas.scss"],
	app: {
		head: {
			script: [
				{
					src: "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js",
					integrity:
						"sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p",
					crossorigin: "anonymous",
					tagPosition: "bodyClose",
				},
				{
					src: "https://www.googletagmanager.com/gtag/js?id=G-3XMWQYWMNL",
					async: true,
				},
				{
					innerHTML: `
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', 'G-3XMWQYWMNL');
					`,
				},
			],
			link: [
				{
					rel: "icon",
					type: "image/jpg",
					href: "/images/ffa-icon.jpg",
				},
				{
					rel: "stylesheet",
					href: "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
					integrity:
						"sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3",
					crossorigin: "anonymous",
				},

				{
					rel: "stylesheet",
					href: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.0/font/bootstrap-icons.css",
				},
				{
					rel: "stylesheet",
					href: "https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700,800,900&display=swap&subset=latin-ext",
				},
				{
					rel: "stylesheet",
					href: "https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700,800,900&display=swap&subset=latin-ext",
				},
			],
			meta: [
				{
					name: "google-site-verification",
					content: "FzmuBkAwgSF4FRuXXVGfZk7SSHesRgRfb6ZLt6HnpgM",
				},
			],
		},
	},

	modules: ["nuxt-security"],
	security: {
		csrf: true,
		nonce: true, // Enables HTML nonce support in SSR mode
		ssg: {
			hashScripts: true, // Enables CSP hash support for scripts in SSG mode
			hashStyles: true, // Disables CSP hash support for styles in SSG mode (recommended)
		},
		corsHandler: {
			origin: "null",
		},
		headers: {
			contentSecurityPolicy: {
				"script-src": [
					"'self'", // Fallback value, will be ignored by browsers level 3
					"'nonce-{{nonce}}'", // Enables CSP nonce support for scripts in SSR mode, supported browsers level 2 & 3
					"https://www.google.com",
				],
				"style-src": [
					"'self'", // Enables loading of stylesheets hosted on self origin
					"'nonce-{{nonce}}'", // Enables CSP nonce support for scripts in SSR mode, supported browsers level 2 & 3
					"https://fonts.googleapis.com",
					"https://cdn.jsdelivr.net",
				],
				"img-src": [
					"'self'", // Enables loading of images hosted on self origin
					"blob:", // If you use Blob to construct images dynamically from javascript
					"data:", // If you use base64 encoded images
					"https://cms.fatimafreitas.com",
					"https://i.ytimg.com",
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
				],
				"frame-src": ["https://www.google.com", "https://www.youtube.com"],
				"media-src": ["'self'", "https://cms.fatimafreitas.com"],
				"manifest-src": ["'none'"],
			},
			crossOriginEmbedderPolicy: false,
		},
	},

	runtimeConfig: {
		public: {
			antboxUrl: process.env.NUXT_PUBLIC_ANTBOX_URL,
			recaptchaSiteKey: "6LcedyYpAAAAAKz5CGTqE4fdue0Sa7H8o1Ak0o-F",
		},

		private: {
			recaptchaSecretKey: "6LcedyYpAAAAAA2rEcYsFQAY-g81ot6xDFlUelxx",
		},
	},
});
