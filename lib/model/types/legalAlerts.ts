import { Node } from "~/lib/deps";

import { I18nMessagesEntry } from "../intl/strings";

export type LegalAlertsCategory = "Bulletin" | "Alert";
export const LegalAlertsCategories: Record<string, string> = {
	Bulletin: "Bulletin",
	Alert: "Alert",
};

// Aspect "legal-alert"

export default interface LegalAlert {
	uuid: string;
	readonly fid: string;
	title: I18nMessagesEntry;
	body: I18nMessagesEntry;
	publishedOn: string;
	category: LegalAlertsCategory;
}

export interface LocalizedLegalAlert {
	uuid: string;
	readonly fid: string;
	title: string;
	body?: string;
	publishedOn: string;
	category: LegalAlertsCategory;
}

export function makeLegalAlert(): LegalAlert {
	return {
		publishedOn: new Date().toISOString().substring(0, 10),
		category: "Alert",
		title: { pt: undefined, en: undefined },
		body: { pt: undefined, en: undefined },
	} as LegalAlert;
}

export function toLegalAlert(node: Node): LegalAlert {
	const legalAlert = {
		uuid: node.uuid,
		fid: node.fid,
		publishedOn: node.properties?.["legal-alert:publishedOn"] as string,
		category: node.properties?.[
			"legal-alert:category"
		] as LegalAlertsCategory,
		pdfUuid: node.properties?.["legal-alert:pdfUuid"] as string,
		title: node.properties?.["legal-alert:title"] as I18nMessagesEntry,
		body: undefined,
	};

	return legalAlert;
}

export function toLocalizedLegalAlert(
	node: Node,
	lang: string
): LocalizedLegalAlert {
	const stage = toLegalAlert(node);

	return {
		uuid: stage.uuid,
		fid: node.fid,
		title: stage.title?.[lang],
		publishedOn: stage.publishedOn,
		category: stage.category,
	};
}

export function fromLegalAlert(alert: LegalAlert): Node {
	return {
		uuid: alert.uuid,
		title: alert.title.pt,
		aspects: ["legal-alert"],

		properties: {
			"legal-alert:title": alert.title,
			"legal-alert:publishedOn": alert.publishedOn,
			"legal-alert:category": alert.category,
		},
	} as unknown as Node;
}
