import { fromLawyer, toLocalizedLawyer } from "~/lib/model/types/lawyer";
import { deleteNode, getNode, updateNode } from "~/lib/api/antbox_proxy";

const router = createRouter();

router.get("/:uuid", defineEventHandler(getNode(toLocalizedLawyer)));
router.put("/:uuid", defineEventHandler(updateNode(fromLawyer)));
router.delete("/:uuid", defineEventHandler(deleteNode));

export default useBase("/api/lawyers", router.handler);
