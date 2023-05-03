import { IncomingMessage } from "http";
import { H3Event, readBody } from "h3";

import { Node } from "~~/lib/deps";

export async function mapBody<T>(evt: H3Event, mapper: (v: T) => Node) {
	const body = await readBody(evt);
	const node = mapper(body);

	return node;
}
