type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

function makeRequest(endpoint: string, method: HttpMethod, body?: any) {
	const headers = new Headers();

	const myInit = { method, headers, mode: "cors", cache: "default", body };

	if (method === "POST" || method === "PUT") {
		(headers as any)["Content-Type"] = "application/json";
		myInit.body = JSON.stringify(body);
	}

	return new Request(endpoint, myInit as RequestInit);
}

function postRequest(url: string, data: any): Promise<Response> {
	const request = makeRequest(url, "POST", data);

	return fetch(request);
}

function putRequest(
	baseUrl: string,
	uuid: string,
	data: any
): Promise<Response> {
	const request = makeRequest(baseUrl.concat("/", uuid), "PUT", data);

	return fetch(request);
}

function deleteRequest(url: string, uuid: string): Promise<Response> {
	const request = makeRequest(url.concat("/", uuid), "DELETE");
	return fetch(request);
}

export default {
	postRequest,
	putRequest,
	deleteRequest,
};
