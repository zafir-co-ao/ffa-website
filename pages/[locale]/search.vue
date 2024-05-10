<script lang="ts"></script>

<script lang="ts" setup>
import { strings } from "~~/lib/intl/strings";
import type { I18nEvent } from "~~/lib/model/types/event";
import type { I18nLawyer } from "~~/lib/model/types/lawyer";
import type { I18nLegalAlert } from "~/lib/model/types/legal_alert";
import type { I18nMediaArticle } from "~/lib/model/types/media_article";
import { searchI18nEvents, i18nEventGetter } from "~/lib/server_api_clients/events_client";
import { searchI18nLawyers, i18nLawyerGetter } from "~/lib/server_api_clients/lawyers_client";
import {
	i18nLegalAlertGetter,
	searchI18nLegalAlerts,
} from "~/lib/server_api_clients/legal_alerts_client";
import {
	i18nMediaArticleGetter,
	searchI18nMediaArticles,
} from "~/lib/server_api_clients/media_articles_client";

const { $locale: lang } = useI18n();
const nodeClient = useAntboxClient();

const events = ref<I18nEvent[]>();
const alerts = ref<I18nLegalAlert[]>();
const articles = ref<I18nMediaArticle[]>();
const lawyers = ref<I18nLawyer[]>();

const searchString = ref<string>();

function updateSearch() {
	if (!searchString.value || searchString.value.length < 3) {
		return;
	}

	searchI18nEvents(searchString.value, lang.value).then((e) => (events.value = e));
	searchI18nLegalAlerts(searchString.value, lang.value).then((e) => (alerts.value = e));
	searchI18nMediaArticles(searchString.value, lang.value).then((e) => (articles.value = e));
	searchI18nLawyers(searchString.value, lang.value).then((e) => (lawyers.value = e));
}
</script>

<template>
	<div class="search-container container">
		<app-search-input
			class="mb-5"
			type="text"
			:lang="lang"
			v-model="searchString"
			@input="updateSearch"
		/>

		<div class="pt-5" v-if="lawyers && lawyers.length > 0">
			<h2 class="h2 azul text-center">{{ strings.people[lang] }}</h2>
			<div class="row mt-5 mb-5 d-flex justify-content-center">
				<nuxt-link
					v-for="lawyer in lawyers"
					:to="`/${lang}/lawyers/${lawyer.fid}`"
					class="col-lg-4 col-6 lawyer-link mb-5"
				>
					<app-lawyer-card
						:name="lawyer.name"
						:urlGetter="() => nodeClient.getNodeUrl(lawyer.thumbnailUuid!)"
					/>
				</nuxt-link>
			</div>
		</div>

		<div class="pt-5" v-if="alerts && alerts.length > 0">
			<h2 class="h2 azul text-center">
				{{ strings.legal_alerts[lang] }}
			</h2>
			<app-legal-alert
				v-for="alert in alerts"
				:getter="i18nLegalAlertGetter(alert.uuid, lang, false)"
				:lang="lang"
			/>
		</div>

		<div class="pt-5" v-if="articles && articles.length > 0">
			<h2 class="h2 azul text-center">
				{{ strings.press[lang] }}
			</h2>
			<app-media-article
				v-for="article in articles"
				:getter="i18nMediaArticleGetter(article.uuid, lang, false)"
				:lawyerGetter="i18nLawyerGetter(article.lawyerUuid!, lang, false)"
				:has-lawyer="article.lawyerUuid ? true : false"
				:lang="lang"
			/>
		</div>

		<div class="container-fluid p-5 text-center" v-if="events && events.length > 0">
			<h2 class="h2 azul">
				{{ strings.events[lang] }}
			</h2>
			<div class="container-fluid">
				<div class="row g-5 d-flex justify-content-center">
					<div class="col-12 col-sm-6 col-lg-4" v-for="article in events">
						<app-event
							:getter="i18nEventGetter(article.uuid, lang, false)"
							:lang="lang"
						/>
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
