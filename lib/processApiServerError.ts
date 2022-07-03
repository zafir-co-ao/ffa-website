import { ServerResponse } from "http";

export default function processApiServerError(
	res: ServerResponse,
	err: unknown
) {
	res.writeHead(500).end(JSON.stringify(err));
	console.error(err);
}
