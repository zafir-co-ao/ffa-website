import { log } from "console";
import { type Either, left, right } from "~/lib/deps";

export interface BaseData {
	uuid: string;
}

export class ApiController<T extends BaseData> {
	constructor(readonly apiBaseUrl: string) {}

	async load(uuid: string, builder: () => T): Promise<Either<T, T>> {
		const res = await useFetch<T>(this.apiBaseUrl.concat("/", uuid));

		const err = await res.error;
		const data = await res.data;

		if (err.value) {
			console.error(err.value);
			return left(builder());
		}

		return right(data.value as T);
	}

	createOrUpdate(data: T): Promise<Either<string, void | string>> {
		if (data.uuid) {
			return updateData(this.apiBaseUrl, data);
		}

		return createData(this.apiBaseUrl, data);
	}

	create(data: T): Promise<Either<string, string>> {
		return createData(this.apiBaseUrl, data);
	}

	update(data: T): Promise<Either<string, void>> {
		return updateData(this.apiBaseUrl, data);
	}

	delete(uuid: string): Promise<Either<string, undefined>> {
		return deleteRequest(this.apiBaseUrl.concat("/", uuid))
			.then(() => right<string, undefined>(undefined))
			.catch((err) => left(err as string));
	}
}

export default function makeApiController<T extends BaseData>(
	apiBaseUrl: string
): ApiController<T> {
	return new ApiController<T>(apiBaseUrl);
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
