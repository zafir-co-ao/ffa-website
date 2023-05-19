<script lang="ts" setup>
import { PortalLocale } from "~/lib/model/types/portal_locale";

interface AppInputProps {
	lang?: PortalLanguage;
	modelValue: any;
}

const { lang } = withDefaults(defineProps<AppInputProps>(), {
	lang: "pt",
});
const emit = defineEmits(["update:modelValue"]);

const placeholder = { pt: "O que procura?", en: "Type to search" };
</script>

<template>
	<div>
		<input
			type="text"
			class="form-control borderazulmenu"
			:placeholder="placeholder[lang] ?? placeholder.pt"
			:value="modelValue"
			@input="emit('update:modelValue', ($event.target as any).value)"
		/>
	</div>
</template>

<style lang="scss" scoped>
input {
	padding: 0.75em 0.75em;
	border: solid 1px #73777f;
	border-radius: 0;
}
</style>
