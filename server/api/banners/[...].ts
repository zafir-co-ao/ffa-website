import { H3Event, createRouter, defineEventHandler, useBase } from "h3";

import { deleteNode, getNode } from "~/lib/api/antbox_proxy";
import { nodeServiceClient } from "~/lib/deps";
import { toLocalizedBanner, fromBanner } from "~/lib/model/types/banner";

const client = nodeServiceClient(process.env.NUXT_ANTBOX_URL!);

async function readParts(evt: H3Event): Promise<Record<string, Buffer>> {
	const req = await readMultipartFormData(evt);

	return (
		req?.reduce((acc, cur) => {
			acc[cur.name as string] = cur.data;
			return acc;
		}, {} as Record<string, Buffer>) ?? {}
	);
}

const updateBannerHandler = defineEventHandler(async (evt) => {
	const parts = await readParts(evt);
	const uuid = evt.context.params?.uuid as string;

	if (parts.metadata) {
		const banner = JSON.parse(parts.metadata.toString("utf-8"));
		const node = fromBanner(banner);

		await client.update(uuid, node);
	}

	if (parts.file) {
		const file = new File([parts.file], uuid);
		await client.updateFile(uuid, file);
	}

	return "OK";
});

const router = createRouter();

router.get("/:uuid", defineEventHandler(getNode(toLocalizedBanner)));
router.put("/:uuid", updateBannerHandler);
router.delete("/:uuid", defineEventHandler(deleteNode));

export default useBase("/api/banners", router.handler);
