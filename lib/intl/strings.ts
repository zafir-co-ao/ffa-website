export type I18nMessages = Record<string, I18nMessagesEntry>;

export interface I18nMessagesEntry {
	pt: string;
	en?: string;
}

export const strings: I18nMessages = {
	about_us: { pt: "Sobre nós", en: "About us" },
	the_ffa: { pt: "A FFA", en: "The FFA" },
	contacts: { pt: "Contactos", en: "Contacts" },
	services: { pt: "Serviços", en: "Services" },
	follow_us: { pt: "Siga-nos", en: "Follow us" },
	get_in_touch: { pt: "Contacte-nos", en: "Get in touch" },
	know_more: { pt: "Saiba mais", en: "Know more" },
	media: { pt: "Media & Conhecimento", en: "Media & Insights" },
	add_to_calendar: { pt: "Adicionar ao calendário", en: "Add to calendar" },

	online_registration: { pt: "Registo Online", en: "Online Registration" },
	back: { pt: "Voltar", en: "Back" },
	disclaimer_and_privacy: {
		pt: "Condições de Utilização & Privacidade",
		en: "Disclaimer & Privacy",
	},

	legal_alerts: { pt: "Alertas Jurídicos", en: "Legal Alerts" },
	see_all_legal_alerts: { pt: "Ver todos os alertas", en: "See all alerts" },
	load_more: { pt: "Carregar Mais", en: "Load More" },
	archive: { pt: "Arquivo", en: "Archive" },
	events: { pt: "Eventos", en: "Events" },
	media_articles: { pt: "Artigos de Imprensa", en: "Media Articles" },
	see_all_media_articles: {
		pt: "Ver todos os artigos de imprensa",
		en: "See all media articles",
	},
	press: { pt: "Imprensa", en: "Press" },

	about_us_teaser_title: {
		pt: "International Standards, Local Knowledge",
		en: "International Standards, Local Knowledge",
	},
	about_us_teaser_content: {
		pt: "Servimos os nossos clientes onde eles mais precisam",
		en: "We serve our clients where they need us",
	},
	people: { pt: "Colaboradores", en: "People" },
	careers: { pt: "Carreiras", en: "Careers" },

	people_header_1: {
		pt: "O NOSSO SUCESSO DEPENDE DA QUALIDADE",
		en: "SUCCESS IS BASED ENTIRELY",
	},

	people_header_2: {
		pt: "E DO TALENTO DOS NOSSOS COLABORADORES",
		en: "ON THE QUALITY OF THE INDIVIDUALS",
	},

	lawyer_name: { pt: "Nome", en: "Name" },
	lawyer_email: { pt: "E-mail", en: "Email" },
	lawyer_position: { pt: "Função", en: "Position" },
	lawyer_category: { pt: "Categoria", en: "Category" },
	lawyer_contacts: { pt: "Contactos Telefónicos", en: "Contacts" },
	lawyer_contacts_mobile: { pt: "Telemóvel", en: "Mobile Phone" },
	lawyer_contacts_office: { pt: "Escritório", en: "Office" },
	lawyer_career: {
		pt: "Carreira / Qualificações",
		en: "Career / Qualifications ",
	},
	lawyer_bio: { pt: "Biografia", en: "Biography" },
	lawyer_areas_of_practice: {
		pt: "Áreas de Prática",
		en: "Areas of Practice",
	},
	lawyer_languages: { pt: "Idiomas", en: "Languages" },

	legal_alert_title: { pt: "Título", en: "Title" },
	legal_alert_published_on: { pt: "Publicado aos", en: "Published On" },
	legal_alert_body: { pt: "Texto", en: "Body" },

	media_article_title: { pt: "Título", en: "Title" },
	media_article_published_on: { pt: "Publicado aos", en: "Published On" },
	media_article_body: { pt: "Texto", en: "Body" },
	media_article_lawyer: { pt: "Advogado", en: "Lawyer" },
	media_article_lawyer_name: { pt: "Nome", en: "Name" },
	media_article_lawyer_linkedin: { pt: "LinkedIn", en: "LinkedIn" },
	media_article_href: { pt: "URL do Artigo", en: "Article URL" },
	media_article_pdfUuid: { pt: "UUID do Anexo", en: "Attachmnent UUID" },
	media_article_publication_name: {
		pt: "Nome da Publicação",
		en: "Publication Name",
	},

	event_title: { pt: "Título", en: "Title" },
	event_published_on: { pt: "Publicado aos", en: "Published On" },
	event_body: { pt: "Texto", en: "Body" },
	event_pdfUuid: { pt: "UUID do Anexo", en: "Attachmnent UUID" },
	event_registration_url: { pt: "Link de Registo", en: "Registration URL" },
	event_event_date_time: { pt: "Data", en: "Date" },
	event_event_place: { pt: "Local", en: "Place" },

	areas_of_expertise_and_industries: {
		pt: "Áreas de Prática e Indústrias",
		en: "Areas of Expertise & Industries",
	},

	our_services: { pt: "Os Nossos Serviços", en: "Our Services" },

	meta_description: {
		pt: "A Fátima Freitas & Associados, Sociedade de Advogados é um dos mais antigos e maiores escritórios de advogados estabelecidos em Angola. A nossa equipa conta actualmente com 35 advogados, sendo 7  sócios, e uma ímpar projecção nacional e internacional.",
		en: "Fátima Freitas Advogados is one of the longest-established and most pre-eminent law offices in Angola.Today we are a firm of 35 lawyers, including 7 partners, with the widest national and international reach of any Angolan law office.",
	},
	meta_keywords: {
		pt: "advogados, escritório de advogados, angola, luanda, benguela, lobito, cabinda, áfrica",
		en: "lawyers, attorneys, legal advice, law firm, angola, luanda, benguela, lobito, cabinda, africa",
	},
	meta_title: {
		pt: "FFA - Escritórios de Advogados em Angola",
		en: "FFA - Full Service Law Firm in Angola",
	},

	meta_og_site_name: {
		pt: "Fatima Freitas & Associados",
		en: "Fatima Freitas & Associates",
	},

	username: { pt: "Nome de Utilizador", en: "Username" },
	password: { pt: "Código", en: "Code" },
	login: { pt: "Entrar", en: "Login" },

	do_login: { pt: "Fazer Login", en: "Sign In" },
};

export const languages: Record<string, I18nMessagesEntry> = {
	pt: { en: "Portuguese", pt: "Português" },
	en: { en: "English", pt: "Inglês" },
	es: { en: "Spanish", pt: "Espanhol" },
	fr: { en: "French", pt: "Francês" },
	ru: { en: "Russian", pt: "Russo" },
};

export const legalAlertCategories = {
	Alert: { en: "Alert", pt: "Alerta" },
	Bulletin: { en: "Bulletin", pt: "Boletim" },
};

export const categories = {
	Socio: { pt: "Sócio", en: "Partner" },
	Socios: { pt: "Sócios", en: "Partners" },

	Consultor: { pt: "Consultor", en: "Consultant" },
	Consultores: { pt: "Consultores", en: "Of Counsels" },

	AssociadoCoordenador: {
		pt: "Associado Coordenador",
		en: "Managing Associate",
	},
	AssociadosCoordenadores: {
		pt: "Associados Coordenadores",
		en: "Managing Associates",
	},

	Associado: { pt: "Associado", en: "Associate" },
	Associados: { pt: "Associados", en: "Associates" },

	Estagiario: { pt: "Estagiário", en: "Trainee" },
	Estagiarios: { pt: "Estagiários", en: "Trainees" },
};
