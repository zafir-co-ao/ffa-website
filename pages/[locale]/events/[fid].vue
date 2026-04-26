<script lang="ts" setup>
import { strings } from "~/lib/intl/strings";
import { type I18nEvent } from "~/lib/model/types/event";
import { getI18nEvent } from "~/lib/server_api_clients/events_client";
import { makeLinkedinShareUrl, makeWhatsappShareUrl } from "~/lib/social_share_link_builder";

// import error404 from "../../err/404.vue";

const nodeClient = useAntboxClient();

const route = useRoute();

const fid = route.params.fid as string;

const { $locale: lang } = useI18n();

const BACK_PAGE = `/${lang.value}/media`;

const whatsappShare = ref<string>();
const linkedinShare = ref<string>();

const event = ref<I18nEvent>();

const formatedEventDate = computed(() => {
	if (!event.value?.eventDateTime) {
		console.error("Event date is missing");
		console.error(JSON.stringify(event.value, null, 2));

		return "";
	}

	return event.value?.eventDateTime.substring(0, 10);
});

const bannerUrl = computed(() => nodeClient.getNodeUrl(event.value?.bannerUuid!));

function ldJson() {
	return JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Event",
		name: event.value?.title,
		startDate: event.value?.eventDateTime,
		location: event.value?.eventPlace ?? "ND",
		description: event.value?.body ?? event.value?.title,
		organizer: {
			"@type": "Organization",
			name: strings.meta_og_site_name[lang.value],
			url: "https://www.fatimafreitas.com",
		},
	});
}

onMounted(async () => {
	const eventOrErr = await getI18nEvent(fid, lang.value);

	if (eventOrErr.isLeft()) {
		console.error("Error fetching event ", fid, eventOrErr.value);
		return;
	}

	event.value = eventOrErr.value;

	whatsappShare.value = makeWhatsappShareUrl();
	linkedinShare.value = makeLinkedinShareUrl();

	useHead({
		script: [
			{
				type: "application/ld+json",
				innerHTML: ldJson(),
			},
		],

		title: `${event.value?.title} - ${strings.meta_title[lang.value]}`,
	});
});
</script>

<template>
	<div class="container">
		<div v-if="event">
			<app-article-breadcrumbs
				:lang="lang"
				:back-page-url="BACK_PAGE"
				:back-page-tile="strings.media[lang]!"
				:third-level-title="strings.events[lang]!"
				:article-title="event.title"
			/>

			<div class="body2 text-center">
				<span class="azulescuro">
					<i class="bi bi-calendar"></i>&nbsp;&nbsp;{{ formatedEventDate }}
				</span>
				<span class="azulescuro" v-if="event.eventPlace?.length ?? 0 > 0">
					| <i class="bi bi-geo-alt"></i>&nbsp;&nbsp;{{ event.eventPlace }}
				</span>
			</div>

			<app-article-title :title="event.title" />

			<app-article-social-share-buttons
				:linkedin-share="linkedinShare!"
				:whatsapp-share="whatsappShare!"
			/>

			<div v-html="event.body" />

			<div class="text-center mt-5">
				<img
					v-if="event.bannerUuid"
					:src="bannerUrl"
					class="event-banner-image"
				/>
			</div>

			<div v-if="event.registrationUrl" class="mt-5">
				{{ strings.online_registration[lang] }}:
				<a target="_blank" href="event.registrationUrl">{{ event.registrationUrl }}</a>
			</div>

			<app-article-back-link :lang="lang" :back-page="BACK_PAGE" />
		</div>
		<!-- <div v-else>
			<error404 />
		</div> -->
	</div>
</template>

<style scoped>
.event-banner-image {
	max-width: 75%;
}
</style>
