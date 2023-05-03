<script lang="ts"></script>

<script lang="ts" setup>
import { strings } from "~~/lib/intl/strings";
import { LocalizedEvent } from "~~/lib/model/types/event";
import { LocalizedLawyer } from "~~/lib/model/types/lawyer";
import { LocalizedLegalAlert } from "~/lib/model/types/legal_alert";
import { LocalizedMediaArticle } from "~/lib/model/types/media_article";

const { $locale } = useI18n();

const eventsEndpoint = `/api/events/-/${$locale.value}?q=`;
const alertsEndpoint = `/api/legal-alerts/-/${$locale.value}?q=`;
const articlesEndpoint = `/api/media-articles/-/${$locale.value}?q=`;
const lawyersEndpoint = `/api/lawyers/-/${$locale.value}?q=`;

const events = ref<LocalizedEvent[]>();
const alerts = ref<LocalizedLegalAlert[]>();
const articles = ref<LocalizedMediaArticle[]>();
const lawyers = ref<LocalizedLawyer[]>();

const searchString = ref("");

function updateSearch() {
	if (searchString.value?.length < 3) {
		return;
	}

	useFetch<LocalizedEvent[]>(eventsEndpoint.concat(searchString.value)).then(
		(res) => (events.value = res.data.value)
	);

	useFetch<LocalizedLegalAlert[]>(
		alertsEndpoint.concat(searchString.value)
	).then((res) => (alerts.value = res.data.value));

	useFetch<LocalizedMediaArticle[]>(
		articlesEndpoint.concat(searchString.value)
	).then((res) => (articles.value = res.data.value));

	useFetch<LocalizedLawyer[]>(
		lawyersEndpoint.concat(searchString.value)
	).then((res) => (lawyers.value = res.data.value));
}
</script>

<template>
	<div class="search-container container">
		<app-search-input
			class="mb-5"
			type="text"
			:lang="$locale"
			v-model="searchString"
			@input="updateSearch"
		/>

		<div class="pt-5" v-if="lawyers?.length > 0">
			<h2 class="h2 azul text-center">{{ strings.people[$locale] }}</h2>
			<div class="row mt-5 mb-5">
				<nuxt-link
					v-for="lawyer in lawyers"
					:to="`/${$locale}/lawyers/${lawyer.fid}`"
					class="col-lg-4 col-6 lawyer-link mb-5"
				>
					<lawyer-card
						:name="lawyer.name"
						:portraitUuid="lawyer.thumbnailUuid"
					/>
				</nuxt-link>
			</div>
		</div>

		<div class="pt-5" v-if="alerts?.length > 0">
			<h2 class="h2 azul text-center">
				{{ strings.legal_alerts[$locale] }}
			</h2>
			<legal-alert
				v-for="alert in alerts"
				:uuid="alert.uuid"
				:lang="$locale"
			/>
		</div>

		<div class="pt-5" v-if="articles?.length > 0">
			<h2 class="h2 azul text-center">
				{{ strings.press[$locale] }}
			</h2>
			<media-article
				v-for="article in articles"
				:uuid="article.uuid"
				:lang="$locale"
			/>
		</div>

		<div class="container-fluid p-5 text-center" v-if="events?.length > 0">
			<h2 class="h2 azul">
				{{ strings.events[$locale] }}
			</h2>
			<div class="container-fluid">
				<div class="row g-5">
					<div
						class="col-12 col-sm-6 col-lg-4"
						v-for="article in events"
					>
						<event :uuid="article.uuid" :lang="$locale" />
					</div>
				</div>
			</div>
		</div>

		<div class="my-5"></div>
	</div>
</template>

<style scoped>
.search-container {
	padding-top: 80px;
	min-height: 50vh;
}
</style>
