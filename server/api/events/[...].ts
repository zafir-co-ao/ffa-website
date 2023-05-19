import { readBody } from "h3";
import { deleteNode } from "~/lib/api/antbox_proxy";
import { PortalLocale } from "~/lib/model/types/portal_locale";
import processApiError from "~/lib/process_api_error";

import useAntboxClient from "~/composables/use_antbox_client";

import { Event, fromEvent, toLocalizedEvent } from "~/lib/model/types/event";

const TARGET_ASPECT = "event";
const client = useAntboxClient().nodeClient;

export const getEventHandler = defineEventHandler(async (evt) => {
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

	return toLocalizedEvent(nodeOrErr.value, bodyText, lang);
});

export const updateEventHandler = defineEventHandler(async (evt) => {
	const uuid = evt.context.params?.uuid as string;
	const event = (await readBody(evt)) as Event;
	const { node, file } = fromEvent(event);

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

router.get("/:uuid", getEventHandler);
router.put("/:uuid", updateEventHandler);
router.delete("/:uuid", defineEventHandler(deleteNode));

export default useBase("/api/events", router.handler);
