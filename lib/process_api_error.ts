import { setResponseStatus, H3Event } from "h3";

export default function processApiError(evt: H3Event, err: unknown) {
	const statusCode = err === "NotFoundError" ? 404 : 500;

	setResponseStatus(evt, statusCode);

	if (statusCode !== 404) console.error(err);

	return { isError: true, err };
}
