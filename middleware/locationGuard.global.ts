const SUPPORTED_LOCALES_RE = /^\/?(pt|en)($|\/)/;
const REDIRECT_ROUTE = "/pt";

function getRedirectRoute(url: string): string {
	if (url === "/a") {
		return "/a/legal-alerts";
	}

	return REDIRECT_ROUTE;
}

function isWellFormated(url: string) {
	return url?.match(SUPPORTED_LOCALES_RE);
}

function isResource(path: string = ""): boolean {
	const resourcesRe = /^\/((images|api|d|m|a|_nuxt|err)\/|login)/;

	return resourcesRe.test(path);
}

export default defineNuxtRouteMiddleware((to) => {
	if (isResource(to.path) || isWellFormated(to.path)) {
		return;
	}

	return navigateTo(getRedirectRoute(to.path));
});
