import { H3Event, readBody } from "h3";
import { createFile as createFileNode } from "~/lib/api/antbox_proxy";
import assertFolderExists from "~/lib/api/assert_folder_exists";
import { PortalLocale } from "~/lib/model/types/portal_locale";

import useAntboxClient from "~/composables/use_antbox_client";

import { NodeFilter, Node, NodeFilterResult } from "~/lib/deps";
import { Event, fromEvent, toLocalizedEvent, I18nEvent } from "~/lib/model/types/event";

const EVENTS_FOLDER_FID = "events";
const EVENTS_FOLDER_NAME = "Eventos";
const TARGET_ASPECT = "event";

const listEventsHandler = defineEventHandler(async (evt: H3Event) => {
	const query = getQuery(evt) as Record<string, string | undefined>;
	const count = query.latest ? Number.parseInt(query.latest ?? "4") : Number.MAX_SAFE_INTEGER;

	const lang = query.lang as PortalLocale | undefined;
	const nodes = await search(query.q as string);

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
	if (l1.publishedOn > l2.publishedOn) {
		return -1;
	}
	return 1;
}

async function search(q?: string) {
	const alertsCriteria: NodeFilter = ["aspects", "contains", TARGET_ASPECT];

	if (!q) {
		return or([alertsCriteria]);
	}

	const titlePtCriteria: NodeFilter[] = [alertsCriteria, ["properties.event:title.pt", "match", q]];

	const titleEnCriteria: NodeFilter[] = [alertsCriteria, ["properties.event:title.en", "match", q]];

	return or(titlePtCriteria, titleEnCriteria);
}

async function or(...filters: NodeFilter[][]) {
	const client = useAntboxClient().nodeClient;
	const req = filters.map((f) => client.query(f, Number.MAX_SAFE_INTEGER));

	const eventsOrErr = await Promise.all(req);

	const nodes = eventsOrErr
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

router.get("/", listEventsHandler);
router.post("/", createEventHandler);

export default useBase("/api/events", router.handler);
