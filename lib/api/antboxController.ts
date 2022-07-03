import { IncomingMessage, ServerResponse } from "http";
import { ANTBOX_SERVER_URL } from "~~/composables/containerConfig";

import {
	configureAntboxServer,
	nodeServiceClient,
	Node,
	NodeFilter,
	NodeFilterResult,
} from "~~/lib/deps";

import processApiServerError from "../processApiServerError";
import useParams from "../useParams";
import extractBody from "./bodyExtractor";
import nodeGetter from "./nodeGetter";

configureAntboxServer(ANTBOX_SERVER_URL);

export interface AntboxController<T, L> {
	updateNode(): Promise<string | void>;
	createFolder(parentUuid: string): Promise<string | void>;
	list(
		criteria: NodeFilter[],
		pageSize?: number,
		pageToken?: number
	): Promise<(T | L)[] | void>;
	get(): Promise<T | L | void>;
	delete(): Promise<string | void>;
	lang?: string;
}

export default function makeAntboxController<T, L>(
	req: IncomingMessage,
	res: ServerResponse,
	mapFrom: (value: T) => Node,
	mapTo: (value: Node) => T,
	mapToLocalized: (value: Node, lang: string) => L
) {
	const { uuid, lang } = useParams(req);
	const mapper = (
		lang ? (n: Node) => mapToLocalized(n, lang) : mapTo
	) as () => L | T;

	return {
		lang,

		async updateNode(): Promise<string | void> {
			const node = await extractBody(req, mapFrom);

			return nodeServiceClient
				.update(node.uuid, node)
				.then(() => node.uuid)
				.catch((err: unknown) => processApiServerError(res, err));
		},

		async createFolder(parentUuid: string): Promise<string | void> {
			const node = await extractBody(req, mapFrom);

			return nodeServiceClient
				.createFolder(node.title, parentUuid)
				.then((uuid: string) =>
					nodeServiceClient.update(uuid, node).then(() => uuid)
				)
				.catch((err: unknown) => processApiServerError(res, err));
		},

		list(criteria: NodeFilter[], pageSize = 1000, pageToken = 1) {
			return nodeServiceClient
				.query(criteria, pageSize, pageToken)
				.then((result: NodeFilterResult) => result.nodes)
				.then((nodes: Node[]) => nodes.map(mapper))
				.catch((err: unknown) => processApiServerError(res, err));
		},

		get(): Promise<T | L | void> {
			return nodeGetter.get(res, mapper as unknown as any, uuid);
		},

		async delete(): Promise<string | void> {
			return nodeServiceClient
				.delete(uuid)
				.then(() => "OK")
				.catch((err: unknown) => processApiServerError(res, err));
		},
	};
}
