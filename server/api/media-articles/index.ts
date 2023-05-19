import { H3Event, readBody } from "h3";
import { createFile as createFileNode } from "~/lib/api/antbox_proxy";
import assertFolderExists from "~/lib/api/assert_folder_exists";
import { PortalLocale } from "~/lib/model/types/portal_locale";

import useAntboxClient from "~/composables/use_antbox_client";

import { NodeFilter, Node, NodeFilterResult } from "~/lib/deps";
import {
	MediaArticle,
	fromMediaArticle,
	toLocalizedMediaArticle,
	I18nMediaArticle,
} from "~/lib/model/types/media_article";

const MEDIA_ARTICLES_FOLDER_FID = "media-articles";
const MEDIA_ARTICLES_NAME = "Artigos de Imprensa";
const TARGET_ASPECT = "media-article";

const listMediaArticlesHandler = defineEventHandler(async (evt: H3Event) => {
	const query = getQuery(evt) as Record<string, string | undefined>;
	const count = query.latest ? Number.parseInt(query.latest) : 4;

	const pageSize = query["page-size"] ? Number.parseInt(query["page-size"]) : count;
	const pageToken = query["page-token"] ? Number.parseInt(query["page-token"]) : 1;

	const firstElement = pageSize * (pageToken - 1);
	const lastElement = firstElement + pageSize;

	const lang = query.lang as PortalLocale | undefined;
	const nodes = await search(query.q as string);

	return nodes
		.map((n) => toLocalizedMediaArticle(n, "{}", lang))
		.sort(newerFirst)
		.slice(firstElement, lastElement);
});

const createMediaArticleHandler = defineEventHandler(async (evt) => {
	const parent = await assertFolderExists(MEDIA_ARTICLES_FOLDER_FID, MEDIA_ARTICLES_NAME);

	const event = (await readBody(evt)) as MediaArticle;

	const { node, file } = fromMediaArticle(event);

	node.parent = parent;
	node.aspects = [TARGET_ASPECT];

	return createFileNode(evt, file, node);
});

function newerFirst(l1: MediaArticle | I18nMediaArticle, l2: MediaArticle | I18nMediaArticle): number {
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

	const titlePtCriteria: NodeFilter[] = [alertsCriteria, ["properties.media-article:title.pt", "match", q]];

	const titleEnCriteria: NodeFilter[] = [alertsCriteria, ["properties.event:media-article.en", "match", q]];

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

router.get("/", listMediaArticlesHandler);
router.post("/", createMediaArticleHandler);

export default useBase("/api/media-articles", router.handler);
