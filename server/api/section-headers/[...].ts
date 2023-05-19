import { createRouter, defineEventHandler, useBase } from "h3";

import { deleteNode, getNode, updateNode } from "~/lib/api/antbox_proxy";
import { toLocalizedSectionHeader, fromSectionHeader } from "~/lib/model/types/section_header";

const router = createRouter();

router.get("/:uuid", defineEventHandler(getNode(toLocalizedSectionHeader)));
router.put("/:uuid", defineEventHandler(updateNode(fromSectionHeader)));
router.delete("/:uuid", defineEventHandler(deleteNode));

export default useBase("/api/section-headers", router.handler);
