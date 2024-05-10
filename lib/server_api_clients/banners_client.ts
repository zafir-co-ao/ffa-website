import { left, right } from "../deps";
import type { I18nBanner } from "../model/types/banner";
import type { PortalLocale } from "../model/types/portal_locale";
import type { APIClientGetter } from "./api_client_getter";
import handleClientError from "./handle_client_error";

export type I18nBannersGetter = APIClientGetter<I18nBanner[]>;

export function i18nBannersGetter(lang: PortalLocale): I18nBannersGetter {
	return async () => {
		const res = await fetch(`/api/banners?lang=${lang}`);
		if (res.status !== 200) {
			return left(handleClientError(res));
		}

		return right((await res.json()) as I18nBanner[]);
	};
}
