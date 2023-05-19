import { createRouter, defineEventHandler, useBase, H3Event } from "h3";
import { Node, NodeFilter } from "~/lib/deps";

import { searchNodes } from "~/lib/api/antbox_proxy";
import {
	SectionHeader,
	toLocalizedSectionHeader,
	toSectionHeader,
	LocalizedSectionHeader,
	fromSectionHeader,
} from "~/lib/model/types/section_header";
import { PortalLocale } from "~/lib/model/types/portal_locale";
import assertFolderExists from "~/lib/api/assert_folder_exists";

const BANNERS_FOLDER_FID = "banners";
const BANNERS_FOLDER_NAME = "SectionHeaders";
const TARGET_ASPECT = "banner";

const listSectionHeadersHandler = defineEventHandler((evt) => {
	const lang = getQuery(evt).lang as PortalLocale | undefined;
	const to = lang ? (n: Node) => toLocalizedSectionHeader(n, lang) : toSectionHeader;
	const filters: NodeFilter[] = [["aspects", "contains", TARGET_ASPECT]];

	return searchNodes<SectionHeader, LocalizedSectionHeader>(evt, to, filters);
});

const createSectionHeaderHandler = defineEventHandler(async (evt) => {
	const client = useAntboxClient().nodeClient;
	const parent = await assertFolderExists(BANNERS_FOLDER_FID, BANNERS_FOLDER_NAME);
	const parts = await readParts(evt);

	if (!parts.metadata) {
		return;
	}

	const banner = JSON.parse(parts.metadata.toString("utf-8"));
	const node = fromSectionHeader(banner);
	node.parent = parent;

	const file = new File([parts.file], banner.title);

	return client.createFile(file, node);
});

async function readParts(evt: H3Event): Promise<Record<string, Buffer>> {
	const req = await readMultipartFormData(evt);

	return (
		req?.reduce((acc, cur) => {
			acc[cur.name as string] = cur.data;
			return acc;
		}, {} as Record<string, Buffer>) ?? {}
	);
}

const router = createRouter();

router.get("/", listSectionHeadersHandler);
router.post("/", createSectionHeaderHandler);

export default useBase("/api/section-headers", router.handler);
