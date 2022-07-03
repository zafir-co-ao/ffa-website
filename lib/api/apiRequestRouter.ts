import { IncomingMessage } from "http";
import { useMethod } from "h3";
import useParams from "../useParams";

export interface RequestHandlers {
	PUT: () => Promise<unknown>;
	POST: () => Promise<unknown>;
	DELETE: () => Promise<unknown>;
	GET: () => Promise<unknown>;
	LIST: () => Promise<unknown>;
	[key: string]: () => Promise<unknown>;
}

export default function routeRequest(
	req: IncomingMessage,
	handlers: RequestHandlers
): Promise<any> {
	const method = useMethod(req);

	const handler = handlers[method];

	if (handler && method !== "GET") {
		return handler();
	}

	const { uuid } = useParams(req);

	if (uuid) {
		return handlers.GET();
	}

	return handlers.LIST();
}
