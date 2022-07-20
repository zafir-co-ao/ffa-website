export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.config.errorHandler = (error, context) => {
		console.error("Error:", error);
	};
});
