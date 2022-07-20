<script lang="ts">
async function loadLegalAlert(fid: string, lang: string) {
	const node = await nodeServiceClient.get(fidToUuid(fid));

	if (!node) {
		return null;
	}

	const endpoint = `/api/legal-alerts/${node.uuid}/${lang}`;
	const { data: event } = await useFetch<LocalizedLegalAlert>(endpoint);

	return event;
}
</script>

<script lang="ts" setup>
import { nodeServiceClient, fidToUuid } from "~/lib/deps";
import { strings } from "~~/lib/intl/strings";
import { LocalizedLegalAlert } from "~~/lib/model/legalAlerts";
import {
	makeLinkedinShareUrl,
	makeWhatsappShareUrl,
} from "~~/lib/socialShareLinkBuilder";
import useLanguage from "~~/lib/useLanguage";
import error404 from "../../err/404.vue";

const route = useRoute();
const router = useRouter();

const fid = route.params.fid as string;

const { lang } = useLanguage(router, route);

const BACK_PAGE = `/${lang.value}/media`;

const whatsappShare = ref<string>("");
const linkedinShare = ref<string>("");

const article = await loadLegalAlert(fid, lang.value);

onMounted(() => {
	whatsappShare.value = makeWhatsappShareUrl();
	linkedinShare.value = makeLinkedinShareUrl();
});

const scopedStrings = {
	Alert: { pt: "Alerta", en: "Alert" },
	News: { pt: "Notícias", en: "News" },
};

const categoryLabel = computed(
	() => scopedStrings[article.value.category][lang.value]
);

const ldJson = JSON.stringify({
	"@context": "https://schema.org",
	"@type": "Article",
	headline: article?.value.title,

	datePublished: article?.value.publishedOn,
	author: {
		"@type": "Organization",
		name: strings.meta_og_site_name[lang.value],
		url: "https://fatimafreitas.com",
	},
	publisher: {
		"@type": "Organization",
		name: strings.meta_og_site_name[lang.value],
	},
});
</script>

<template>
	<div class="container">
		<div v-if="article">
			<Title>{{ article.title }} - {{ strings.meta_title[lang] }}</Title>
			<Script type="application/ld+json" :children="ldJson"></Script>

			<app-article-breadcrumbs
				:lang="lang"
				:back-page-url="BACK_PAGE"
				:back-page-tile="strings.media[lang]"
				:third-level-title="strings.legal_alerts[lang]"
				:article-title="article.title"
			/>

			<app-article-metadata
				:metadata="[article.publishedOn, categoryLabel]"
			/>

			<app-article-title :title="article.title" />

			<app-article-social-share-buttons
				:linkedin-share="linkedinShare"
				:whatsapp-share="whatsappShare"
			/>

			<div v-html="article.body" />

			<app-article-back-link :lang="lang" :back-page="BACK_PAGE" />
		</div>
		<div v-else>
			<error404 />
		</div>
	</div>
</template>
