<script lang="ts" setup>
import { nodeServiceClient, fidToUuid } from "~/lib/deps";
import { throwsNotFoundError } from "~~/lib/errors";
import { strings } from "~~/lib/intl/strings";
import { LocalizedEvent } from "~~/lib/model/event";
import {
	makeLinkedinShareUrl,
	makeWhatsappShareUrl,
} from "~~/lib/socialShareLinkBuilder";
import useLanguage from "~~/lib/useLanguage";

const route = useRoute();
const router = useRouter();

const fid = route.params.fid as string;

const { lang } = useLanguage(router, route);

const BACK_PAGE = `/${lang.value}/media`;

const whatsappShare = ref<string>("");
const linkedinShare = ref<string>("");
const node = await nodeServiceClient.get(fidToUuid(fid));

if (!node) {
	throwsNotFoundError();
}

const endpoint = `/api/events/${node.uuid}/${lang.value}`;
const { data: event } = await useFetch<LocalizedEvent>(endpoint);

const formatedEventDate = computed(() =>
	event.value.eventDateTime.substring(0, 10)
);

const bannerUrl = computed(() =>
	nodeServiceClient.getNodeUrl(event.value.bannerUuid)
);

onMounted(() => {
	whatsappShare.value = makeWhatsappShareUrl();
	linkedinShare.value = makeLinkedinShareUrl();
});

const ldJson = JSON.stringify({
	"@context": "https://schema.org",
	"@type": "Event",
	name: event.value.title,
	startDate: event.value.eventDateTime,
	location: event.value.eventPlace?.length ? event.value.eventPlace : "ND",
	description: event.value.body ?? event.value.title,
	organizer: {
		"@type": "Organization",
		name: strings.meta_og_site_name[lang.value],
		url: "https://fatimafreitas.com",
	},
});
</script>

<template>
	<div class="container">
		<Title>{{ event.title }} - {{ strings.meta_title[lang] }}</Title>
		<Script type="application/ld+json" :children="ldJson"></Script>

		<app-article-breadcrumbs
			:lang="lang"
			:back-page-url="BACK_PAGE"
			:back-page-tile="strings.media[lang]"
			:third-level-title="strings.events[lang]"
			:article-title="event.title"
		/>

		<div class="body2 text-center">
			<span class="azulescuro">
				<i class="bi bi-calendar"></i>&nbsp;&nbsp;{{
					formatedEventDate
				}}
			</span>
			<span class="azulescuro" v-if="event.eventPlace?.length > 0">
				| <i class="bi bi-geo-alt"></i>&nbsp;&nbsp;{{
					event.eventPlace
				}}
			</span>
		</div>

		<app-article-title :title="event.title" />

		<app-article-social-share-buttons
			:linkedin-share="linkedinShare"
			:whatsapp-share="whatsappShare"
		/>

		<div v-html="event.body" />

		<div class="text-center mt-5">
			<img
				v-if="event.bannerUuid"
				:src="bannerUrl"
				style="max-width: 75%"
			/>
		</div>

		<div v-if="event.registrationUrl" class="mt-5">
			{{ strings.online_registration[lang] }}:
			<a target="_blank" href="event.registrationUrl">{{
				event.registrationUrl
			}}</a>
		</div>

		<app-article-back-link :lang="lang" :back-page="BACK_PAGE" />
	</div>
</template>
