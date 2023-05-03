<script lang="ts" setup>
import { nodeServiceClient } from "~/lib/deps";
import { strings } from "~~/lib/intl/strings";
import MediaArticle, {
	LocalizedMediaArticle,
} from "~/lib/model/types/media_article";
import { PortalLocale } from "~/lib/model/types/portal_locale";

const props = defineProps<{
	uuid: string;
	lang: PortalLocale;
}>();

const endpoint = `/api/media-articles/${props.uuid}/${props.lang}`;
const { data: article } = await useFetch<LocalizedMediaArticle>(endpoint);

const lawyerFid = ref("");

if (article.value.lawyerUuid) {
	lawyerFid.value = await (
		await nodeServiceClient.get(article.value.lawyerUuid)
	).fid;
}
</script>

<template>
	<div class="publication-component mt-5 cursor-pointer">
		<div class="body2 color-gray">
			{{ article.publishedOn }} | {{ article.publicationName }}
		</div>
		<p class="h5 text-black font-weight-500 mb-2">{{ article?.title }}</p>
		<div class="body2 azul mb-2">
			<nuxt-link
				class="color-blue"
				v-if="article.lawyerUuid"
				:to="`/${lang}/lawyers/${lawyerFid}`"
			>
				{{ article.lawyerName }}
			</nuxt-link>
			<a
				class="color-blue"
				v-else-if="article.lawyerLinkedIn"
				:href="article.lawyerLinkedIn"
				target="_blank"
			>
				{{ article.lawyerName }}
			</a>
			<span v-else>{{ article.lawyerName }}</span>
		</div>

		<div class="body2">
			<nuxt-link :to="`/${lang}/media-articles/${article.fid}`">
				{{ strings.know_more[lang] }}</nuxt-link
			>
		</div>
	</div>
</template>

<style scoped>
.color-blue {
	color: #0071bc;
}

.color-gray {
	color: #555;
}
</style>
