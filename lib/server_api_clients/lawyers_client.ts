import { fidToUuid, left, right } from "../deps";
import type { I18nLawyer as I18nLawyer } from "../model/types/lawyer";
import type { PortalLocale } from "../model/types/portal_locale";
import type { APIClientGetter } from "./api_client_getter";
import handleClientError from "./handle_client_error";

export type I18nLawyerGetter = APIClientGetter<I18nLawyer>;

export function i18nLawyerGetter(
	uuidOrFid: string,
	lang: PortalLocale,
	useFid = true
): I18nLawyerGetter {
	return async () => {
		const uuid = useFid ? fidToUuid(uuidOrFid) : uuidOrFid;
		const res = await fetch(`/api/lawyers/${uuid}?lang=${lang}`);
		if (res.status !== 200) {
			return left(handleClientError(res));
		}

		return right((await res.json()) as I18nLawyer);
	};
}

export function getI18nLawyer(uuid: string, lang: PortalLocale, useFid = true) {
	return i18nLawyerGetter(uuid, lang, useFid)();
}

export function getLawyersByCategory(lang: PortalLocale, category: string): Promise<I18nLawyer[]> {
	return fetch(`/api/lawyers?lang=${lang}&category=${category}`).then((res) => res.json());
}

export function searchI18nLawyers(query: string, lang: PortalLocale): Promise<I18nLawyer[]> {
	return fetch(`/api/lawyers?lang=${lang}&q=${query}`).then((res) => res.json());
}
