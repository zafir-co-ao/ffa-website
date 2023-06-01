<script lang="ts">
import { strings } from "~/lib/intl/strings";
import { I18nEvent } from "~/lib/model/types/event";
import { i18nEventGetter, searchEventsArchive } from "~/lib/server_api_clients/events_client";
import { i18nSectionHeaderGetter } from "~/lib/server_api_clients/section_headers_client";
</script>

<script lang="ts" setup>
const { $locale: lang } = useI18n();

const pageSize = 6;
const pageToken = ref(1);
const events = ref<I18nEvent[]>([]);

const hasMore = computed(() => pageSize * pageToken.value === events.value.length);

async function loadMore() {
	const newAlerts = await searchEventsArchive(lang.value, pageSize, pageToken.value);

	events.value = [...events.value, ...newAlerts];
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
				{{ strings.events[lang] }} -
				{{ strings.archive[lang] }}
			</h2>

			<div class="row gx-5">
				<div v-for="event in events" class="bg-azul-1 mb-3 pb-4">
					<app-event :getter="i18nEventGetter(event.uuid, lang, false)" :lang="lang" />
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
