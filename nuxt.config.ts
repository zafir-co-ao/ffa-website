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
		},
	},

	runtimeConfig: {
		public: {
			antboxUrl: process.env.NUXT_PUBLIC_ANTBOX_URL,
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
