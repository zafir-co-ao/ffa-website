export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.config.errorHandler = (error, _context) => {
		console.error("Error:", error);
	};
});
