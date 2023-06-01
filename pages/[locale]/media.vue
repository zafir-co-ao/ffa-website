<script lang="ts" setup>
import { strings } from "~/lib/intl/strings";
import { I18nMediaArticle } from "~/lib/model/types/media_article";

import { I18nLegalAlert } from "~/lib/model/types/legal_alert";
import { I18nEvent } from "~/lib/model/types/event";
import {
	getLatestLegalAlerts,
	i18nLegalAlertGetter,
} from "~/lib/server_api_clients/legal_alerts_client";
import { getLatestEvents, i18nEventGetter } from "~/lib/server_api_clients/events_client";
import { i18nSectionHeaderGetter } from "~/lib/server_api_clients/section_headers_client";
import {
	getLatestMediaArticles,
	i18nMediaArticleGetter,
} from "~/lib/server_api_clients/media_articles_client";
import { i18nLawyerGetter } from "~/lib/server_api_clients/lawyers_client";

const { $locale: lang } = useI18n();

const alerts = ref<I18nLegalAlert[]>([]);
const events = ref<I18nEvent[]>([]);
const articles = ref<I18nMediaArticle[]>([]);

onMounted(async () => {
	alerts.value = await getLatestLegalAlerts(lang.value, 3);
	events.value = await getLatestEvents(lang.value, 3);
	articles.value = await getLatestMediaArticles(lang.value, 4);
});
</script>

<template>
	<div>
		<Title>{{ strings.media[lang] }} - {{ strings.meta_title[lang] }}</Title>

		<app-section-header :getter="i18nSectionHeaderGetter('media__separador_1', lang)" />

		<div class="container pb-5 mt-5">
			<div class="row g-5">
				<div class="col-md p-5 bg-azul-1 mx-2">
					<h2 class="h3 font-weight-700 azul text-center">
						{{ strings.legal_alerts[lang] }}
					</h2>
					<app-legal-alert
						v-for="alert in alerts"
						:getter="i18nLegalAlertGetter(alert.uuid, lang, false)"
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
					<app-media-article
						v-for="article in articles"
						:getter="i18nMediaArticleGetter(article.uuid, lang, false)"
						:lawyer-getter="i18nLawyerGetter(article.lawyerUuid!, lang, false)"
						:lang="lang"
					/>
					<div class="text-center body2 mt-5">
						<nuxt-link :to="`/${lang}/media-articles/archive`">{{
							strings.see_all_media_articles[lang]
						}}</nuxt-link>
					</div>
				</div>
			</div>
		</div>

		<div class="container p-5 bg-azul-2 text-center">
			<h2 class="h3 font-weight-700 azul">
				{{ strings.events[lang] }}
			</h2>
			<div class="container-fluid">
				<div class="row g-5">
					<div class="col-12 col-sm-6 col-lg-4" v-for="event in events">
						<app-event
							:getter="i18nEventGetter(event.uuid, lang, false)"
							:lang="lang"
						/>
					</div>
				</div>
			</div>
			<div class="text-center body2 mt-5">
				<nuxt-link :to="`/${lang}/events/archive`">{{
					strings.see_all_events[lang]
				}}</nuxt-link>
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
