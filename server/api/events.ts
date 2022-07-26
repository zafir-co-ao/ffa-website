import { IncomingMessage, ServerResponse } from "http";

import makeAntboxController, {
	AntboxController,
} from "~~/lib/api/antboxController";
import routeRequest, { RequestHandlers } from "~~/lib/api/apiRequestRouter";
import { NodeFilter, nodeServiceClient } from "~~/lib/deps";
import Event, {
	fromEvent,
	toEvent,
	toLocalizedEvent,
	LocalizedEvent,
} from "~~/lib/model/types/event";

import processApiServerError from "~~/lib/processApiServerError";

import useParams from "~~/lib/useParams";

const TARGET_ASPECT = "event";

export default async function (req: IncomingMessage, res: ServerResponse) {
	const ctrl = makeAntboxController(
		req,
		res,
		fromEvent,
		toEvent,
		toLocalizedEvent
	);

	const handlers = {
		DELETE: ctrl.delete,
		GET: getEvent(ctrl, res),
		LIST: listEvents(ctrl, req),
	};

	return routeRequest(req, handlers as RequestHandlers);
}

function getEvent(
	ctrl: AntboxController<Event, LocalizedEvent>,
	res: ServerResponse
): () => Promise<Event | LocalizedEvent | void> {
	return () =>
		ctrl
			.get()
			.then((a: Event) => appendEventBody(a, ctrl.lang))
			.catch((err: unknown) => processApiServerError(res, err));
}

async function appendEventBody(
	alert: Event | LocalizedEvent,
	lang: string
): Promise<Event | LocalizedEvent> {
	const blob = await nodeServiceClient.export(alert.uuid);
	const blobText = await blob.text();
	const body = JSON.parse(blobText);

	if (lang) {
		return { ...alert, body: body[lang] };
	}

	return { ...alert, body };
}

function listEvents(
	ctrl: AntboxController<Event, LocalizedEvent>,
	req: IncomingMessage
) {
	const alertsCriteria: NodeFilter[] = [
		["aspects", "array-contains", TARGET_ASPECT],
	];

	const { query } = useParams(req);
	const count = Number.parseInt(query.latest ?? "4");

	if (query.q) {
		return () => search(ctrl, query.q);
	}

	return () =>
		ctrl
			.list(alertsCriteria)
			.then((alerts: Event[]) => alerts?.sort(newerFirst))
			.then((alerts: Event[]) => {
				if (query.latest) {
					return alerts.slice(0, count);
				}

				return alerts;
			});
}

function search(ctrl: AntboxController<Event, LocalizedEvent>, query: string) {
	const alertsCriteria: NodeFilter = [
		"aspects",
		"array-contains",
		TARGET_ASPECT,
	];

	const titlePTCriteria: NodeFilter[] = [
		alertsCriteria,
		["properties.event:title.pt", "match", query],
	];

	const titleENCriteria: NodeFilter[] = [
		alertsCriteria,
		["properties.event:title.pt", "match", query],
	];

	return Promise.all([ctrl.list(titleENCriteria), ctrl.list(titlePTCriteria)])
		.then(([en, pt]: [Event[], Event[]]) => [...en, ...pt])
		.then((alerts) => {
			const result = {};

			for (const alert of alerts) {
				result[alert.uuid] = alert;
			}

			return Object.values(result);
		})
		.then((alerts: Event[]) => alerts?.sort(newerFirst));
}

function newerFirst(l1: Event, l2: Event): number {
	if (l1.publishedOn > l2.publishedOn) {
		return -1;
	}
	return 1;
}
