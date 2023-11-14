<script lang="ts" setup>
import { strings } from "~/lib/intl/strings";
import type { PortalLocale } from "~/lib/model/types/portal_locale";

interface KnowMoreButtonProps {
	dark?: boolean;
	lang: PortalLocale;
}

withDefaults(defineProps<KnowMoreButtonProps>(), {
	dark: true,
});
</script>

<template>
	<app-button :dark="dark" :label="strings.know_more[lang]!"></app-button>
</template>
