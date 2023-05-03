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
	MediaArticle,
	fromMediaArticle,
	toLocalizedMediaArticle,
	LocalizedMediaArticle,
} from "~~/lib/model/types/media_article";

const MEDIA_ARTICLES_FOLDER_FID = "media-articles";
const MEDIA_ARTICLES_NAME = "Artigos de Imprensa";
const TARGET_ASPECT = "media-article";

export const getMediaArticleHandler = defineEventHandler(async (evt) => {
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

	return toLocalizedMediaArticle(nodeOrErr.value, bodyText, lang);
});

const listMediaArticlesHandler = defineEventHandler(async (evt: H3Event) => {
	const query = getQuery(evt) as Record<string, string | undefined>;
	const count = query.latest
		? Number.parseInt(query.latest ?? "4")
		: Number.MAX_SAFE_INTEGER;

	const lang = query.lang as PortalLocale | undefined;
	const nodes = await search(query.q as string);

	return nodes
		.map((n) => toLocalizedMediaArticle(n, "{}", lang))
		.sort(newerFirst)
		.slice(0, count);
});

export const createMediaArticleHandler = defineEventHandler(async (evt) => {
	const parent = await assertFolderExists(
		MEDIA_ARTICLES_FOLDER_FID,
		MEDIA_ARTICLES_NAME
	);

	const event = (await readBody(evt)) as MediaArticle;

	const { node, file } = fromMediaArticle(event);

	node.parent = parent;
	node.aspects = [TARGET_ASPECT];

	return createFileNode(evt, file, node);
});

export const updateMediaArticleHandler = defineEventHandler(async (evt) => {
	const uuid = evt.context.params?.uuid as string;
	const event = (await readBody(evt)) as MediaArticle;
	const { node, file } = fromMediaArticle(event);

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
	l1: MediaArticle | LocalizedMediaArticle,
	l2: MediaArticle | LocalizedMediaArticle
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

router.get("/", listMediaArticlesHandler);
router.get("/:uuid", getMediaArticleHandler);
router.post("/", createMediaArticleHandler);
router.put("/:uuid", updateMediaArticleHandler);
router.delete("/:uuid", defineEventHandler(deleteNode));

export default useBase("/api/events", router.handler);
