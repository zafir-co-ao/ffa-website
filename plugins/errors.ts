export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.config.errorHandler = (error, context) => {
		console.log(error, "cpto");
	};

	console.log(nuxtApp.vueApp.config.errorHandler, "cpto");
});
