<script lang="ts" setup>
import ScreenSizeIndicator from "~lightray/ScreenSizeIndicator.vue";
import useLanguage from "~~/lib/useLanguage";
import { strings } from "~~/lib/intl/strings";

const { lang } = useLanguage(useRouter(), useRoute());
const runtimeMode = useRuntimeMode();

const development = computed(() => runtimeMode.value === "development");

useMeta({
	meta: [
		{ name: "title", content: strings.meta_title[lang.value] },
		{ name: "description", content: strings.meta_description[lang.value] },
		{ name: "keywords", content: strings.meta_keywords[lang.value] },
		{ name: "og:title", content: strings.meta_title[lang.value] },
		{ name: "og:url", content: "https://fatimafreitas.com" },
		{
			name: "og:image",
			content: "https://fatimafreitas.com/images/ffa-icon.jpg",
		},

		{
			name: "og:site_name",
			content: strings.meta_og_site_name[lang.value],
		},
		{ name: "og:type", content: "website" },
		{ name: "og:locale", content: lang.value },

		{
			name: "og:description",
			content: strings.meta_description[lang.value],
		},
	],
});
</script>

<template>
	<div class="ffa">
		<Title>{{ strings.meta_title[lang] }}</Title>

		<screen-size-indicator v-if="development" />
		<navbar />

		<slot />

		<get-in-touch />
		<portal-footer />
	</div>
</template>
