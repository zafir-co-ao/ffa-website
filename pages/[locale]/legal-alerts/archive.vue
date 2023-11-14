<script lang="ts">
import { strings } from "~/lib/intl/strings";
import { type I18nLegalAlert } from "~/lib/model/types/legal_alert";
import {
	i18nLegalAlertGetter,
	searchLegalAlertsArchive,
} from "~/lib/server_api_clients/legal_alerts_client";
import { i18nSectionHeaderGetter } from "~/lib/server_api_clients/section_headers_client";
</script>

<script lang="ts" setup>
const { $locale: lang } = useI18n();

const pageSize = 6;
const pageToken = ref(1);
const alerts = ref<I18nLegalAlert[]>([]);

const hasMore = computed(() => pageSize * pageToken.value === alerts.value.length);

async function loadMore() {
	const newAlerts = await searchLegalAlertsArchive(lang.value, pageSize, pageToken.value);

	alerts.value = [...alerts.value, ...newAlerts];
}

function handleLoadMoreClick() {
	pageToken.value++;

	loadMore();
}

onMounted(loadMore);
</script>

<template>
	<div>
		<Title>{{ strings.archive[lang] }} - {{ strings.meta_title[lang] }}</Title>

		<app-section-header :getter="i18nSectionHeaderGetter('media__separador_1', lang)" />

		<div class="container">
			<h2 class="h3 font-weight-700 azul text-center">
				{{ strings.legal_alerts[lang] }} -
				{{ strings.archive[lang] }}
			</h2>

			<div class="row gx-5">
				<div v-for="alert in alerts" class="bg-azul-1 mb-3 pb-4">
					<app-legal-alert
						:getter="i18nLegalAlertGetter(alert.uuid, lang, false)"
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
