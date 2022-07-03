import { ServerResponse } from "http";
import { nodeServiceClient, Node } from "../deps";
import processApiServerError from "../processApiServerError";

export default {
	get: <T, L>(res: ServerResponse, mapTo: (n: Node) => T | L, uuid: string) =>
		nodeServiceClient
			.get(uuid)
			.then((node: Node) => {
				if (!node) {
					res.statusCode = 404;
					res.statusMessage = "Entidade nao encontrada";
					res.end();
					return;
				}

				return mapTo(node);
			})
			.catch((err: unknown) => processApiServerError(res, err)),
};
