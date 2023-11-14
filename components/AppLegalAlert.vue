<script lang="ts" setup>
import { strings } from "~/lib/intl/strings";
import { type I18nLegalAlert } from "~/lib/model/types/legal_alert";
import { type PortalLocale } from "~/lib/model/types/portal_locale";

const props = defineProps<{
	getter: () => Promise<I18nLegalAlert | undefined>;
	lang: PortalLocale;
}>();

const alert = ref<I18nLegalAlert>();

const articlePath = computed(() => `/${props.lang}/legal-alerts/${alert.value?.fid}`);

const scopedStrings = {
	Alert: { pt: "Alerta", en: "Alert" },
	Bulletin: { pt: "Boletim", en: "Bulletin" },
	download_pdf: { pt: "Download PDF", en: "Download PDF" },
};

onMounted(async () => {
	alert.value = await props.getter();
});
</script>

<template>
	<div class="publication-component mt-5 cursor-pointer">
		<div v-if="alert">
			<div class="body2 color-gray">
				{{ alert?.publishedOn }} |
				{{ scopedStrings[alert.category][lang] }}
			</div>
			<div class="h5 font-weight-500">{{ alert.title }}</div>
			<div class="body1 alert-preview mb-2" v-html="alert.body"></div>

			<div class="body2">
				<nuxt-link :to="articlePath">{{ strings.know_more[lang] }}</nuxt-link>
			</div>
		</div>
	</div>
</template>

<style scoped>
.color-gray {
	color: #555;
}
.alert-preview {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	height: 3em;
	text-overflow: -o-ellipsis-lastline;
}
</style>
