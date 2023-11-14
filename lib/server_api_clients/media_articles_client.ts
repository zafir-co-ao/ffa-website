import { fidToUuid } from "../deps";
import type { I18nMediaArticle, MediaArticle } from "../model/types/media_article";
import type { PortalLocale } from "../model/types/portal_locale";

export interface I18nMediaArticleGetter {
	(): Promise<I18nMediaArticle | undefined>;
}

export interface MediaArticleGetter {
	(): Promise<MediaArticle | undefined>;
}

export function i18nMediaArticleGetter(
	uuidOrFid: string,
	lang: PortalLocale,
	useFid = true
): I18nMediaArticleGetter {
	return async () => {
		const uuid = useFid ? fidToUuid(uuidOrFid) : uuidOrFid;
		const res = await fetch(`/api/media-articles/${uuid}?lang=${lang}`);
		if (res.status !== 200) {
			return undefined;
		}

		return res.json() as Promise<I18nMediaArticle>;
	};
}

export function getI18nMediaArticle(
	uuidOrFid: string,
	lang: PortalLocale,
	useFid = true
): Promise<I18nMediaArticle | undefined> {
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
