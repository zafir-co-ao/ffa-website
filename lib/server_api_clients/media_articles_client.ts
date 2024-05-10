import { fidToUuid, left, right } from "../deps";
import type { I18nMediaArticle } from "../model/types/media_article";
import type { PortalLocale } from "../model/types/portal_locale";
import type { APIClientGetter } from "./api_client_getter";
import handleClientError from "./handle_client_error";

export type I18nMediaArticleGetter = APIClientGetter<I18nMediaArticle>;

export function i18nMediaArticleGetter(
	uuidOrFid: string,
	lang: PortalLocale,
	useFid = true
): I18nMediaArticleGetter {
	return async () => {
		const uuid = useFid ? fidToUuid(uuidOrFid) : uuidOrFid;
		const res = await fetch(`/api/media-articles/${uuid}?lang=${lang}`);
		if (res.status !== 200) {
			return left(handleClientError(res));
		}

		return right((await res.json()) as I18nMediaArticle);
	};
}

export function getI18nMediaArticle(uuidOrFid: string, lang: PortalLocale, useFid = true) {
	return i18nMediaArticleGetter(uuidOrFid, lang, useFid)();
}
export function getLatestMediaArticles(lang: PortalLocale, count = 2): Promise<I18nMediaArticle[]> {
	return fetch(`/api/media-articles?lang=${lang}&latest=${count}`).then((res) => res.json());
}

export function searchMediaArticlesArchive(
	lang: PortalLocale,
	pageSize: number,
	pageToken: number
): Promise<I18nMediaArticle[]> {
	return fetch(
		`/api/media-articles?lang=${lang}&page-size=${pageSize}&page-token=${pageToken}`
	).then((res) => res.json() as Promise<I18nMediaArticle[]>);
}

export function searchI18nMediaArticles(
	query: string,
	lang: PortalLocale
): Promise<I18nMediaArticle[]> {
	return fetch(`/api/media-articles?lang=${lang}&q=${query}`).then((res) => res.json());
}
