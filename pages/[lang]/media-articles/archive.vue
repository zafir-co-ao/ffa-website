<script lang="ts">
import { strings } from "~~/lib/intl/strings";
import { LocalizedMediaArticle } from "~~/lib/model/mediaArticle";
import useLanguage from "~~/lib/useLanguage";
</script>

<script lang="ts" setup>
const { lang } = useLanguage(useRouter(), useRoute());
const articlesEndpoint = `/api/media-articles/-/${lang.value}`;

const pageSize = 6;
const pageToken = ref(1);
const alerts = ref<LocalizedMediaArticle[]>([]);
await loadMore();

const hasMore = computed(
	() => pageSize * pageToken.value === alerts.value.length
);

async function loadMore() {
	const endpoint = articlesEndpoint.concat(
		"?page-size=",
		pageSize.toString(),
		"&page-token=",
		pageToken.value.toString()
	);
	const { data: newAlerts } = await useFetch<LocalizedMediaArticle[]>(
		endpoint
	);

	alerts.value = [...alerts.value, ...newAlerts.value];
}

function handleLoadMoreClick() {
	pageToken.value++;

	loadMore();
}
</script>

<template>
	<div>
		<Title
			>{{ strings.archive[lang] }} - {{ strings.meta_title[lang] }}</Title
		>

		<app-section-header-container fid="media__separador_1" :lang="lang" />

		<div class="container">
			<h2 class="h3 font-weight-700 azul text-center">
				{{ strings.media_articles[lang] }} -
				{{ strings.archive[lang] }}
			</h2>

			<div class="row gx-5">
				<div v-for="alert in alerts" class="bg-azul-1 mb-3 pb-4">
					<media-article :uuid="alert.uuid" :lang="lang" />
				</div>
			</div>

			<div class="my-5 text-center">
				<app-button
					:label="strings.load_more[lang]"
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
