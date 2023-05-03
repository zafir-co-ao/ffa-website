import { setResponseStatus, H3Event, send } from "h3";

export default function processApiError(evt: H3Event, err: unknown) {
	setResponseStatus(evt, 500);

	console.error(err);

	return { isError: true, err };
}
