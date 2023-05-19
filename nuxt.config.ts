// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	sourcemap: {
		server: true,
		client: true,
	},

	css: ["~~/assets/sass/fatimafreitas.scss", "@zafir.co.ao/lightray/style.css"],
	app: {
		head: {
			script: [],
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
});
