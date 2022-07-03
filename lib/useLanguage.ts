import { ref, readonly } from "vue";
import { Router, RouteLocation } from "vue-router";
import PortalLanguage from "~~/lib/model/portalLanguage";

const lang = ref<PortalLanguage>("pt");

export default function useLanguage(router: Router, route: RouteLocation) {
	if (route) lang.value = getPortalLanguage(route);

	return {
		lang: readonly(lang),
		changePortalLanguage: (lang: PortalLanguage) =>
			changePortalLanguage(router, route, lang),
	};
}

function changePortalLanguage(router: any, route: any, lang: string) {
	if (!lang.match(/^(pt|en)$/)) {
		return;
	}

	const newPath = route.fullPath.replace(/^\/\w\w/, `/${lang}`);

	router.replace(newPath);
}

function getPortalLanguage(route: any): PortalLanguage {
	if (["pt", "en"].includes(route.params.lang)) {
		return route.params.lang;
	}

	return "pt" as PortalLanguage;
}
