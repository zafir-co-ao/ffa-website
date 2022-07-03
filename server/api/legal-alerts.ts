import { IncomingMessage, ServerResponse } from "http";

import makeAntboxController, {
	AntboxController,
} from "~~/lib/api/antboxController";
import routeRequest, { RequestHandlers } from "~~/lib/api/apiRequestRouter";
import { NodeFilter, nodeServiceClient } from "~~/lib/deps";
import LegalAlert, {
	fromLegalAlert,
	LocalizedLegalAlert,
	toLegalAlert,
	toLocalizedLegalAlert,
} from "~~/lib/model/legalAlerts";
import processApiServerError from "~~/lib/processApiServerError";

import useParams from "~~/lib/useParams";

const TARGET_ASPECT = "legal-alert";

export default async function (req: IncomingMessage, res: ServerResponse) {
	const ctrl = makeAntboxController(
		req,
		res,
		fromLegalAlert,
		toLegalAlert,
		toLocalizedLegalAlert
	);

	const handlers = {
		DELETE: ctrl.delete,
		GET: getLegalAlert(ctrl, res),
		LIST: listLegalAlerts(ctrl, req),
	};

	return routeRequest(req, handlers as RequestHandlers);
}

function getLegalAlert(
	ctrl: AntboxController<LegalAlert, LocalizedLegalAlert>,
	res: ServerResponse
): () => Promise<LegalAlert | LocalizedLegalAlert | void> {
	return () =>
		ctrl
			.get()
			.then((a: LegalAlert) => appendLegalAlertBody(a, ctrl.lang))
			.catch((err: unknown) => processApiServerError(res, err));
}

async function appendLegalAlertBody(
	alert: LegalAlert | LocalizedLegalAlert,
	lang: string
): Promise<LegalAlert | LocalizedLegalAlert> {
	const blob = await nodeServiceClient.export(alert.uuid);
	const blobText = await blob.text();
	const body = JSON.parse(blobText);

	if (lang) {
		return { ...alert, body: body[lang] };
	}

	return { ...alert, body };
}

function listLegalAlerts(
	ctrl: AntboxController<LegalAlert, LocalizedLegalAlert>,
	req: IncomingMessage
) {
	const alertsCriteria: NodeFilter[] = [
		["aspects", "array-contains", TARGET_ASPECT],
	];

	const { query } = useParams(req);
	const count = Number.parseInt(query.latest ?? "4");
	const pageSize = Number.parseInt(query["page-size"] ?? "1000");
	const pageToken = Number.parseInt(query["page-token"] ?? "1");

	if (query.q) {
		return () => search(ctrl, query.q);
	}

	return () =>
		ctrl
			.list(alertsCriteria, pageSize, pageToken)
			.then((alerts: LegalAlert[]) => alerts?.sort(newerFirst))
			.then((alerts: LegalAlert[]) => {
				if (query.latest) {
					return alerts.slice(0, count);
				}

				return alerts;
			});
}

function search(
	ctrl: AntboxController<LegalAlert, LocalizedLegalAlert>,
	query: string
) {
	const alertsCriteria: NodeFilter = [
		"aspects",
		"array-contains",
		TARGET_ASPECT,
	];

	const titlePTCriteria: NodeFilter[] = [
		alertsCriteria,
		["properties.legal-alert:title.pt", "match", query],
	];

	const titleENCriteria: NodeFilter[] = [
		alertsCriteria,
		["properties.legal-alert:title.pt", "match", query],
	];

	return Promise.all([ctrl.list(titleENCriteria), ctrl.list(titlePTCriteria)])
		.then(([en, pt]: [LegalAlert[], LegalAlert[]]) => [...en, ...pt])
		.then((alerts) => {
			const result = {};

			for (const alert of alerts) {
				result[alert.uuid] = alert;
			}

			return Object.values(result);
		})
		.then((alerts: LegalAlert[]) => alerts?.sort(newerFirst));
}

function newerFirst(l1: LegalAlert, l2: LegalAlert): number {
	if (l1.publishedOn > l2.publishedOn) {
		return -1;
	}
	return 1;
}
