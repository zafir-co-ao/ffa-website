import { IncomingMessage, ServerResponse } from "http";
import makeAntboxController, {
	AntboxController,
} from "~~/lib/api/antboxController";
import routeRequest from "~~/lib/api/apiRequestRouter";
import extractBody from "~~/lib/api/bodyExtractor";
import { fidToUuid, NodeFilter, nodeServiceClient } from "~~/lib/deps";
import Lawyer, {
	fromLawyer,
	LocalizedLawyer,
	toLawyer,
	toLocalizedLawyer,
} from "~~/lib/model/lawyer";
import useParams from "~~/lib/useParams";

import { useBody } from "h3";

const LAWYERS_PARENT_FOLDER_FID = "advogados";
const LAWYERS_PARENT_FOLDER_UUID = fidToUuid(LAWYERS_PARENT_FOLDER_FID);

export default async function (req: IncomingMessage, res: ServerResponse) {
	const ctrl = makeAntboxController(
		req,
		res,
		fromLawyer,
		toLawyer,
		toLocalizedLawyer
	);

	const handlers = {
		PUT: ctrl.updateNode,
		POST: createLawyer(ctrl, req),
		DELETE: ctrl.delete,
		GET: ctrl.get,
		LIST: listLawyers(ctrl, req),
	};

	return routeRequest(req, handlers);
}

function createLawyer(
	ctrl: AntboxController<Lawyer, LocalizedLawyer>,
	req: IncomingMessage
) {
	return async () => {
		const parentUuid = await assertParentFolder();

		const node = await extractBody(req, fromLawyer);

		return ctrl.createFolder(parentUuid).then((uuid) => {
			if (!uuid) {
				return;
			}

			return nodeServiceClient.update(uuid, node).then(() => uuid);
		});
	};
}

async function assertParentFolder(): Promise<string> {
	const parent = await nodeServiceClient.get(LAWYERS_PARENT_FOLDER_UUID);
	if (parent) {
		return parent.uuid;
	}

	const parentUuid = await nodeServiceClient.createFolder("Advogados");
	await nodeServiceClient.update(parentUuid, {
		fid: LAWYERS_PARENT_FOLDER_FID,
	});

	return parentUuid;
}

function listLawyers(
	ctrl: AntboxController<Lawyer, LocalizedLawyer>,
	req: IncomingMessage
) {
	const { query } = useParams(req);

	const lawyersCriteria: NodeFilter[] = [
		["aspects", "array-contains", "lawyer"],
	];

	if (query.category) {
		lawyersCriteria.push([
			"properties.lawyer:category",
			"==",
			query.category,
		]);
	}

	if (query.q) {
		lawyersCriteria.push(["title", "match", query.q]);
	}

	return async () =>
		ctrl
			.list(lawyersCriteria, 100)
			.then((lawyers) =>
				(lawyers as Lawyer[])?.sort((l1, l2) =>
					l1.name < l2.name ? -1 : 1
				)
			);
}
