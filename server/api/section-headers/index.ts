import { createRouter, defineEventHandler, useBase, H3Event } from "h3";
import { Node, NodeFilter } from "~/lib/deps";

import { searchNodes } from "~/lib/api/antbox_proxy";
import {
	SectionHeader,
	toLocalizedSectionHeader,
	toSectionHeader,
	I18nSectionHeader,
} from "~/lib/model/types/section_header";
import { PortalLocale } from "~/lib/model/types/portal_locale";

const TARGET_ASPECT = "section-header";

const listSectionHeadersHandler = defineEventHandler((evt) => {
	const lang = getQuery(evt).lang as PortalLocale | undefined;
	const to = lang ? (n: Node) => toLocalizedSectionHeader(n, lang) : toSectionHeader;
	const filters: NodeFilter[] = [["aspects", "contains", TARGET_ASPECT]];

	return searchNodes<SectionHeader, I18nSectionHeader>(evt, to, filters);
});

const router = createRouter();

router.get("/", listSectionHeadersHandler);

export default useBase("/api/section-headers", router.handler);
