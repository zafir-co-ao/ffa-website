import { Either, left } from "~/lib/deps";
import { setResponseStatus, H3Event } from "h3";

export default function processFetchException<T>(evt: H3Event): (err: Error) => Either<Error, T> {
	return (err: Error) => {
		setResponseStatus(evt, 500);

		console.error(err);

		return left(err);
	};
}
