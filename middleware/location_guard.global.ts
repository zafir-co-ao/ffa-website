const SUPPORTED_LOCALES_RE = /^\/?(pt|en)($|\/)/;
const SUPPORTED_LOCALES = ["pt", "en"];
const REDIRECT_ROUTE = "/pt";

export default defineNuxtRouteMiddleware((to) => {
	if (isResource(to.path) || isWellFormated(to.path)) {
		return;
	}

	return navigateTo(getRedirectRoute(to.path));
});
function getRedirectRoute(url: string): string {
	const headers = useRequestHeaders();

	if (!headers["accept-language"]) {
		return REDIRECT_ROUTE;
	}

	const locales = headers["accept-language"]
		.split(",")
		?.map((locale) => locale.substring(0, 2))
		?.filter((locale) => SUPPORTED_LOCALES.includes(locale));

	return locales?.[0] ?? REDIRECT_ROUTE;
}

function isWellFormated(url: string) {
	return url?.startsWith("/a") || url?.match(SUPPORTED_LOCALES_RE);
}

function isResource(path: string = ""): boolean {
	const resourcesRe = /^\/((images|api|d|m|a|_nuxt|err)\/|login)/;

	return resourcesRe.test(path);
}
