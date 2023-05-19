import { readBody } from "h3";
import { deleteNode } from "~/lib/api/antbox_proxy";
import { PortalLocale } from "~/lib/model/types/portal_locale";
import processApiError from "~/lib/process_api_error";

import useAntboxClient from "~/composables/use_antbox_client";

import { MediaArticle, fromMediaArticle, toLocalizedMediaArticle } from "~/lib/model/types/media_article";

const TARGET_ASPECT = "media-article";

const client = useAntboxClient().nodeClient;

const getMediaArticleHandler = defineEventHandler(async (evt) => {
	const uuid = evt.context.params?.uuid;
	const lang = getQuery(evt).lang as PortalLocale | undefined;

	const [nodeOrErr, blobOrErr] = await Promise.all([client.get(uuid!), client.export(uuid!)]);

	if (nodeOrErr.isLeft()) {
		return processApiError(evt, nodeOrErr.value);
	}

	if (blobOrErr.isLeft()) {
		return processApiError(evt, blobOrErr.value);
	}

	const bodyText = await blobOrErr.value.text();

	return toLocalizedMediaArticle(nodeOrErr.value, bodyText, lang);
});

const updateMediaArticleHandler = defineEventHandler(async (evt) => {
	const uuid = evt.context.params?.uuid as string;
	const event = (await readBody(evt)) as MediaArticle;
	const { node, file } = fromMediaArticle(event);

	if (!node.aspects?.includes(TARGET_ASPECT)) {
		node.aspects = [TARGET_ASPECT, ...(node.aspects ?? [])];
	}

	const updateFileErr = await client.updateFile(uuid, file);
	if (updateFileErr.isLeft()) {
		return processApiError(evt, updateFileErr.value);
	}

	const updateNodeErr = await client.update(uuid, node);
	if (updateNodeErr.isLeft()) {
		return processApiError(evt, updateNodeErr.value);
	}
});

const router = createRouter();

router.get("/:uuid", getMediaArticleHandler);
router.put("/:uuid", updateMediaArticleHandler);
router.delete("/:uuid", defineEventHandler(deleteNode));

export default useBase("/api/media-articles", router.handler);
