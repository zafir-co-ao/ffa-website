import { createRouter, defineEventHandler, useBase, H3Event } from "h3";
import { type Node, type NodeFilter, nodeServiceClient } from "~/lib/deps";

import { searchNodes } from "~/lib/api/antbox_proxy";
import {
	type Banner,
	toI18nBanner,
	toBanner,
	type I18nBanner,
	fromBanner,
} from "~/lib/model/types/banner";
import type { PortalLocale } from "~/lib/model/types/portal_locale";
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

const listBannersHandler = defineEventHandler(async (evt) => {
	const lang = getQuery(evt).lang as PortalLocale | undefined;
	const to = lang ? (n: Node) => toI18nBanner(n, lang) : toBanner;
	const filters: NodeFilter[] = [["aspects", "contains", TARGET_ASPECT]];

	const banners = await searchNodes<Banner, I18nBanner>(evt, to, filters);

	if ((banners as any).isError) {
		return banners;
	}

	return (banners as Banner[]).sort((a, b) => b.priority - a.priority);
});

const createBannerHandler = defineEventHandler(async (evt) => {
	const client = nodeServiceClient({ url: process.env.NUXT_PUBLIC_ANTBOX_URL! });
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
