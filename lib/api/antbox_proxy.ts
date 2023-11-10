import { H3Event } from "h3";

import { Node, NodeFilter, nodeServiceClient } from "~/lib/deps";

import processApiError from "../process_api_error";
import { mapBody } from "./map_body";
import { PortalLocale } from "../model/types/portal_locale";

const client = nodeServiceClient({ url: process.env.NUXT_PUBLIC_ANTBOX_URL! });

export async function createFile(evt: H3Event, file: File, node: Node) {
	const nodeOrErr = await client.createFile(file, node);

	if (nodeOrErr.isLeft()) {
		return processApiError(evt, nodeOrErr);
	}

	return nodeOrErr.value;
}

export async function updateFile(evt: H3Event, uuid: string, file: File) {
	const voidOrErr = await client.updateFile(uuid, file);

	if (voidOrErr.isLeft()) {
		return processApiError(evt, voidOrErr);
	}

	return "OK";
}

export async function exportNode(evt: H3Event, uuid: string) {
	const voidOrErr = await client.export(uuid);

	console.log(voidOrErr);

	if (voidOrErr.isLeft()) {
		return processApiError(evt, voidOrErr);
	}

	return voidOrErr.value;
}

export function updateNode<T>(from: (t: T) => Node) {
	return async (evt: H3Event) => {
		const uuid = evt.context.params?.uuid;
		const node = await mapBody(evt, from);
		const voidOrErr = await client.update(uuid!, { ...node, uuid });

		if (voidOrErr.isLeft()) {
			return processApiError(evt, voidOrErr);
		}

		return "OK";
	};
}

export async function deleteNode(evt: H3Event) {
	const uuid = evt.context.params?.uuid;
	const voidOrrErr = await client.delete(uuid!);

	if (voidOrrErr.isLeft()) {
		return processApiError(evt, voidOrrErr);
	}

	return "OK";
}

export function getNode<T>(to: (n: Node, lang?: PortalLocale) => T) {
	return async (evt: H3Event) => {
		const uuid = evt.context.params?.uuid;
		const nodeOrErr = await client.get(uuid!);

		if (nodeOrErr.isLeft()) {
			return processApiError(evt, nodeOrErr);
		}

		const lang = getQuery(evt).lang as PortalLocale | undefined;
		return to(nodeOrErr.value, lang);
	};
}

export async function searchNodes<T, L>(
	evt: H3Event,
	to: (n: Node) => T | L,
	criteria: NodeFilter[],
	pageSize = 1000,
	pageToken = 1
) {
	const resultOrErr = await client.query(criteria, pageSize, pageToken);

	if (resultOrErr.isLeft()) {
		return processApiError(evt, resultOrErr);
	}

	return resultOrErr.value.nodes.map(to);
}
