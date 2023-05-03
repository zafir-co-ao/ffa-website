import { createRouter, defineEventHandler, useBase, H3Event } from "h3";
import { Node, NodeFilter, NodeServiceClient, fidToUuid } from "~~/lib/deps";

import {
	deleteNode,
	getNode,
	searchNodes,
	updateNode,
} from "~/lib/api/antbox_proxy";
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
	const to = lang
		? (n: Node) => toLocalizedSectionHeader(n, lang)
		: toSectionHeader;
	const filters: NodeFilter[] = [["aspects", "contains", TARGET_ASPECT]];

	return searchNodes<SectionHeader, LocalizedSectionHeader>(evt, to, filters);
});

const createSectionHeaderHandler = defineEventHandler(async (evt) => {
	const client = useAntboxClient().nodesClient;
	const parent = await assertFolderExists(
		BANNERS_FOLDER_FID,
		BANNERS_FOLDER_NAME
	);
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
router.get("/:uuid", defineEventHandler(getNode(toLocalizedSectionHeader)));
router.post("/", createSectionHeaderHandler);
router.put("/:uuid", defineEventHandler(updateNode(fromSectionHeader)));
router.delete("/:uuid", defineEventHandler(deleteNode));

export default useBase("/api/banners", router.handler);
