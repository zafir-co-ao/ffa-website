<script lang="ts" setup>
import { strings } from "~/lib/intl/strings";

const { $locale: lang } = useI18n();

useSeoMeta({
	title: strings.meta_title[lang.value],
	description: strings.meta_description[lang.value],

	// keywords: ,
	ogTitle: strings.meta_title[lang.value],
	ogUrl: "https://fatimafreitas.com",
	ogImage: "https://fatimafreitas.com/images/ffa-icon.jpg",
	ogSiteName: strings.meta_og_site_name[lang.value],
	ogType: "website",
	ogLocale: lang.value,
	ogDescription: strings.meta_description[lang.value],
});

useHead({
	meta: [{ name: "keywords", content: strings.meta_keywords[lang.value] }],
});
</script>

<template>
	<div class="ffa">
		<Title>{{ strings.meta_title[lang] }}</Title>

		<navbar />

		<slot />

		<get-in-touch />
		<portal-footer />
	</div>
</template>
