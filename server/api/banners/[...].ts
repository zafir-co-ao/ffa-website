import { createRouter, defineEventHandler, useBase } from "h3";

import { deleteNode, getNode, updateNode } from "~/lib/api/antbox_proxy";
import { toLocalizedBanner, fromBanner } from "~/lib/model/types/banner";

const router = createRouter();

router.get("/:uuid", defineEventHandler(getNode(toLocalizedBanner)));
router.put("/:uuid", defineEventHandler(updateNode(fromBanner)));
router.delete("/:uuid", defineEventHandler(deleteNode));

export default useBase("/api/banners", router.handler);
