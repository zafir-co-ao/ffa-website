import { fidToUuid } from "../deps";
import { I18nEvent } from "../model/types/event";
import { PortalLocale } from "../model/types/portal_locale";

export interface I18nEventGetter {
	(): Promise<I18nEvent | undefined>;
}

export interface EventGetter {
	(): Promise<Event | undefined>;
}

export function i18nEventGetter(uuidOrFid: string, lang: PortalLocale, useFid = true): I18nEventGetter {
	return async () => {
		const uuid = useFid ? fidToUuid(uuidOrFid) : uuidOrFid;
		const res = await fetch(`/api/events/${uuid}?lang=${lang}`);
		if (res.status !== 200) {
			return undefined;
		}

		return res.json() as Promise<I18nEvent>;
	};
}

export function getI18nEvent(uuidOrFid: string, lang: PortalLocale, useFid = true): Promise<I18nEvent | undefined> {
	return i18nEventGetter(uuidOrFid, lang, useFid)();
}

export function getLatestEvents(lang: PortalLocale, count = 3): Promise<I18nEvent[]> {
	return fetch(`/api/events?lang=${lang}&latest=${count}`).then((res) => res.json());
}

export function searchI18nEvents(query: string, lang: PortalLocale): Promise<I18nEvent[]> {
	return fetch(`/api/events?lang=${lang}&q=${query}`).then((res) => res.json());
}
