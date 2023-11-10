import { H3Event, readBody } from "h3";
import { createFile as createFileNode } from "~/lib/api/antbox_proxy";
import assertFolderExists from "~/lib/api/assert_folder_exists";
import { PortalLocale } from "~/lib/model/types/portal_locale";

import { NodeFilter, NodeFilterResult, nodeServiceClient } from "~/lib/deps";

import {
	LegalAlert,
	fromLegalAlert,
	toLocalizedLegalAlert,
	I18nLegalAlert,
} from "~/lib/model/types/legal_alert";
import processFetchException from "~/lib/process_fetch_exception";

const LEGAL_ALERTS_FOLDER_FID = "legal-alerts";
const LEGAL_ALERTS_FOLDER_NAME = "Alertas Jurídicos";
const TARGET_ASPECT = "legal-alert";

const client = nodeServiceClient({ url: process.env.NUXT_PUBLIC_ANTBOX_URL! });

const listLegalAlertsHandler = defineEventHandler(async (evt: H3Event) => {
	const query = getQuery(evt) as Record<string, string | undefined>;
	const count = query.latest ? Number.parseInt(query.latest) : 4;

	const pageSize = query["page-size"] ? Number.parseInt(query["page-size"]) : count;
	const pageToken = query["page-token"] ? Number.parseInt(query["page-token"]) : 1;

	const firstElement = pageSize * (pageToken - 1);
	const lastElement = firstElement + pageSize;

	const lang = query.lang as PortalLocale | undefined;
	const nodes = await search(evt, query.q as string);

	return nodes
		.map((n) => toLocalizedLegalAlert(n, "{}", lang))
		.sort(newerFirst)
		.slice(firstElement, lastElement);
});

export const createLegalAlertHandler = defineEventHandler(async (evt) => {
	const parent = await assertFolderExists(LEGAL_ALERTS_FOLDER_FID, LEGAL_ALERTS_FOLDER_NAME);

	const event = (await readBody(evt)) as LegalAlert;

	const { node, file } = fromLegalAlert(event);

	node.parent = parent;
	node.aspects = [TARGET_ASPECT];

	return createFileNode(evt, file, node);
});

function newerFirst(l1: LegalAlert | I18nLegalAlert, l2: LegalAlert | I18nLegalAlert): number {
	if (l1.publishedOn > l2.publishedOn) {
		return -1;
	}
	return 1;
}

async function search(evt: H3Event, q?: string) {
	const criteria: NodeFilter[] = [["aspects", "contains", TARGET_ASPECT]];

	if (q) {
		criteria.push(["fulltext", "match", q]);
	}

	const nodeResultOrErr = await client
		.query(criteria, Number.MAX_SAFE_INTEGER)
		.catch(processFetchException<NodeFilterResult>(evt));

	if (nodeResultOrErr.isLeft()) {
		console.error(nodeResultOrErr.value);
		return [];
	}

	return nodeResultOrErr.value.nodes;
}

const router = createRouter();

router.get("/", listLegalAlertsHandler);
router.post("/", createLegalAlertHandler);

export default useBase("/api/legal-alerts", router.handler);
