<script lang="ts" setup>
import type PopupDialogVue from "~/components/PopupDialog.vue";
import { strings } from "~/lib/intl/strings";

const dialogRef = ref<typeof PopupDialogVue>();

const { $locale: lang } = useI18n();

useSeoMeta({
	title: strings.meta_title[lang.value],
	description: strings.meta_description[lang.value],

	// keywords: ,
	ogTitle: strings.meta_title[lang.value],
	ogUrl: "https://www.fatimafreitas.com",
	ogImage: "https://www.fatimafreitas.com/images/ffa-icon.jpg",
	ogSiteName: strings.meta_og_site_name[lang.value],
	ogType: "website",
	ogLocale: lang.value,
	ogDescription: strings.meta_description[lang.value],
});

useHead({
	meta: [{ name: "keywords", content: strings.meta_keywords[lang.value] }],
});

onMounted(() => {
	if (localStorage.getItem("ffa-has-seen-popup") === "true") {
		return;
	}

	dialogRef.value?.open();
	localStorage.setItem("ffa-has-seen-popup", "true");
});
</script>

<template>
	<div class="ffa">
		<Title>{{ strings.meta_title[lang] }}</Title>

		<navbar />

		<slot />

		<get-in-touch />
		<portal-footer />
		<popup-dialog ref="dialogRef" />
	</div>
</template>
