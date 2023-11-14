import { H3Event, readBody } from "h3";
import { createFile as createFileNode } from "~/lib/api/antbox_proxy";
import assertFolderExists from "~/lib/api/assert_folder_exists";
import type { PortalLocale } from "~/lib/model/types/portal_locale";

import { type NodeFilter, type NodeFilterResult, nodeServiceClient } from "~/lib/deps";
import {
	type MediaArticle,
	fromMediaArticle,
	toLocalizedMediaArticle,
	type I18nMediaArticle,
} from "~/lib/model/types/media_article";
import processFetchException from "~/lib/process_fetch_exception";

const MEDIA_ARTICLES_FOLDER_FID = "media-articles";
const MEDIA_ARTICLES_NAME = "Artigos de Imprensa";
const TARGET_ASPECT = "media-article";

const client = nodeServiceClient({ url: process.env.NUXT_PUBLIC_ANTBOX_URL! });

const listMediaArticlesHandler = defineEventHandler(async (evt: H3Event) => {
	const query = getQuery(evt) as Record<string, string | undefined>;
	const count = query.latest ? Number.parseInt(query.latest) : 4;

	const pageSize = query["page-size"] ? Number.parseInt(query["page-size"]) : count;
	const pageToken = query["page-token"] ? Number.parseInt(query["page-token"]) : 1;

	const firstElement = pageSize * (pageToken - 1);
	const lastElement = firstElement + pageSize;

	const lang = query.lang as PortalLocale | undefined;
	const nodes = await search(evt, query.q as string);

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

function newerFirst(
	l1: MediaArticle | I18nMediaArticle,
	l2: MediaArticle | I18nMediaArticle
): number {
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

router.get("/", listMediaArticlesHandler);
router.post("/", createMediaArticleHandler);

export default useBase("/api/media-articles", router.handler);
