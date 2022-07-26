import { IncomingMessage, ServerResponse } from "http";

import makeAntboxController, {
	AntboxController,
} from "~~/lib/api/antboxController";
import routeRequest, { RequestHandlers } from "~~/lib/api/apiRequestRouter";
import { NodeFilter, nodeServiceClient } from "~~/lib/deps";
import MediaArticle, {
	fromMediaArticle,
	toMediaArticle,
	toLocalizedMediaArticle,
	LocalizedMediaArticle,
} from "~~/lib/model/types/mediaArticle";

import processApiServerError from "~~/lib/processApiServerError";

import useParams from "~~/lib/useParams";

const TARGET_ASPECT = "media-article";

export default async function (req: IncomingMessage, res: ServerResponse) {
	const ctrl = makeAntboxController(
		req,
		res,
		fromMediaArticle,
		toMediaArticle,
		toLocalizedMediaArticle
	);

	const handlers = {
		DELETE: ctrl.delete,
		GET: getMediaArticle(ctrl, res),
		LIST: listMediaArticles(ctrl, req),
	};

	return routeRequest(req, handlers as RequestHandlers);
}

function getMediaArticle(
	ctrl: AntboxController<MediaArticle, LocalizedMediaArticle>,
	res: ServerResponse
): () => Promise<MediaArticle | LocalizedMediaArticle | void> {
	return () =>
		ctrl
			.get()
			.then((a: MediaArticle) => appendMediaArticleBody(a, ctrl.lang))
			.catch((err: unknown) => processApiServerError(res, err));
}

async function appendMediaArticleBody(
	alert: MediaArticle | LocalizedMediaArticle,
	lang: string
): Promise<MediaArticle | LocalizedMediaArticle> {
	const blob = await nodeServiceClient.export(alert.uuid);
	const blobText = await blob.text();
	const body = JSON.parse(blobText);

	if (lang) {
		return { ...alert, body: body[lang] };
	}

	return { ...alert, body };
}

function listMediaArticles(
	ctrl: AntboxController<MediaArticle, LocalizedMediaArticle>,
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
			.then((alerts: MediaArticle[]) => alerts?.sort(newerFirst))
			.then((alerts: MediaArticle[]) => {
				if (query.latest) {
					return alerts.slice(0, count);
				}

				return alerts;
			});
}

function search(
	ctrl: AntboxController<MediaArticle, LocalizedMediaArticle>,
	query: string
) {
	const alertsCriteria: NodeFilter = [
		"aspects",
		"array-contains",
		TARGET_ASPECT,
	];

	const titlePTCriteria: NodeFilter[] = [
		alertsCriteria,
		["properties.media-article:title.pt", "match", query],
	];

	const titleENCriteria: NodeFilter[] = [
		alertsCriteria,
		["properties.media-article:title.pt", "match", query],
	];

	const lawyerCriteria: NodeFilter[] = [
		alertsCriteria,
		["properties.media-article:lawyerName", "match", query],
	];

	return Promise.all([
		ctrl.list(titleENCriteria),
		ctrl.list(titlePTCriteria),
		ctrl.list(lawyerCriteria),
	])
		.then(
			([en, pt, lawyer]: [
				MediaArticle[],
				MediaArticle[],
				MediaArticle[]
			]) => [...en, ...pt, ...lawyer]
		)
		.then((alerts) => {
			const result = {};

			for (const alert of alerts) {
				result[alert.uuid] = alert;
			}

			return Object.values(result);
		})
		.then((alerts: MediaArticle[]) => alerts?.sort(newerFirst));
}

function newerFirst(l1: MediaArticle, l2: MediaArticle): number {
	if (l1.publishedOn > l2.publishedOn) {
		return -1;
	}
	return 1;
}
