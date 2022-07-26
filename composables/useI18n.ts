import { log } from "console";
import { Ref } from "vue";
import { PortalLocale } from "~~/lib/model/types/portalLocale";

import pt from "~~/lib/i18n/locales/pt.json";
import en from "~~/lib/i18n/locales/en.json";

import { RouteLocationNormalizedLoaded, Router } from "vue-router";

export default function () {
	const route = useRoute();
	const router = useRouter();

	const locale = useState("locale", () => getCurrentLocale(route));

	return {
		$locale: locale,
		$messages: messages(locale),
		switchLocalePath: (l: PortalLocale) =>
			switchLocalePath(router, route, locale, l),
		localePath: (path: string) => localePath(locale, path),
	};
}

function getCurrentLocale(route: RouteLocationNormalizedLoaded): PortalLocale {
	if (route.params.locale) {
		return route.params.locale as PortalLocale;
	}

	return "pt";
}

function messages(locale: Ref<PortalLocale>) {
	if (locale.value === "en") {
		return en;
	}

	return pt;
}

function localePath(locale: Ref<PortalLocale>, path: string) {
	return `/${locale.value}${path}`;
}

function switchLocalePath(
	router: Router,
	route: RouteLocationNormalizedLoaded,
	locale: Ref<PortalLocale>,
	newLocale: PortalLocale
) {
	locale.value = newLocale;

	const newPath = route.fullPath.replace(/^\/\w\w/, `/${newLocale}`);

	router.replace(newPath);
}
