import { fidToUuid, left, right } from "../deps";
import type { I18nLegalAlert } from "../model/types/legal_alert";
import { type PortalLocale } from "../model/types/portal_locale";
import type { APIClientGetter } from "./api_client_getter";
import handleClientError from "./handle_client_error";

export type I18nLegalAlertGetter = APIClientGetter<I18nLegalAlert>;

export function i18nLegalAlertGetter(
	uuidOrFid: string,
	lang: PortalLocale,
	useFid = true
): I18nLegalAlertGetter {
	return async () => {
		const uuid = useFid ? fidToUuid(uuidOrFid) : uuidOrFid;
		const res = await fetch(`/api/legal-alerts/${uuid}?lang=${lang}`);
		if (res.status !== 200) {
			return left(handleClientError(res));
		}

		return right((await res.json()) as I18nLegalAlert);
	};
}

export function getI18nLegalAlert(uuid: string, lang: PortalLocale, useFid = true) {
	return i18nLegalAlertGetter(uuid, lang, useFid)();
}

export function getLatestLegalAlerts(lang: PortalLocale, count = 2): Promise<I18nLegalAlert[]> {
	return fetch(`/api/legal-alerts?lang=${lang}&latest=${count}`).then((res) => res.json());
}

export function searchLegalAlertsArchive(
	lang: PortalLocale,
	pageSize: number,
	pageToken: number
): Promise<I18nLegalAlert[]> {
	return fetch(
		`/api/legal-alerts?lang=${lang}&page-size=${pageSize}&page-token=${pageToken}`
	).then((res) => res.json() as Promise<I18nLegalAlert[]>);
}

export function searchI18nLegalAlerts(
	query: string,
	lang: PortalLocale
): Promise<I18nLegalAlert[]> {
	return fetch(`/api/legal-alerts?lang=${lang}&q=${query}`).then((res) => res.json());
}
