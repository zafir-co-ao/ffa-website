import { Node } from "~/lib/deps";
import { I18nMessagesEntry } from "../intl/strings";

// Aspect "media-article"

export default interface MediaArticle {
	uuid: string;
	fid: string;
	title: I18nMessagesEntry;
	body: I18nMessagesEntry;
	publishedOn: string;
	publicationName: string;
	lawyerName?: string;
	lawyerLinkedIn?: string;
	lawyerUuid?: string;
	href?: string;
}

export interface LocalizedMediaArticle {
	uuid: string;
	fid: string;
	title: string;
	body: string;
	publishedOn: string;
	publicationName: string;
	lawyerName?: string;
	lawyerLinkedIn?: string;
	lawyerUuid?: string;
	href?: string;
}

export function makeMediaArticle(): MediaArticle {
	return {
		publicationName: undefined,
		publishedOn: new Date().toISOString().substring(0, 10),
		title: { pt: undefined, en: undefined },
		body: { pt: undefined, en: undefined },
	} as MediaArticle;
}

export function toMediaArticle(node: Node): MediaArticle {
	const MediaArticle = {
		uuid: node.uuid,
		fid: node.fid,
		title: node.properties?.["media-article:title"] as I18nMessagesEntry,
		publishedOn: node.properties?.["media-article:publishedOn"] as string,
		publicationName: node.properties?.[
			"media-article:publicationName"
		] as string,
		pdfUuid: node.properties?.["media-article:pdfUuid"] as string,
		lawyerUuid: node.properties?.["media-article:lawyerUuid"] as string,
		lawyerName: node.properties?.["media-article:lawyerName"] as string,
		lawyerLinkedIn: node.properties?.[
			"media-article:lawyerLinkedIn"
		] as string,
		href: node.properties?.["media-article:href"] as string,
		body: undefined,
	};

	return MediaArticle;
}

export function toLocalizedMediaArticle(
	node: Node,
	lang: string
): LocalizedMediaArticle {
	const { title, body, ...stage } = toMediaArticle(node);

	return {
		title: title?.[lang],
		body: undefined,
		...stage,
	};
}

export function fromMediaArticle(article: MediaArticle): Node {
	return {
		uuid: article.uuid,
		title: article.title.pt,
		aspects: ["media-article"],

		properties: {
			"media-article:title": article.title,
			"media-article:publishedOn": article.publishedOn,
			"media-article:publicationName": article.publicationName,
			"media-article:lawyerUuid": article.lawyerUuid,
			"media-article:lawyerName": article.lawyerName,
			"media-article:lawyerLinkedIn": article.lawyerLinkedIn,
			"media-article:href": article.href,
		},
	} as unknown as Node;
}
