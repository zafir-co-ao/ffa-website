import { Node } from "~/lib/deps";

import { I18nMessagesEntry } from "../intl/strings";

// Aspect: event
export default interface Event {
	uuid: string;
	fid: string;
	title: I18nMessagesEntry;
	body: I18nMessagesEntry;
	publishedOn?: string;
	eventPlace?: string;
	eventDateTime: string;
	bannerUuid?: string;
	registrationUrl?: string;
}

export interface LocalizedEvent {
	uuid: string;
	fid: string;
	title: string;
	body: string;
	publishedOn?: string;
	eventPlace?: string;
	eventDateTime: string;
	bannerUuid?: string;
	registrationUrl?: string;
}

export function makeEvent(): Event {
	return {
		publishedOn: new Date().toISOString().substring(0, 10),
		eventDateTime: new Date().toISOString().substring(0, 16),
		title: { pt: undefined, en: undefined },
		body: { pt: undefined, en: undefined },
	} as Event;
}

export function toEvent(node: Node): Event {
	const event = {
		uuid: node.uuid,
		fid: node.fid,
		title: node.properties?.["event:title"] as I18nMessagesEntry,
		publishedOn: node.properties?.["event:publishedOn"] as string,
		eventPlace: node.properties?.["event:eventPlace"] as string,
		eventDateTime: node.properties?.["event:eventDateTime"] as string,
		bannerUuid: node.properties?.["event:bannerUuid"] as string,
		registrationUrl: node.properties?.["event:registrationUrl"] as string,
		body: undefined,
	};

	return event;
}

export function toLocalizedEvent(node: Node, lang: string): LocalizedEvent {
	const { title, body, ...stage } = toEvent(node);

	return {
		title: title?.[lang] ?? title.pt,
		body: undefined,
		...stage,
	};
}

export function fromEvent(article: Event): Node {
	return {
		uuid: article.uuid,
		title: article.title.pt,
		aspects: ["event"],

		properties: {
			"event:title": article.title,
			"event:publishedOn": article.publishedOn,
			"event:eventPlace": article.eventPlace,
			"event:eventDateTime": article.eventDateTime,
			"event:bannerUuid": article.bannerUuid,
			"event:registrationUrl": article.registrationUrl,
		},
	} as unknown as Node;
}
