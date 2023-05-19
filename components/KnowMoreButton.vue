<script lang="ts" setup>
import { PortalLocale } from "~/lib/model/types/portal_locale";
import { strings } from "~/lib/intl/strings";

interface KnowMoreButtonProps {
	dark?: boolean;
	lang: PortalLanguage;
}

withDefaults(defineProps<KnowMoreButtonProps>(), {
	dark: true,
});
</script>

<template>
	<app-button :dark="dark" :label="strings.know_more[lang]"></app-button>
</template>
