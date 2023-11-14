<script lang="ts" setup>
import { strings } from "~/lib/intl/strings";
import { makeLinkedinShareUrl, makeWhatsappShareUrl } from "~/lib/social_share_link_builder";

import error404 from "../../err/404.vue";
import { type I18nMediaArticle } from "~/lib/model/types/media_article";
import { getI18nMediaArticle } from "~/lib/server_api_clients/media_articles_client";

const route = useRoute();

const fid = route.params.fid as string;

const { $locale: lang } = useI18n();

const BACK_PAGE = `/${lang.value}/media`;

const whatsappShare = ref<string>();
const linkedinShare = ref<string>();

const article = ref<I18nMediaArticle>();

onMounted(async () => {
	article.value = await getI18nMediaArticle(fid, lang.value);
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
				:back-page-tile="strings.media[lang]!"
				:third-level-title="strings.press[lang]!"
				:article-title="article.title"
			/>

			<app-article-metadata :metadata="[article.publishedOn, article.publicationName]" />

			<app-article-title :title="article.title" />

			<app-article-social-share-buttons
				:linkedin-share="linkedinShare!"
				:whatsapp-share="whatsappShare!"
			/>

			<div v-html="article.body" />

			<div v-if="article.href">
				Link: <a :href="article.href">{{ article.href }}</a>
			</div>

			<app-article-back-link :lang="lang" />
		</div>
		<div v-else>
			<error404 />
		</div>
	</div>
</template>
