<script lang="ts" setup>
import { strings } from "~~/lib/intl/strings";
import { LocalizedMediaArticle } from "~~/lib/model/mediaArticle";
import useLanguage from "~~/lib/useLanguage";
import LegalAlert from "~~/components/LegalAlert.vue";
import { LocalizedLegalAlert } from "~~/lib/model/legalAlerts";
import { LocalizedEvent } from "~~/lib/model/event";

const { lang } = useLanguage(useRouter(), useRoute());

const alertsEndpoint = `/api/legal-alerts/-/${lang}?latest=3`;
const eventsEndpoint = `/api/events/-/${lang}?latest=3`;
const mediaEndpoint = `/api/media-articles/-/${lang}?latest=4`;

const { data: articles } = await useFetch<LocalizedMediaArticle[]>(
	mediaEndpoint
);
const { data: events } = await useFetch<LocalizedEvent[]>(eventsEndpoint);
const { data: alerts } = await useFetch<LocalizedLegalAlert[]>(alertsEndpoint);
</script>

<template>
	<div>
		<Title
			>{{ strings.media[lang] }} - {{ strings.meta_title[lang] }}</Title
		>

		<app-section-header-container fid="media__separador_1" :lang="lang" />

		<div class="container pb-5 mt-5">
			<div class="row g-5">
				<div class="col-md p-5 bg-azul-1 mx-2">
					<h2 class="h3 font-weight-700 azul text-center">
						{{ strings.legal_alerts[lang] }}
					</h2>
					<legal-alert
						v-for="article in alerts"
						:big-button="true"
						:uuid="article.uuid"
						:lang="lang"
					/>
					<div class="text-center body2 mt-5">
						<nuxt-link :to="`/${lang}/legal-alerts/archive`">{{
							strings.see_all_legal_alerts[lang]
						}}</nuxt-link>
					</div>
				</div>
				<div class="col-md p-5 bg-azul-1 mx-2">
					<h2 class="h3 font-weight-700 azul text-center">
						{{ strings.press[lang] }}
					</h2>
					<media-article
						v-for="article in articles"
						:uuid="article.uuid"
						:lang="lang"
					/>
				</div>
			</div>
		</div>

		<div class="container p-5 bg-azul-2 text-center">
			<h2 class="h3 font-weight-700 azul">
				{{ strings.events[lang] }}
			</h2>
			<div class="container-fluid">
				<div class="row g-5">
					<div
						class="col-12 col-sm-6 col-lg-4"
						v-for="article in events"
					>
						<event :uuid="article.uuid" :lang="lang" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style>
.bg-azul-1 {
	background: #f3f9ff;
}

.bg-azul-2 {
	background: #eef3f9;
}
</style>
