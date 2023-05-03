import either, { Either } from "~~/lib/either";
import fetchRequest from "~/lib/fetch_request";

export interface BaseData {
	uuid: string;
}

export interface ApiController<T> {
	load(rawUuid: string, builder: () => T): Promise<Either<T, string>>;
	createOrUpdate(data: T): Promise<Either<string | undefined, string>>;
	create(data: T): Promise<Either<string, string>>;
	update(data: T): Promise<Either<undefined, string>>;
	delete(uuid: string): Promise<Either<undefined, string>>;
}

export default function makeApiController<T extends BaseData>(
	apiBaseUrl: string
): ApiController<T> {
	return {
		async load(uuid: string, builder: () => T): Promise<Either<T, string>> {
			const res = await useFetch<T>(apiBaseUrl.concat("/", uuid));

			const err = await res.error;
			const data = await res.data;

			if (err.value) {
				return either.error(err, builder());
			}

			return either.success(data.value as T);
		},

		createOrUpdate(data: T): Promise<Either<string | undefined, string>> {
			if (data.uuid) {
				return updateData(apiBaseUrl, data);
			}

			return createData(apiBaseUrl, data);
		},

		create(data: T): Promise<Either<string, string>> {
			return createData(apiBaseUrl, data);
		},

		update(data: T): Promise<Either<undefined, string>> {
			return updateData(apiBaseUrl, data);
		},

		delete(uuid: string): Promise<Either<undefined, string>> {
			return fetchRequest
				.deleteRequest(apiBaseUrl, uuid)
				.then(() => either.success(undefined))
				.catch((err) => either.error(err));
		},
	};
}

function createData<T>(url: string, data: T): Promise<Either<string, string>> {
	return fetchRequest
		.postRequest(url, data)
		.then((response) => response.text())
		.then(either.success)
		.catch((err) => either.error(err));
}

function updateData<T extends BaseData>(
	apiBaseUrl: string,
	data: T
): Promise<Either<undefined, string>> {
	return fetchRequest
		.putRequest(apiBaseUrl, data.uuid, data)
		.then(() => either.success(undefined))
		.catch((err) => either.error(err));
}
