// https://nuxt.com/docs/api/configuration/nuxt-config
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

	runtimeConfig: {
		public: {
			antboxUrl: process.env.NUXT_PUBLIC_ANTBOX_URL,
			recaptchaSiteKey: "6LcedyYpAAAAAKz5CGTqE4fdue0Sa7H8o1Ak0o-F",
		},

		private: {
			recaptchaSecretKey: "6LcedyYpAAAAAA2rEcYsFQAY-g81ot6xDFlUelxx",
		},
	},

	nitro: {
		preset: "firebase",
		firebase: {
			gen: 2,
			nodeVersion: "18",
		},
	},
});
