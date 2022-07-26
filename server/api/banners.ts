import { IncomingMessage, ServerResponse } from "http";
import makeAntboxController, {
	AntboxController,
} from "~~/lib/api/antboxController";
import routeRequest, { RequestHandlers } from "~~/lib/api/apiRequestRouter";
import extractBody from "~~/lib/api/bodyExtractor";
import { fidToUuid, nodeServiceClient } from "~~/lib/deps";
import Banner, {
	fromBanner,
	LocalizedBanner,
	toBanner,
	toLocalizedBanner,
} from "~~/lib/model/types/banner";

const BANNERS_PARENT_FOLDER_FID = "banners";
const BANNERS_PARENT_FOLDER_UUID = fidToUuid(BANNERS_PARENT_FOLDER_FID);

/**
 * /api/banners/[uuid]/[lang]
 * uuid = '-' --> list all
 */

export default async function (req: IncomingMessage, res: ServerResponse) {
	const ctrl = makeAntboxController(
		req,
		res,
		fromBanner,
		toBanner,
		toLocalizedBanner
	);

	const handlers = {
		PUT: ctrl.updateNode,
		DELETE: ctrl.delete,
		GET: ctrl.get,
		POST: createBanner(ctrl, req),
		LIST: listBanners(ctrl),
	};

	return routeRequest(req, handlers as unknown as RequestHandlers);
}

function listBanners(
	ctrl: AntboxController<Banner, LocalizedBanner>
): () => Promise<(Banner | LocalizedBanner)[]> {
	return () =>
		ctrl
			.list([["aspects", "array-contains", "banner"]])
			.then((nodes: Banner[]) =>
				nodes?.sort((a, b) => b.priority - a.priority)
			);
}

function createBanner(_: any, req: IncomingMessage) {
	return async () => {
		const parentUuid = await assertParentFolder();

		const node = await extractBody(req, fromBanner);
		node.parent = parentUuid;

		return nodeServiceClient.update(node.uuid, node).then(() => node.uuid);
	};
}

async function assertParentFolder(): Promise<string> {
	const parent = await nodeServiceClient.get(BANNERS_PARENT_FOLDER_UUID);
	if (parent) {
		return parent.uuid;
	}

	const parentUuid = await nodeServiceClient.createFolder("Banners");
	await nodeServiceClient.update(parentUuid, {
		fid: BANNERS_PARENT_FOLDER_FID,
	});

	return parentUuid;
}
