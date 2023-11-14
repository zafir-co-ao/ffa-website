import type { I18nBanner } from "../model/types/banner";
import type { PortalLocale } from "../model/types/portal_locale";

export interface I18nBannersGetter {
	(): Promise<I18nBanner[]>;
}

export function i18nBannersGetter(lang: PortalLocale): I18nBannersGetter {
	return async () => {
		const res = await fetch(`/api/banners?lang=${lang}`);
		if (res.status !== 200) {
			return [];
		}

		return res.json() as Promise<I18nBanner[]>;
	};
}
