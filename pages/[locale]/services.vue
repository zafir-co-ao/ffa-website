<script lang="ts">
import { WebContent } from "~/lib/deps";
import areasOfPractice from "~/lib/intl/areas_of_practice";
import industries from "~/lib/intl/industries";
import { I18nMessagesEntry, strings } from "~/lib/intl/strings";
import { i18nSectionHeaderGetter } from "~/lib/server_api_clients/section_headers_client";
import {
	i18nWebContentGetter,
	webContentGetter,
	webContentSaver,
} from "~/lib/server_api_clients/web_content_client";

import offices from "~/lib/stubs/offices";
</script>

<script lang="ts" setup>
const { $locale: lang } = useI18n();

const localizedAreas = computed(() => compute(areasOfPractice));
const localizedIndustries = computed(() => compute(industries));

function compute(obj: Record<string, I18nMessagesEntry>) {
	return Object.values(obj)
		.map((value) => value[lang.value])
		.sort((a1, a2) => ((a1 ?? "") > (a2 ?? "") ? 1 : -1));
}

const scopedMessages = {
	ourServices: { pt: "Os nossos serviços", en: "Our services" },
	areasAndIndustries: {
		pt: "Áreas de prática e indústrias",
		en: "Areas of practice & industries",
	},
	areas: { pt: "Áreas de Prática", en: "Areas of Practice" },
	industries: { pt: "Indústrias", en: "Industries" },
};

const ldJson = JSON.stringify({
	"@context": "https://schema.org",
	"@type": "LegalService",
	name: strings.meta_og_site_name[lang.value],
	url: "https://fatimafreitas.com/",
	address: offices[0].address.replaceAll(/<br \/>/g, ", "),
	telephone: offices[0].phoneNumbers,
	email: offices[0].email,
	location: [
		{
			"@type": "Place",
			name: offices[0].name,
			address: offices[0].address.replaceAll(/<br \/>/g, ", "),
			latitude: offices[0].latitude,
			longitude: offices[0].longitude,
			telephone: offices[0].phoneNumbers,
		},
		{
			"@type": "Place",
			name: offices[1].name,
			address: offices[1].address.replaceAll(/<br \/>/g, ", "),
			latitude: offices[1].latitude,
			longitude: offices[1].longitude,
			telephone: offices[1].phoneNumbers,
		},
		{
			"@type": "Place",
			name: offices[2].name,
			address: offices[2].address.replaceAll(/<br \/>/g, ", "),
			latitude: offices[2].latitude,
			longitude: offices[2].longitude,
			telephone: offices[2].phoneNumbers,
		},
	],

	logo: "https://fatimafreitas.com/images/ffa-logo.jpg",

	knowsLanguage: ["pt", "en", "es", "fr", "ru"],
	openingHours: "Mo-Fr 8:30-18:30",
});

function handleWebContentSave(content: WebContent) {
	const saveWebContent = webContentSaver();
	return saveWebContent(content).then(() => {
		// Reload the page
		window.location.reload();
	});
}
</script>

<template>
	<div>
		<Title>{{ strings.services[lang] }} - {{ strings.meta_title[lang] }}</Title>
		<Script type="application/ld+json" :children="ldJson"></Script>
		<app-section-header :getter="i18nSectionHeaderGetter('servicos__separador_1', lang)" />
		<app-web-content
			:getter="i18nWebContentGetter('servicos__texto_1', lang)"
			:edit-getter="webContentGetter('servicos__texto_1')"
			:edit-saver="handleWebContentSave"
		/>

		<app-section-header :getter="i18nSectionHeaderGetter('servicos__separador_2', lang)" />

		<div class="container mt-5 mb-5">
			<div class="row">
				<div class="col">
					<div class="row justify-content-center g-5">
						<div class="col-auto">
							<h4>{{ scopedMessages.areas[lang] }}</h4>
							<ul>
								<li v-for="area of localizedAreas">
									{{ area }}
								</li>
							</ul>
						</div>
						<div class="col-auto">
							<h4>{{ scopedMessages.industries[lang] }}</h4>
							<ul>
								<li v-for="industry of localizedIndustries">
									{{ industry }}
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="container mt-5 mb-5">
			<div class="row justify-content-center">
				<div class="col-auto">
					<a class="btnmenuabout active" href="#services">{{
						scopedMessages.ourServices[lang]
					}}</a>
				</div>

				<div class="col-auto">
					<a class="btnmenuabout" href="#industries">
						{{ scopedMessages.areasAndIndustries[lang] }}</a
					>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
// media query for mobile
@media (max-width: 767px) {
	.col-auto {
		flex: 0 0 100%;
	}
}
</style>
