import { H3Event, getQuery } from "h3";

import { NodeFilter } from "~~/lib/deps";
import Lawyer, {
	LocalizedLawyer,
	fromLawyer,
	toLocalizedLawyer,
} from "~~/lib/model/types/lawyer";
import assertFolderExists from "~/lib/api/assert_folder_exists";
import { mapBody } from "~/lib/api/map_body";
import { deleteNode, getNode, updateNode } from "~/lib/api/antbox_proxy";
import processApiError from "~/lib/process_api_error";
import { PortalLocale } from "~/lib/model/types/portal_locale";

const LAWYERS_FOLDER_FID = "lawyers";
const LAWYERS_FOLDER_NAME = "Advogados";
const TARGET_ASPECT = "lawyer";

const createLawyerHandler = defineEventHandler((evt) => {
	return async () => {
		const client = useAntboxClient().nodesClient;
		const parent = await assertFolderExists(
			LAWYERS_FOLDER_FID,
			LAWYERS_FOLDER_NAME
		);

		const node = await mapBody(evt, fromLawyer);
		node.parent = parent;

		return client.createFolder(node);
	};
});

const listLawyersHandler = defineEventHandler(async (evt: H3Event) => {
	const query = getQuery(evt);
	const lang = query.lang as PortalLocale;

	const lawyersCriteria: NodeFilter[] = [["aspects", "contains", "lawyer"]];

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

	const client = useAntboxClient().nodesClient;

	const nodesOrErr = await client.query(
		lawyersCriteria,
		Number.MAX_SAFE_INTEGER
	);

	if (nodesOrErr.isLeft()) {
		return processApiError(evt, nodesOrErr.value);
	}

	return nodesOrErr.value.nodes
		.map((n) => toLocalizedLawyer(n, lang))
		.sort(nameAscending);
});

function nameAscending(
	l1: Lawyer | LocalizedLawyer,
	l2: Lawyer | LocalizedLawyer
) {
	return l1.name < l2.name ? -1 : 1;
}

const router = createRouter();

router.get("/", listLawyersHandler);
router.get("/:uuid", defineEventHandler(getNode(toLocalizedLawyer)));
router.post("/", createLawyerHandler);
router.put("/:uuid", defineEventHandler(updateNode(fromLawyer)));
router.delete("/:uuid", defineEventHandler(deleteNode));

export default useBase("/api/lawyers", router.handler);
