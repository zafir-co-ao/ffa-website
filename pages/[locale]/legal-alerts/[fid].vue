<script lang="ts" setup>
import { type I18nMessagesEntry, strings } from "~/lib/intl/strings";
import { makeLinkedinShareUrl, makeWhatsappShareUrl } from "~/lib/social_share_link_builder";

import error404 from "../../err/404.vue";
import { type I18nLegalAlert, type LegalAlertsCategory } from "~/lib/model/types/legal_alert";
import { getI18nLegalAlert } from "~/lib/server_api_clients/legal_alerts_client";

const route = useRoute();

const fid = route.params.fid as string;

const { $locale: lang } = useI18n();

const BACK_PAGE = `/${lang.value}/media`;

const whatsappShare = ref<string>();
const linkedinShare = ref<string>();

const alert = ref<I18nLegalAlert>();

const scopedStrings: Record<LegalAlertsCategory, I18nMessagesEntry> = {
	Alert: { pt: "Alerta", en: "Alert" },
	Bulletin: { pt: "Notícias", en: "News" },
};

const categoryLabel = computed(() => scopedStrings[alert.value!.category][lang.value!]);

function ldJson() {
	return JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Article",
		headline: alert.value?.title,

		datePublished: alert.value?.publishedOn,
		author: {
			"@type": "Organization",
			name: strings.meta_og_site_name[lang.value],
			url: "https://www.fatimafreitas.com",
		},
		publisher: {
			"@type": "Organization",
			name: strings.meta_og_site_name[lang.value],
		},
	});
}

onMounted(async () => {
	alert.value = await getI18nLegalAlert(fid, lang.value);
	whatsappShare.value = makeWhatsappShareUrl();
	linkedinShare.value = makeLinkedinShareUrl();

	useHead({
		script: [
			{
				type: "application/ld+json",
				innerHTML: ldJson(),
			},
		],

		title: `${alert.value?.title} - ${strings.meta_title[lang.value]}`,
	});
});
</script>

<template>
	<div class="container">
		<div v-if="alert">
			<app-article-breadcrumbs
				:lang="lang"
				:back-page-url="BACK_PAGE"
				:back-page-tile="strings.media[lang]!"
				:third-level-title="strings.legal_alerts[lang]!"
				:article-title="alert.title"
			/>

			<app-article-metadata :metadata="[alert.publishedOn, categoryLabel!]" />

			<app-article-title :title="alert.title" />

			<app-article-social-share-buttons
				:linkedin-share="linkedinShare!"
				:whatsapp-share="whatsappShare!"
			/>

			<div v-html="alert.body" />

			<app-article-back-link :lang="lang" :back-page="BACK_PAGE" />
		</div>
		<div v-else>
			<error404 />
		</div>
	</div>
</template>
