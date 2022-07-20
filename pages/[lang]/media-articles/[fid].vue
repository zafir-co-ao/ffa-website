<script lang="ts">
async function loadArticle(fid: string, lang: string) {
	const node = await nodeServiceClient.get(fidToUuid(fid));

	if (!node) {
		return null;
	}

	const endpoint = `/api/media-articles/${node.uuid}/${lang}`;
	const { data: article } = await useFetch<LocalizedMediaArticle>(endpoint);

	return article;
}
</script>

<script lang="ts" setup>
import { nodeServiceClient, fidToUuid } from "~/lib/deps";
import { strings } from "~~/lib/intl/strings";
import { LocalizedMediaArticle } from "~~/lib/model/mediaArticle";
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

const article = await loadArticle(fid, lang.value);

onMounted(() => {
	whatsappShare.value = makeWhatsappShareUrl();
	linkedinShare.value = makeLinkedinShareUrl();
});
</script>

<template>
	<div class="container">
		<div v-if="article">
			<Title>{{ article.title }} - {{ strings.meta_title[lang] }}</Title>

			<app-article-breadcrumbs
				:lang="lang"
				:back-page-url="BACK_PAGE"
				:back-page-tile="strings.media[lang]"
				:third-level-title="strings.press[lang]"
				:article-title="article.title"
			/>

			<app-article-metadata
				:metadata="[article.publishedOn, article.publicationName]"
			/>

			<app-article-title :title="article.title" />

			<app-article-social-share-buttons
				:linkedin-share="linkedinShare"
				:whatsapp-share="whatsappShare"
			/>

			<div v-html="article.body" />

			<div v-if="article.href">
				Link: <a :href="article.href">{{ article.href }}</a>
			</div>

			<app-article-back-link :lang="lang" :back-page="BACK_PAGE" />
		</div>
		<div v-else>
			<error404 />
		</div>
	</div>
</template>
