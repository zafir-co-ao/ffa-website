import { fidToUuid } from "@zafir.co.ao/lightray";
import { PortalLocale } from "../model/types/portal_locale";
import { LocalizedSectionHeader } from "../model/types/section_header";

export interface I18nSectionHeaderGetter {
	(): Promise<LocalizedSectionHeader | undefined>;
}

export function i18nSectionHeaderGetter(uuidOrFid: string, lang: PortalLocale, useFid = true): I18nSectionHeaderGetter {
	return async () => {
		const uuid = useFid ? fidToUuid(uuidOrFid) : uuidOrFid;
		const res = await fetch(`/api/section-headers/${uuid}?lang=${lang}`);
		if (res.status !== 200) {
			return;
		}

		return res.json() as Promise<LocalizedSectionHeader>;
	};
}
