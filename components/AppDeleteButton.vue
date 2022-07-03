<script lang="ts" setup>
import PortalLanguage from "~~/lib/model/portalLanguage";

withDefaults(defineProps<{ lang?: PortalLanguage }>(), {
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
