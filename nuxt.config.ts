import { defineNuxtConfig } from "nuxt3";
import path, { resolve } from "path";
import serveStatic from "serve-static";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
	alias: {
		"~lightray": resolve(__dirname, "node_modules/lightray/src/components"),
	},

	build: {
		transpile: ["@tinymce/tinymce-vue"],
	},

	css: ["~~/assets/sass/fatimafreitas.scss"],

	vite: {
		build: {
			cssCodeSplit: false,
			minify: false,
		},
	},

	meta: {
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
		script: [
			{
				src: "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js",
			},

			{
				src: "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.13/ace.min.js",
			},
		],
	},

	vue: {
		config: {
			devtools: true,
		},
	},
	serverMiddleware: [
		{
			path: "/images/lightray",
			handler: serveStatic(
				path.join(__dirname, "node_modules/lightray/src/images")
			),
		},
	],
});
