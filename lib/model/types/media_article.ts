import { Node } from "~/lib/deps";
import { I18nMessagesEntry } from "~/lib/intl/strings";
import { PortalLocale } from "./portal_locale";

export interface MediaArticle {
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

const UNDEFINED_STRING: string = undefined as unknown as string;

interface MediaArticleDesc {
	node: Node;
	file: File;
}

export function makeMediaArticle(): Partial<MediaArticle> {
	return {
		publicationName: undefined,
		publishedOn: new Date().toISOString().substring(0, 10),
		title: { pt: UNDEFINED_STRING, en: undefined },
		body: { pt: UNDEFINED_STRING, en: undefined },
	};
}

export function toMediaArticle(node: Node, bodyText: string): MediaArticle {
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
		body: JSON.parse(bodyText) as I18nMessagesEntry,
	};

	return MediaArticle;
}

export function toLocalizedMediaArticle(
	node: Node,
	bodyText: string,
	lang?: PortalLocale
): MediaArticle | LocalizedMediaArticle {
	const article = toMediaArticle(node, bodyText);

	if (!lang) {
		return article;
	}

	return {
		...article,
		title: article.title[lang] ?? article.title.pt,
		body: article.body[lang] ?? article.body.pt,
	};
}

export function fromMediaArticle(article: MediaArticle): MediaArticleDesc {
	return {
		node: {
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
		} as unknown as Node,

		file: new File(
			[JSON.stringify(article.body)],
			`${article.title.pt}.json`,
			{ type: "application/json" }
		),
	};
}
