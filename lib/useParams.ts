import { IncomingMessage } from "http";
import url from "url";
import { useQuery } from "h3";

export interface HttpParms {
	uuid: string;
	lang: string;
	query: Record<string, string>;
}

export default function useParams(req: IncomingMessage): HttpParms {
	const { pathname } = url.parse(req.url, false);

	const [uuid, lang] = pathname?.split("/").filter((p) => p?.length > 0) ?? [];

	return {
		uuid: uuid === "-" ? undefined : uuid,
		lang,
		query: useQuery(req) as Record<string, string>,
	};
}
