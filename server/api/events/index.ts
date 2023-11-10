import { H3Event, readBody } from "h3";
import { createFile as createFileNode } from "~/lib/api/antbox_proxy";
import assertFolderExists from "~/lib/api/assert_folder_exists";
import { PortalLocale } from "~/lib/model/types/portal_locale";

import { NodeFilter, NodeFilterResult, nodeServiceClient } from "~/lib/deps";
import { Event, fromEvent, toLocalizedEvent, I18nEvent } from "~/lib/model/types/event";
import processFetchException from "~/lib/process_fetch_exception";

const EVENTS_FOLDER_FID = "events";
const EVENTS_FOLDER_NAME = "Eventos";
const TARGET_ASPECT = "event";

const client = nodeServiceClient({ url: process.env.NUXT_PUBLIC_ANTBOX_URL! });

const listEventsHandler = defineEventHandler(async (evt: H3Event) => {
	const query = getQuery(evt) as Record<string, string | undefined>;
	const count = query.latest ? Number.parseInt(query.latest ?? "4") : Number.MAX_SAFE_INTEGER;

	const lang = query.lang as PortalLocale | undefined;
	const nodes = await search(evt, query.q as string);

	return nodes
		.map((n) => toLocalizedEvent(n, "{}", lang))
		.sort(newerFirst)
		.slice(0, count);
});

export const createEventHandler = defineEventHandler(async (evt) => {
	const parent = await assertFolderExists(EVENTS_FOLDER_FID, EVENTS_FOLDER_NAME);

	const event = (await readBody(evt)) as Event;

	const { node, file } = fromEvent(event);

	node.parent = parent;
	node.aspects = [TARGET_ASPECT];

	return createFileNode(evt, file, node);
});

function newerFirst(l1: Event | I18nEvent, l2: Event | I18nEvent): number {
	if (l1.eventDateTime > l2.eventDateTime) {
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

router.get("/", listEventsHandler);
router.post("/", createEventHandler);

export default useBase("/api/events", router.handler);
