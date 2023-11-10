import { H3Event, createRouter, defineEventHandler, useBase } from "h3";

import { getNode } from "~/lib/api/antbox_proxy";
import { nodeServiceClient } from "~/lib/deps";
import { toLocalizedSectionHeader, fromSectionHeader } from "~/lib/model/types/section_header";

const client = nodeServiceClient({ url: process.env.NUXT_PUBLIC_ANTBOX_URL! });

async function readParts(evt: H3Event): Promise<Record<string, Buffer>> {
	const req = await readMultipartFormData(evt);

	return (
		req?.reduce((acc, cur) => {
			acc[cur.name as string] = cur.data;
			return acc;
		}, {} as Record<string, Buffer>) ?? {}
	);
}

const updateHeaderHandler = defineEventHandler(async (evt) => {
	const parts = await readParts(evt);
	const uuid = evt.context.params?.uuid as string;

	if (parts.metadata) {
		const header = JSON.parse(parts.metadata.toString("utf-8"));
		const node = fromSectionHeader(header);

		await client.update(uuid, node);
	}

	if (parts.file) {
		const file = new File([parts.file], uuid);
		await client.updateFile(uuid, file);
	}

	return "OK";
});

const router = createRouter();

router.get("/:uuid", defineEventHandler(getNode(toLocalizedSectionHeader)));
router.put("/:uuid", updateHeaderHandler);

export default useBase("/api/section-headers", router.handler);
