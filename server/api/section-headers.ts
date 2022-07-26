import { IncomingMessage, ServerResponse } from "http";
import makeAntboxController, {
	AntboxController,
} from "~~/lib/api/antboxController";
import routeRequest, { RequestHandlers } from "~~/lib/api/apiRequestRouter";
import SectionHeader, {
	fromSectionHeader,
	LocalizedSectionHeader,
	toSectionHeader,
	toLocalizedSectionHeader,
} from "~~/lib/model/types/sectionHeader";

/**
 * /api/section-headers/[uuid]/[lang]
 * uuid = '-' --> list all
 */
export default async function (req: IncomingMessage, res: ServerResponse) {
	const ctrl = makeAntboxController(
		req,
		res,
		fromSectionHeader,
		toSectionHeader,
		toLocalizedSectionHeader
	);

	const handlers = {
		PUT: ctrl.updateNode,
		DELETE: ctrl.delete,
		GET: ctrl.get,
		LIST: listSectionHeaders(ctrl),
	};

	return routeRequest(req, handlers as unknown as RequestHandlers);
}

function listSectionHeaders(
	ctrl: AntboxController<SectionHeader, LocalizedSectionHeader>
): () => Promise<(SectionHeader | LocalizedSectionHeader)[]> {
	return () =>
		ctrl.list([["aspects", "array-contains", "section-header"]]) as Promise<
			(SectionHeader | LocalizedSectionHeader)[]
		>;
}
