import { fidToUuid } from "@zafir.co.ao/lightray";
import { PortalLocale } from "~/lib/model/types/portal_locale";

export interface I18nWebContentGetter {
	(): Promise<string>;
}

export function i18nWebContentGetter(
	uuidOrFid: string,
	lang: PortalLocale,
	useFid: boolean = true
): I18nWebContentGetter {
	const client = useAntboxWebcontentClient();

	return async () => {
		const uuid = useFid ? fidToUuid(uuidOrFid) : uuidOrFid;
		const contentOrErr = await client.get(uuid, lang);
		return contentOrErr as string;
	};
}
