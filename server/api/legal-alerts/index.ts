import { H3Event, readBody } from "h3";
import { createFile as createFileNode } from "~/lib/api/antbox_proxy";
import assertFolderExists from "~/lib/api/assert_folder_exists";
import { PortalLocale } from "~/lib/model/types/portal_locale";

import useAntboxClient from "~/composables/use_antbox_client";

import { Node, NodeFilter, NodeFilterResult } from "~/lib/deps";

import { LegalAlert, fromLegalAlert, toLocalizedLegalAlert, I18nLegalAlert } from "~/lib/model/types/legal_alert";
import processFetchException from "~/lib/process_fetch_exception";

const LEGAL_ALERTS_FOLDER_FID = "legal-alerts";
const LEGAL_ALERTS_FOLDER_NAME = "Alertas Jurídicos";
const TARGET_ASPECT = "legal-alert";

const client = useAntboxClient().nodeClient;

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
	const alertsCriteria: NodeFilter = ["aspects", "contains", TARGET_ASPECT];

	if (!q) {
		return or(evt, [alertsCriteria]);
	}

	const titlePtCriteria: NodeFilter[] = [alertsCriteria, ["properties.legal-alert:title.pt", "match", q]];

	const titleEnCriteria: NodeFilter[] = [alertsCriteria, ["properties.legal-alert:title.en", "match", q]];

	return or(evt, titlePtCriteria, titleEnCriteria);
}

async function or(evt: H3Event, ...filters: NodeFilter[][]) {
	const req = filters.map((f) => client.query(f, Number.MAX_SAFE_INTEGER).catch(processFetchException(evt)));
	const alertsOrErr = await Promise.all(req);

	const nodes = alertsOrErr
		.filter((e) => e.isRight())
		.map((e) => (e.value as NodeFilterResult).nodes)
		.flat();
	const result: Record<string, Node> = {};
	for (const node of nodes) {
		result[node.uuid] = node;
	}
	return Object.values(result);
}

const router = createRouter();

router.get("/", listLegalAlertsHandler);
router.post("/", createLegalAlertHandler);

export default useBase("/api/legal-alerts", router.handler);
