import { fidToUuid, left, right } from "~/lib/deps";
import type { PortalLocale } from "../model/types/portal_locale";
import type { I18nSectionHeader } from "../model/types/section_header";
import type { APIClientGetter } from "./api_client_getter";
import handleClientError from "./handle_client_error";

export type I18nSectionHeaderGetter = APIClientGetter<I18nSectionHeader>;

export function i18nSectionHeaderGetter(
	uuidOrFid: string,
	lang: PortalLocale,
	useFid = true
): I18nSectionHeaderGetter {
	return async () => {
		const uuid = useFid ? fidToUuid(uuidOrFid) : uuidOrFid;
		const res = await fetch(`/api/section-headers/${uuid}?lang=${lang}`);

		if (res.status !== 200) {
			return left(handleClientError(res));
		}

		return right((await res.json()) as I18nSectionHeader);
	};
}
