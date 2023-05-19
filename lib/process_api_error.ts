import { setResponseStatus, H3Event } from "h3";

export default function processApiError(evt: H3Event, err: unknown) {
	setResponseStatus(evt, 500);

	console.error(err);

	return { isError: true, err };
}
