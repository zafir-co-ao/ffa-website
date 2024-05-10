<script lang="ts">
import { strings } from "~/lib/intl/strings";
import { type I18nMediaArticle } from "~/lib/model/types/media_article";
import { i18nLawyerGetter } from "~/lib/server_api_clients/lawyers_client";
import { i18nMediaArticleGetter } from "~/lib/server_api_clients/media_articles_client";
import { searchMediaArticlesArchive } from "~/lib/server_api_clients/media_articles_client";
import { i18nSectionHeaderGetter } from "~/lib/server_api_clients/section_headers_client";
</script>

<script lang="ts" setup>
const { $locale: lang } = useI18n();

const pageSize = 6;
const pageToken = ref(1);
const articles = ref<I18nMediaArticle[]>([]);

const hasMore = computed(() => pageSize * pageToken.value === articles.value.length);

async function loadMore() {
	const newArticles = await searchMediaArticlesArchive(lang.value, pageSize, pageToken.value);

	articles.value = [...articles.value, ...newArticles];
}

onMounted(loadMore);

function handleLoadMoreClick() {
	pageToken.value++;

	loadMore();
}
</script>

<template>
	<div>
		<Title>{{ strings.archive[lang] }} - {{ strings.meta_title[lang] }}</Title>

		<app-section-header :getter="i18nSectionHeaderGetter('media__separador_1', lang)" />

		<div class="container">
			<h2 class="h3 font-weight-700 azul text-center">
				{{ strings.media_articles[lang] }} -
				{{ strings.archive[lang] }}
			</h2>

			<div class="row gx-5">
				<div v-for="article in articles" class="bg-azul-1 mb-3 pb-4">
					<app-media-article
						:getter="i18nMediaArticleGetter(article.uuid, lang, false)"
						:lawyer-getter="i18nLawyerGetter(article.lawyerUuid!, lang, false)"
						:has-lawyer="article.lawyerUuid ? true : false"
						:lang="lang"
					/>
				</div>
			</div>

			<div class="my-5 text-center">
				<app-button
					:label="strings.load_more[lang]!"
					:dark="true"
					:pt="strings.load_more.pt"
					:disabled="!hasMore"
					@click="handleLoadMoreClick"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped>
.bg-azul-1 {
	background: #f3f9ff;
}
</style>
