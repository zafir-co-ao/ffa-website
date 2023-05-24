import { readBody } from "h3";
import { deleteNode } from "~/lib/api/antbox_proxy";
import { PortalLocale } from "~/lib/model/types/portal_locale";
import processApiError from "~/lib/process_api_error";

import { Node, nodeServiceClient } from "~/lib/deps";

import { LegalAlert, fromLegalAlert, toLocalizedLegalAlert } from "~/lib/model/types/legal_alert";
import processFetchException from "~/lib/process_fetch_exception";

const TARGET_ASPECT = "legal-alert";

const client = nodeServiceClient(process.env.NUXT_ANTBOX_URL!);

export const getLegalAlertHandler = defineEventHandler(async (evt) => {
	const uuid = evt.context.params?.uuid;
	const lang = getQuery(evt).lang as PortalLocale | undefined;

	const [nodeOrErr, blobOrErr] = await Promise.all([
		client.get(uuid!).catch(processFetchException<Node>(evt)),
		client.export(uuid!).catch(processFetchException<Blob>(evt)),
	]);

	if (nodeOrErr.isLeft()) {
		return processApiError(evt, nodeOrErr.value);
	}

	if (blobOrErr.isLeft()) {
		return processApiError(evt, blobOrErr.value);
	}

	const bodyText = await blobOrErr.value.text();

	return toLocalizedLegalAlert(nodeOrErr.value, bodyText, lang);
});

export const updateLegalAlertHandler = defineEventHandler(async (evt) => {
	const uuid = evt.context.params?.uuid as string;
	const event = (await readBody(evt)) as LegalAlert;
	const { node, file } = fromLegalAlert(event);

	if (!node.aspects?.includes(TARGET_ASPECT)) {
		node.aspects = [TARGET_ASPECT, ...(node.aspects ?? [])];
	}

	const updateFileErr = await client.updateFile(uuid, file).catch(processFetchException(evt));
	if (updateFileErr.isLeft()) {
		return processApiError(evt, updateFileErr.value);
	}

	const updateNodeErr = await client.update(uuid, node).catch(processFetchException(evt));
	if (updateNodeErr.isLeft()) {
		return processApiError(evt, updateNodeErr.value);
	}

	return "OK";
});

const router = createRouter();

router.get("/:uuid", getLegalAlertHandler);
router.put("/:uuid", updateLegalAlertHandler);
router.delete("/:uuid", defineEventHandler(deleteNode));

export default useBase("/api/legal-alerts", router.handler);
