import { I18nMessagesEntry } from "./strings";

const industries: Record<string, I18nMessagesEntry> = {
	Agricultura: { pt: "Agricultura", en: "Agriculture" },
	AguaResiduos: { pt: "Água & Resíduos ", en: "Water & Waste" },
	AviacaoTransporteMaritimo: {
		pt: "Aviação & Transporte Marítimo",
		en: "Aviation & Shipping",
	},
	BebidasIndustriaCervejeira: {
		pt: "Bebidas & Indústria Cervejeira",
		en: "Beverages & Breweries",
	},
	ConstrucaoProjectos: {
		pt: "Construção & Projectos",
		en: "Construction & Projects",
	},
	DesportoEntretenimento: {
		pt: "Desporto & Entretenimento",
		en: "Sports & Entertainment",
	},
	EnergiaRecursosNaturais: {
		pt: "Energia & Recursos Naturais",
		en: "Energy & Natural Resources",
	},
	FarmaceuticaSaude: {
		pt: "Farmacêutica & Saúde",
		en: "Health & Pharmaceutical",
	},
	ManufacturaIndustria: {
		pt: "Manufactura & Indústria",
		en: "Manufacture & Industries",
	},
	Mineiro: { pt: "Mineiro ", en: "Mining" },
	PetroleoGas: { pt: "Petróleo & Gás", en: "Oil & Gas" },
	PortosFerrovias: { pt: "Portos & Ferrovias ", en: "Ports & Railways" },
	Renovaveis: { pt: "Renováveis ", en: "Renewables" },
	Transportes: { pt: "Transportes ", en: "Transportation" },
	Telecomunicacoes: { pt: "Telecomunicações", en: "Telecomunications" },
	Turismo: { pt: "Turismo", en: "Tourism" },
};
export default industries;
