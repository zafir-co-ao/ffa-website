import { Node, nodeServiceClient } from "~~/lib/deps";
import { I18nMessagesEntry } from "../intl/strings";

// Aspect: section-header
// Aspect Constraints: [image/png, image/jpg]
export default interface SectionHeader {
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

export interface LocalizedSectionHeader {
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
	lang: string
): LocalizedSectionHeader {
	return {
		uuid: node.uuid,
		fid: node.fid,
		nodeTitle: node.title,
		title: node.properties["section-header:title"][lang],
		subtitle: node.properties["section-header:subtitle"]?.[lang],
		clipTop:
			(node.properties["section-header:clipTop"] as boolean) ?? false,
		clipBottom:
			(node.properties["section-header:clipBottom"] as boolean) ?? false,

		imageUrl: nodeServiceClient.getNodeUrl(node.uuid),
	};
}

export function toSectionHeader(node: Node): SectionHeader {
	return {
		uuid: node.uuid,
		fid: node.fid,
		nodeTitle: node.title,
		title: node.properties?.["section-header:title"] as I18nMessagesEntry,
		subtitle: node.properties?.[
			"section-header:subtitle"
		] as I18nMessagesEntry,
		clipTop:
			(node.properties["section-header:clipTop"] as boolean) ?? false,
		clipBottom:
			(node.properties["section-header:clipBottom"] as boolean) ?? false,

		imageUrl: nodeServiceClient.getNodeUrl(node.uuid),
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
