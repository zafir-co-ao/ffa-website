import { type WebContent, fidToUuid, right } from "~/lib/deps";
import type { PortalLocale } from "~/lib/model/types/portal_locale";
import type { APIClientGetter } from "./api_client_getter";

export type I18nWebContentGetter = APIClientGetter<string>;
export interface WebContentGetter {
	(): Promise<WebContent>;
}

export interface WebContentSaver {
	(content: WebContent): Promise<void>;
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

		return right(contentOrErr as string);
	};
}

export function webContentGetter(uuidOrFid: string, useFid: boolean = true): WebContentGetter {
	const client = useAntboxWebcontentClient();

	return async () => {
		const uuid = useFid ? fidToUuid(uuidOrFid) : uuidOrFid;
		const contentOrErr = await client.get(uuid);

		return contentOrErr as WebContent;
	};
}

export function webContentSaver(): WebContentSaver {
	const client = useAntboxClient();

	return async (wc: WebContent) => {
		const rawValue = JSON.stringify(wc, null, 4);

		const file = new File([rawValue], wc.title, { type: "application/json" });

		return client
			.updateFile(wc.uuid, file)
			.then((voidOrErr) => {
				if (voidOrErr.isLeft()) {
					return console.error(voidOrErr.value);
				}
			})
			.catch((err) => console.error(err));
	};
}
