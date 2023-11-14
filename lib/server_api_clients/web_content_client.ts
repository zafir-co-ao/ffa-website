import { WebContent, fidToUuid } from "~/lib/deps";
import { PortalLocale } from "~/lib/model/types/portal_locale";

export interface I18nWebContentGetter {
	(): Promise<string>;
}

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

		return contentOrErr as string;
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
