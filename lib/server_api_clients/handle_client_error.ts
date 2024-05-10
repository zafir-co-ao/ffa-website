import type { AntboxError } from "antbox-sdk";

export default function handleClientError(res: Response): AntboxError {
	switch (res.status) {
		case 400:
			return "BadRequestError";
		case 403:
			return "ForbiddenError";
		case 404:
			return "NotFoundError";
		default:
			console.error("Error: ", res.status);
			console.error(res.statusText);

			return "ServerError";
	}
}
