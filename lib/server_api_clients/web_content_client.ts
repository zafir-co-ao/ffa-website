import { fidToUuid } from "@zafir.co.ao/lightray";
import { PortalLocale } from "~/lib/model/types/portal_locale";
import useAntboxClient from "~/composables/use_antbox_client";

const client = useAntboxClient().webContentClient;

export interface I18nWebContentGetter {
	(): Promise<string>;
}

export function i18nWebContentGetter(
	uuidOrFid: string,
	lang: PortalLocale,
	useFid: boolean = true
): I18nWebContentGetter {
	return async () => {
		const uuid = useFid ? fidToUuid(uuidOrFid) : uuidOrFid;
		const contentOrErr = await client.get(uuid, lang);
		return contentOrErr as string;
	};
}
