<script lang="ts"></script>

<script lang="ts" setup>
import type { I18nMessagesEntry } from "~/lib/intl/strings";

interface FieldProps {
	content: I18nMessagesEntry;
	label: string;
}
interface FieldEvents {
	(e: "edit"): void;
}

defineProps<FieldProps>();
const emit = defineEmits<FieldEvents>();
</script>

<template>
	<div>
		<div class="d-flex">
			<label class="fw-bolder flex-fill"> {{ label }}</label>
			<app-icon-button class="field-icon" iconClass="bi bi-pencil" @click="emit('edit')" />
		</div>
		<div class="d-flex">
			<admin-html-field class="w-50 me-3" :content="content?.pt ?? ''" />
			<admin-html-field class="w-50" :content="content?.en ?? ''" />
		</div>
	</div>
</template>

<style scoped>
.field-icon {
	padding: 0.15em 0;
}
</style>
