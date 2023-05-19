import { Node } from "~/lib/deps";
import { I18nMessagesEntry } from "~/lib/intl/strings";
import { PortalLocale } from "./portal_locale";

// Aspect: event
export interface Event {
	uuid: string;
	fid: string;
	title: I18nMessagesEntry;
	body: I18nMessagesEntry;
	publishedOn: string;
	eventPlace?: string;
	eventDateTime: string;
	bannerUuid?: string;
	registrationUrl?: string;
}

export interface I18nEvent {
	uuid: string;
	fid: string;
	title: string;
	body: string;
	publishedOn: string;
	eventPlace?: string;
	eventDateTime: string;
	bannerUuid?: string;
	registrationUrl?: string;
}

const UNDEFINED_STRING: string = undefined as unknown as string;

interface EventDesc {
	node: Node;
	file: File;
}

export function makeEvent(): Partial<Event> {
	return {
		publishedOn: new Date().toISOString().substring(0, 10),
		eventDateTime: new Date().toISOString().substring(0, 16),
		title: { pt: UNDEFINED_STRING, en: UNDEFINED_STRING },
		body: { pt: UNDEFINED_STRING, en: UNDEFINED_STRING },
	};
}

export function toEvent(node: Node, bodyText: string): Event {
	const event = {
		uuid: node.uuid,
		fid: node.fid,
		title: node.properties?.["event:title"] as I18nMessagesEntry,
		publishedOn: node.properties?.["event:publishedOn"] as string,
		eventPlace: node.properties?.["event:eventPlace"] as string,
		eventDateTime: node.properties?.["event:eventDateTime"] as string,
		bannerUuid: node.properties?.["event:bannerUuid"] as string,
		registrationUrl: node.properties?.["event:registrationUrl"] as string,
		body: JSON.parse(bodyText) as I18nMessagesEntry,
	};

	return event;
}

export function toLocalizedEvent(node: Node, bodyText: string, lang?: PortalLocale): Event | I18nEvent {
	const event = toEvent(node, bodyText);

	if (!lang) {
		return event;
	}

	return {
		...event,
		title: event.title[lang] ?? event.title.pt,
		body: event.body[lang] ?? event.body.pt,
	} as I18nEvent;
}

export function fromEvent(event: Event): EventDesc {
	return {
		node: {
			uuid: event.uuid,
			title: event.title.pt,
			aspects: ["event"],

			properties: {
				"event:title": event.title,
				"event:publishedOn": event.publishedOn,
				"event:eventPlace": event.eventPlace,
				"event:eventDateTime": event.eventDateTime,
				"event:bannerUuid": event.bannerUuid,
				"event:registrationUrl": event.registrationUrl,
			},
		} as unknown as Node,

		file: new File([JSON.stringify(event.body)], `${event.title.pt}.json`, {
			type: "application/json",
		}),
	};
}
