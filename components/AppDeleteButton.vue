<script lang="ts" setup>
import { type PortalLocale } from "~/lib/model/types/portal_locale";

withDefaults(defineProps<{ lang?: PortalLocale }>(), {
	lang: "pt",
});

const scopedStrings = {
	pt: "Apagar",
	en: "Delete",
};
</script>

<template>
	<app-button :label="scopedStrings[lang]"></app-button>
</template>

<style scoped>
button {
	background-color: #ba1b1b !important;
	border-color: #ba1b1b !important;
	color: white;
}
</style>
