import { createRouter, defineEventHandler, useBase, H3Event } from "h3";
import { Node, NodeFilter, nodeServiceClient } from "~/lib/deps";

import { searchNodes } from "~/lib/api/antbox_proxy";
import {
	Banner,
	toLocalizedBanner,
	toBanner,
	LocalizedBanner,
	fromBanner,
} from "~/lib/model/types/banner";
import { PortalLocale } from "~/lib/model/types/portal_locale";
import assertFolderExists from "~/lib/api/assert_folder_exists";

const BANNERS_FOLDER_FID = "banners";
const BANNERS_FOLDER_NAME = "Banners";
const TARGET_ASPECT = "banner";

async function readParts(evt: H3Event): Promise<Record<string, Buffer>> {
	const req = await readMultipartFormData(evt);

	return (
		req?.reduce((acc, cur) => {
			acc[cur.name as string] = cur.data;
			return acc;
		}, {} as Record<string, Buffer>) ?? {}
	);
}

const listBannersHandler = defineEventHandler((evt) => {
	const lang = getQuery(evt).lang as PortalLocale | undefined;
	const to = lang ? (n: Node) => toLocalizedBanner(n, lang) : toBanner;
	const filters: NodeFilter[] = [["aspects", "contains", TARGET_ASPECT]];

	return searchNodes<Banner, LocalizedBanner>(evt, to, filters);
});

const createBannerHandler = defineEventHandler(async (evt) => {
	const client = nodeServiceClient(process.env.NUXT_ANTBOX_URL!);
	const parent = await assertFolderExists(BANNERS_FOLDER_FID, BANNERS_FOLDER_NAME);
	const parts = await readParts(evt);

	if (!parts.metadata) {
		return;
	}

	const banner = JSON.parse(parts.metadata.toString("utf-8"));
	const node = fromBanner(banner);
	node.parent = parent;

	const file = new File([parts.file], banner.title);

	return client.createFile(file, node);
});

const router = createRouter();

router.get("/", listBannersHandler);
router.post("/", createBannerHandler);

export default useBase("/api/banners", router.handler);
