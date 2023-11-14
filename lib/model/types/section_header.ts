import type { I18nMessagesEntry } from "~/lib/intl/strings";
import { type Node, nodeServiceClient } from "~/lib/deps";
import type { PortalLocale } from "./portal_locale";

// Aspect: section-header
// Aspect Constraints: [image/png, image/jpg]
export interface SectionHeader {
	uuid: string;
	fid: string;
	nodeTitle: string;
	title: I18nMessagesEntry;
	subtitle?: I18nMessagesEntry;
	clipTop: boolean;
	clipBottom: boolean;

	// Download url do próprio node
	imageUrl: string;
}

export interface I18nSectionHeader {
	uuid: string;
	fid: string;
	nodeTitle: string;
	title: string;
	subtitle?: string;
	clipTop: boolean;
	clipBottom: boolean;

	// Download url do próprio node
	imageUrl: string;
}

export function makeSectionHeader(): SectionHeader {
	return { clipBottom: true, clipTop: false } as SectionHeader;
}

export function toLocalizedSectionHeader(
	node: Node,
	lang?: PortalLocale
): SectionHeader | I18nSectionHeader {
	const sectionHeader = toSectionHeader(node);

	if (!lang) {
		return sectionHeader;
	}

	return {
		...sectionHeader,
		title: sectionHeader.title[lang] ?? sectionHeader.title.pt,
		subtitle: sectionHeader.subtitle?.[lang] ?? sectionHeader.subtitle?.pt,
	};
}

export function toSectionHeader(node: Node): SectionHeader {
	const imageUrl = nodeServiceClient({
		url: process.client ? useAntboxUrl().value : process.env.NUXT_PUBLIC_ANTBOX_URL!,
	}).getNodeUrl(node.uuid);

	return {
		uuid: node.uuid,
		fid: node.fid,
		nodeTitle: node.title,
		title: node.properties?.["section-header:title"] as I18nMessagesEntry,
		subtitle: node.properties?.["section-header:subtitle"] as I18nMessagesEntry,
		clipTop: (node.properties?.["section-header:clipTop"] as boolean) ?? false,
		clipBottom: (node.properties?.["section-header:clipBottom"] as boolean) ?? false,

		imageUrl,
	};
}

export function fromSectionHeader(header: SectionHeader): Node {
	return {
		uuid: header.uuid,
		aspects: ["section-header"],

		properties: {
			"section-header:title": header.title,
			"section-header:subtitle": header.subtitle,
			"section-header:clipTop": header.clipTop,
			"section-header:clipBottom": header.clipBottom,
		},
	} as unknown as Node;
}
