import { Banner, LocalizedBanner } from "../model/types/banner";
import { PortalLocale } from "../model/types/portal_locale";

export interface I18nBannersGetter {
	(): Promise<LocalizedBanner[]>;
}

export function i18nBannersGetter(lang: PortalLocale): I18nBannersGetter {
	return async () => {
		const res = await fetch(`/api/banners?lang=${lang}`);
		if (res.status !== 200) {
			return [];
		}

		return res.json() as Promise<LocalizedBanner[]>;
	};
}
