import { nodeServiceClient, Node } from "../../deps";
import { I18nMessagesEntry } from "../../intl/strings";

// Aspect: banner
export default interface Banner {
	uuid: string;
	title1: I18nMessagesEntry;
	title2?: I18nMessagesEntry;
	href?: string;
	subtitle?: I18nMessagesEntry;

	// Download url do próprio node
	imageUrl: string;
	priority: number;
}

export interface LocalizedBanner {
	uuid: string;
	title1: string;
	title2?: string;
	href?: string;
	subtitle?: string;

	// Download url do próprio node
	imageUrl: string;
}

export function makeBanner(): Banner {
	return {} as Banner;
}

export function toLocalizedBanner(node: Node, lang: string): LocalizedBanner {
	return {
		uuid: node.uuid,
		title1: node.properties["banner:title1"][lang],
		title2: node.properties["banner:title2"]?.[lang],
		subtitle: node.properties["banner:subtitle"]?.[lang],
		href: node.properties["banner:href"] as string,
		imageUrl: nodeServiceClient.getNodeUrl(node.uuid),
	};
}

export function toBanner(node: Node): Banner {
	return {
		uuid: node.uuid,
		title1: node.properties?.["banner:title1"] as I18nMessagesEntry,
		title2: node.properties?.["banner:title2"] as I18nMessagesEntry,
		subtitle: node.properties?.["banner:subtitle"] as I18nMessagesEntry,
		href: node.properties?.["banner:href"] as string,
		priority: node.properties?.["banner:priority"] as number,
		imageUrl: nodeServiceClient.getNodeUrl(node.uuid),
	};
}

export function fromBanner(banner: Banner): Node {
	return {
		uuid: banner.uuid,
		title: banner.title1.pt.concat(" ", banner.title2?.pt ?? ""),
		aspects: ["banner"],

		properties: {
			"banner:title1": banner.title1,
			"banner:title2": banner.title2,
			"banner:subtitle": banner.subtitle,
			"banner:href": banner.href,
			"banner:priority": banner.priority,
		},
	} as unknown as Node;
}
