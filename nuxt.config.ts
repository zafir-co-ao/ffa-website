import { defineNuxtConfig } from "nuxt/config";
import { contentSecurityPolicy } from "./csp";

export default defineNuxtConfig({
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
						function gtag(){
							dataLayer.push(arguments);
						}
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
				// <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
				{
					rel: "stylesheet",
					href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp",
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

	css: ["~~/assets/sass/fatimafreitas.scss", "~~/assets/css/tailwind.css"],
	modules: ["nuxt-security", "@nuxt/devtools", "@nuxtjs/tailwindcss"],

	routeRules: {
		"/a/**": { appMiddleware: ["auth-guard"], ssr: false },
	},

	runtimeConfig: {
		public: {
			antboxUrl: "",
			recaptchaSiteKey: "",
			applicantsKey: "",
			tinyMceApiKey: "",
		},

		recaptchaSecretKey: "",
	},

	security: {
		corsHandler: false,
		csrf: {
			methodsToProtect: ["PATCH", "POST", "PUT", "DELETE"],
		},
		nonce: true, // Enables HTML nonce support in SSR mode
		sri: true,

		headers: {
			contentSecurityPolicy,
			crossOriginEmbedderPolicy: "unsafe-none",
			crossOriginOpenerPolicy: "unsafe-none",
			crossOriginResourcePolicy: "cross-origin",
		},
	},

	tailwindcss: {
		config: {
			content: [],
			theme: {
				extend: {},
			},
			plugins: [],
			prefix: "tw-",
		},
	},

	sourcemap: {
		server: true,
		client: true,
	},

	compatibilityDate: "2024-07-16",
});
