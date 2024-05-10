import type { AntboxError } from "./deps";

export function throwNuxtErrorFromAntboxError(err: AntboxError) {
	throw createError({
		statusCode: getStatusCode(err),
		fatal: true,
	});
}

function getStatusCode(err: AntboxError) {
	switch (err) {
		case "BadRequestError":
			return 400;
		case "ForbiddenError":
			return 403;
		case "NotFoundError":
			return 404;
		default:
			return 500;
	}
}
