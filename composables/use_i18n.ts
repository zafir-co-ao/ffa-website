import { Ref } from "vue";
import { PortalLocale } from "~/lib/model/types/portal_locale";

import pt from "~/lib/i18n/locales/pt.json";
import en from "~/lib/i18n/locales/en.json";

import { RouteLocationNormalizedLoaded } from "vue-router";

export default function () {
	const route = useRoute();

	const locale = useState("locale", () => getCurrentLocale(route));

	return {
		$locale: locale,
		$messages: messages(locale),

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
	if (path.startsWith("/")) {
		return `/${locale.value}${path}`;
	}

	return `/${locale.value}/${path}`;
}
