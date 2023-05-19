import { I18nMessagesEntry } from "~/lib/intl/strings";
import { Node } from "~/lib/deps";
import { PortalLocale } from "./portal_locale";
import { FOLDER_MIMETYPE } from "@zafir.co.ao/lightray";

export interface Lawyer {
	uuid: string;
	fid: string;
	parent?: string;
	name: string;
	category?: LawyerCategory;
	officeTelephones?: string;
	mobilePhone?: string;
	email?: string;
	areas?: string[];
	languages?: LawyerLanguage[];
	portraitUuid?: string;
	thumbnailUuid?: string;

	position: I18nMessagesEntry;
	bio: I18nMessagesEntry;
	career: I18nMessagesEntry;
}

export interface I18nLawyer {
	uuid: string;
	fid: string;
	parent?: string;
	name: string;
	category?: LawyerCategory;
	officeTelephones?: string;
	mobilePhone?: string;
	email?: string;
	areas?: string[];
	languages?: LawyerLanguage[];
	portraitUuid?: string;
	thumbnailUuid?: string;
	position: string;
	bio: string;
	career: string;
}

export enum LawyerCategory {
	Socio = "Socio",
	Consultor = "Consultor",
	AssociadoSenior = "AssociadoSenior",
	Associado = "Associado",
	Estagiario = "Estagiario",
}

export enum LawyerLanguage {
	Portugues = "pt",
	Ingles = "en",
	Espanhol = "es",
	Frances = "fr",
	Russo = "ru",
}

export function makeLawyer(): Lawyer {
	return {
		email: "@fatimafreitas.com",
		officeTelephones: "+244 222 372 030 / 57 / 92 ",
		languages: [LawyerLanguage.Portugues],
		bio: { pt: "" },
		career: { pt: "" },
		position: { pt: "" },
	} as Lawyer;
}

export function fromLawyer(lawyer: Lawyer): Node {
	return {
		uuid: lawyer.uuid,
		fid: lawyer.fid,
		parent: lawyer.parent,
		title: lawyer.name,
		mimetype: FOLDER_MIMETYPE,
		aspects: ["lawyer"],
		properties: {
			"lawyer:category": lawyer.category,
			"lawyer:officeTelephones": lawyer.officeTelephones,
			"lawyer:officeMobilePhone": lawyer.mobilePhone,
			"lawyer:email": lawyer.email,
			"lawyer:areas": lawyer.areas,
			"lawyer:languages": lawyer.languages,
			"lawyer:portraitUuid": lawyer.portraitUuid,
			"lawyer:thumbnailUuid": lawyer.thumbnailUuid,
			"lawyer:bio": JSON.stringify(lawyer.bio),
			"lawyer:career": JSON.stringify(lawyer.career),
			"lawyer:position": JSON.stringify(lawyer.position),
		},
	} as unknown as Node;
}

export function toLawyer(node: Node): Lawyer {
	return {
		uuid: node.uuid,
		fid: node.fid,
		parent: node.parent,
		name: node.title,
		category: node.properties?.["lawyer:category"] as LawyerCategory,
		officeTelephones: node.properties?.["lawyer:officeTelephones"] as string,
		mobilePhone: node.properties?.["lawyer:officeMobilePhone"] as string,
		email: node.properties?.["lawyer:email"] as string,
		areas: (node.properties?.["lawyer:areas"] as []) ?? [],
		languages: (node.properties?.["lawyer:languages"] as []) ?? [],
		portraitUuid: node.properties?.["lawyer:portraitUuid"] as string,
		thumbnailUuid: node.properties?.["lawyer:thumbnailUuid"] as string,
		bio: JSON.parse(node.properties?.["lawyer:bio"] as string),
		career: JSON.parse(node.properties?.["lawyer:career"] as string),
		position: JSON.parse(node.properties?.["lawyer:position"] as string),
	};
}

export function toLocalizedLawyer(node: Node, lang?: PortalLocale): Lawyer | I18nLawyer {
	const lawyer = toLawyer(node);

	if (!lang) {
		return lawyer;
	}

	return {
		...lawyer,
		position: lawyer.position[lang] ?? lawyer.position.pt,
		bio: lawyer.bio[lang] ?? lawyer.bio.pt,
		career: lawyer.career[lang] ?? lawyer.career.pt,
	};
}
