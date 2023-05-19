import { fidToUuid } from "../deps";
import { LegalAlert, I18nLegalAlert } from "../model/types/legal_alert";
import { PortalLocale } from "../model/types/portal_locale";

export interface I18nLegalAlertGetter {
	(): Promise<I18nLegalAlert | undefined>;
}

export interface LegalAlertGetter {
	(): Promise<LegalAlert | undefined>;
}

export function i18nLegalAlertGetter(uuidOrFid: string, lang: PortalLocale, useFid = true): I18nLegalAlertGetter {
	return async () => {
		const uuid = useFid ? fidToUuid(uuidOrFid) : uuidOrFid;
		const res = await fetch(`/api/legal-alerts/${uuid}?lang=${lang}`);
		if (res.status !== 200) {
			return undefined;
		}

		return res.json() as Promise<I18nLegalAlert>;
	};
}

export function getI18nLegalAlert(
	uuid: string,
	lang: PortalLocale,
	useFid = true
): Promise<I18nLegalAlert | undefined> {
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
	return fetch(`/api/legal-alerts?lang=${lang}&page-size=${pageSize}&page-token=${pageToken}`).then(
		(res) => res.json() as Promise<I18nLegalAlert[]>
	);
}

export function searchI18nLegalAlerts(query: string, lang: PortalLocale): Promise<I18nLegalAlert[]> {
	return fetch(`/api/legal-alerts?lang=${lang}&q=${query}`).then((res) => res.json());
}
