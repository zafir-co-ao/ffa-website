import type { Node } from "~/lib/deps";
import type { I18nMessagesEntry } from "~/lib/intl/strings";
import type { PortalLocale } from "./portal_locale";

export type LegalAlertsCategory = "Bulletin" | "Alert";
export const LegalAlertsCategories: Record<string, string> = {
	Bulletin: "Bulletin",
	Alert: "Alert",
};

export interface LegalAlert {
	uuid: string;
	fid: string;
	title: I18nMessagesEntry;
	body: I18nMessagesEntry;
	publishedOn: string;
	category: LegalAlertsCategory;
}

export interface I18nLegalAlert {
	uuid: string;
	fid: string;
	title: string;
	body?: string;
	publishedOn: string;
	category: LegalAlertsCategory;
}

const UNDEFINED_STRING: string = undefined as unknown as string;

interface LegarAlertDesc {
	node: Node;
	file: File;
}

export function makeLegalAlert(): Partial<LegalAlert> {
	return {
		publishedOn: new Date().toISOString().substring(0, 10),
		category: "Alert",
		title: { pt: UNDEFINED_STRING, en: undefined },
		body: { pt: UNDEFINED_STRING, en: undefined },
	};
}

export function toLegalAlert(node: Node, bodyText: string): LegalAlert {
	const legalAlert = {
		uuid: node.uuid,
		fid: node.fid,
		publishedOn: node.properties?.["legal-alert:publishedOn"] as string,
		category: node.properties?.["legal-alert:category"] as LegalAlertsCategory,
		pdfUuid: node.properties?.["legal-alert:pdfUuid"] as string,
		title: node.properties?.["legal-alert:title"] as I18nMessagesEntry,
		body: JSON.parse(bodyText) as I18nMessagesEntry,
	};

	return legalAlert;
}

export function toLocalizedLegalAlert(
	node: Node,
	bodyText: string,
	lang?: PortalLocale
): LegalAlert | I18nLegalAlert {
	const legalAlert = toLegalAlert(node, bodyText);

	if (!lang) {
		return legalAlert;
	}

	return {
		uuid: legalAlert.uuid,
		fid: node.fid,
		title: legalAlert.title[lang] ?? legalAlert.title.pt,
		publishedOn: legalAlert.publishedOn,
		category: legalAlert.category,
		body: legalAlert.body[lang] ?? legalAlert.body.pt,
	};
}

export function fromLegalAlert(alert: LegalAlert): LegarAlertDesc {
	const desc = {
		node: {
			uuid: alert.uuid,
			title: alert.title.pt,
			aspects: ["legal-alert"],

			properties: {
				"legal-alert:title": alert.title,
				"legal-alert:publishedOn": alert.publishedOn,
				"legal-alert:category": alert.category,
			},
		} as unknown as Node,
		file: new File([JSON.stringify(alert.body)], `${alert.title.pt}.json`, {
			type: "application/json",
		}),
	};

	return desc;
}
