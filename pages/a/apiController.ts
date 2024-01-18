import { type Either, left, right } from "~/lib/deps";

export interface BaseData {
	uuid: string;
}

export interface ApiController<T> {
	load(rawUuid: string, builder: () => Partial<T>): Promise<Either<T, T>>;
	createOrUpdate(data: T): Promise<Either<string, void | string>>;
	create(data: T): Promise<Either<string, string>>;
	update(data: T): Promise<Either<string, void>>;
	delete(uuid: string): Promise<Either<string, void>>;
}

export default function makeApiController<T extends BaseData>(
	apiBaseUrl: string
): ApiController<T> {
	return {
		async load(uuid: string, builder: () => T): Promise<Either<T, T>> {
			const res = await useFetch<T>(apiBaseUrl.concat("/", uuid));

			const err = await res.error;
			const data = await res.data;

			if (err.value) {
				console.error(err.value);
				return left(builder());
			}

			return right(data.value as T);
		},

		createOrUpdate(data: T): Promise<Either<string, void | string>> {
			if (data.uuid) {
				return updateData(apiBaseUrl, data);
			}

			return createData(apiBaseUrl, data);
		},

		create(data: T): Promise<Either<string, string>> {
			return createData(apiBaseUrl, data);
		},

		update(data: T): Promise<Either<string, void>> {
			return updateData(apiBaseUrl, data);
		},

		delete(uuid: string): Promise<Either<string, undefined>> {
			return deleteRequest(apiBaseUrl.concat("/", uuid))
				.then(() => right<string, undefined>(undefined))
				.catch((err) => left(err as string));
		},
	};
}

async function createData<T>(url: string, data: T): Promise<Either<string, string>> {
	return postRequest(url, data)
		.then((res) => {
			if (!res.ok) {
				return left<string, string>(res.statusText);
			}

			return res.json().then((n) => right<string, string>(n.uuid));
		})
		.catch((err) => left(err as string));
}

async function updateData<T extends BaseData>(
	apiBaseUrl: string,
	data: T
): Promise<Either<string, void>> {
	return putRequest(apiBaseUrl.concat("/", data.uuid), data)
		.then((res) => {
			if (!res.ok) {
				return left<string, void>(res.statusText);
			}

			return right<string, void>(undefined);
		})
		.catch((err) => left(err as string));
}

function postRequest<T>(url: string, data?: T) {
	const headers = new Headers();
	headers.append("Content-Type", "application/json");
	headers.append("csrf-token", useCsrf().csrf);

	const body = JSON.stringify(data);

	return fetch(url, {
		method: "post",
		headers,
		body,
	});
}

function deleteRequest(url: string) {
	const headers = new Headers();

	return fetch(url, {
		method: "DELETE",
		headers,
	});
}

function putRequest<T>(url: string, data?: T) {
	const headers = new Headers();
	headers.append("Content-Type", "application/json");
	headers.append("csrf-token", useCsrf().csrf);

	const body = JSON.stringify(data);

	return fetch(url, {
		method: "put",
		headers,
		body,
	});
}
