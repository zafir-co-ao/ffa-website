<script lang="ts" setup>
/* __placeholder__ */
import type { I18nLawyerGetter } from "~/lib/server_api_clients/lawyers_client";
import type { I18nMediaArticleGetter } from "~/lib/server_api_clients/media_articles_client";
import { strings } from "~/lib/intl/strings";
import type { I18nMediaArticle } from "~/lib/model/types/media_article";
import type { PortalLocale } from "~/lib/model/types/portal_locale";

const props = defineProps<{
	getter: I18nMediaArticleGetter;
	lawyerGetter: I18nLawyerGetter | undefined;
	hasLawyer: boolean;
	lang: PortalLocale;
}>();

const article = ref<I18nMediaArticle>();
const lawyerFid = ref<string>();

onMounted(() => {
	props.getter().then((res) => {
		if (res.isLeft()) {
			console.error("Error fetching media article", res.value);
			return;
		}

		article.value = res.value;
	});

	if (props.hasLawyer) {
		props.lawyerGetter?.().then((res) => {
			if (res.isLeft()) {
				console.error("Error fetching lawyer", res.value);
				return;
			}

			lawyerFid.value = res.value.fid;
		});
	}
});
</script>

<template>
	<div class="publication-component mt-5 cursor-pointer">
		<div v-if="article">
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
