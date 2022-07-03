import { IncomingMessage } from "http";
import { useBody } from "h3";

import { Node } from "~~/lib/deps";

export default async function extractBody<T>(
	req: IncomingMessage,
	mapper: (v: T) => Node
) {
	const lawyer = await useBody(req);
	const node = mapper(lawyer);

	return node;
}
