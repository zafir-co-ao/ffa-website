import { H3Event, readBody } from "h3";
import {
	createFile as createFileNode,
	deleteNode,
} from "~/lib/api/antbox_proxy";
import assertFolderExists from "~/lib/api/assert_folder_exists";
import { PortalLocale } from "~/lib/model/types/portal_locale";
import processApiError from "~/lib/process_api_error";

import { NodeFilter, Node, NodeFilterResult } from "~~/lib/deps";
import {
	Event,
	fromEvent,
	toLocalizedEvent,
	LocalizedEvent,
} from "~~/lib/model/types/event";

const EVENTS_FOLDER_FID = "events";
const EVENTS_FOLDER_NAME = "Eventos";
const TARGET_ASPECT = "event";

export const getEventHandler = defineEventHandler(async (evt) => {
	const client = useAntboxClient().nodesClient;

	const uuid = evt.context.params?.uuid;
	const lang = getQuery(evt).lang as PortalLocale | undefined;

	const [nodeOrErr, blobOrErr] = await Promise.all([
		client.get(uuid!),
		client.export(uuid!),
	]);

	if (nodeOrErr.isLeft()) {
		return processApiError(evt, nodeOrErr.value);
	}

	if (blobOrErr.isLeft()) {
		return processApiError(evt, blobOrErr.value);
	}

	const bodyText = await blobOrErr.value.text();

	return toLocalizedEvent(nodeOrErr.value, bodyText, lang);
});

const listEventsHandler = defineEventHandler(async (evt: H3Event) => {
	const query = getQuery(evt) as Record<string, string | undefined>;
	const count = query.latest
		? Number.parseInt(query.latest ?? "4")
		: Number.MAX_SAFE_INTEGER;

	const lang = query.lang as PortalLocale | undefined;
	const nodes = await search(query.q as string);

	return nodes
		.map((n) => toLocalizedEvent(n, "{}", lang))
		.sort(newerFirst)
		.slice(0, count);
});

export const createEventHandler = defineEventHandler(async (evt) => {
	const parent = await assertFolderExists(
		EVENTS_FOLDER_FID,
		EVENTS_FOLDER_NAME
	);

	const event = (await readBody(evt)) as Event;

	const { node, file } = fromEvent(event);

	node.parent = parent;
	node.aspects = [TARGET_ASPECT];

	return createFileNode(evt, file, node);
});

export const updateEventHandler = defineEventHandler(async (evt) => {
	const uuid = evt.context.params?.uuid as string;
	const event = (await readBody(evt)) as Event;
	const { node, file } = fromEvent(event);

	if (!node.aspects?.includes(TARGET_ASPECT)) {
		node.aspects = [TARGET_ASPECT, ...(node.aspects ?? [])];
	}

	const client = useAntboxClient().nodesClient;

	const updateFileErr = await client.updateFile(uuid, file);
	if (updateFileErr.isLeft()) {
		return processApiError(evt, updateFileErr.value);
	}

	const updateNodeErr = await client.update(uuid, node);
	if (updateNodeErr.isLeft()) {
		return processApiError(evt, updateNodeErr.value);
	}
});

function newerFirst(
	l1: Event | LocalizedEvent,
	l2: Event | LocalizedEvent
): number {
	if (l1.publishedOn > l2.publishedOn) {
		return -1;
	}
	return 1;
}

async function search(q?: string) {
	const alertsCriteria: NodeFilter = ["aspects", "contains", TARGET_ASPECT];

	if (q) {
		return or([alertsCriteria]);
	}

	const titlePtCriteria: NodeFilter[] = [
		alertsCriteria,
		["properties.event:title.pt", "match", q],
	];

	const titleEnCriteria: NodeFilter[] = [
		alertsCriteria,
		["properties.event:title.en", "match", q],
	];

	return or(titlePtCriteria, titleEnCriteria);
}

async function or(...filters: NodeFilter[][]) {
	const client = useAntboxClient().nodesClient;
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
router.get("/:uuid", getEventHandler);
router.post("/", createEventHandler);
router.put("/:uuid", updateEventHandler);
router.delete("/:uuid", defineEventHandler(deleteNode));

export default useBase("/api/events", router.handler);
