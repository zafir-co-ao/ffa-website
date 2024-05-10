import { fidToUuid, left, right } from "../deps";
import type { I18nEvent } from "../model/types/event";
import type { PortalLocale } from "../model/types/portal_locale";
import type { APIClientGetter } from "./api_client_getter";
import handleClientError from "./handle_client_error";

export type I18nEventGetter = APIClientGetter<I18nEvent>;
export type EventGetter = APIClientGetter<Event>;

export function i18nEventGetter(
	uuidOrFid: string,
	lang: PortalLocale,
	useFid = true
): I18nEventGetter {
	return async () => {
		const uuid = useFid ? fidToUuid(uuidOrFid) : uuidOrFid;
		const res = await fetch(`/api/events/${uuid}?lang=${lang}`);
		if (res.status !== 200) {
			return left(handleClientError(res));
		}

		return right((await res.json()) as I18nEvent);
	};
}

export function getI18nEvent(uuidOrFid: string, lang: PortalLocale, useFid = true) {
	return i18nEventGetter(uuidOrFid, lang, useFid)();
}

export function getLatestEvents(lang: PortalLocale, count = 3): Promise<I18nEvent[]> {
	return fetch(`/api/events?lang=${lang}&latest=${count}`).then((res) => res.json());
}

export function searchI18nEvents(query: string, lang: PortalLocale): Promise<I18nEvent[]> {
	return fetch(`/api/events?lang=${lang}&q=${query}`).then((res) => res.json());
}

export function searchEventsArchive(
	lang: PortalLocale,
	pageSize: number,
	pageToken: number
): Promise<I18nEvent[]> {
	return fetch(`/api/events?lang=${lang}&page-size=${pageSize}&page-token=${pageToken}`).then(
		(res) => res.json() as Promise<I18nEvent[]>
	);
}
