<script lang="ts"></script>

<script lang="ts" setup>
import { type I18nMessagesEntry } from "~/lib/intl/strings";

interface FieldProps {
	modelValue: I18nMessagesEntry;
	label: string;
}

const props = defineProps<FieldProps>();
const emit = defineEmits(["update:modelValue"]);

function emitModelValue(value: Partial<I18nMessagesEntry>) {
	emit("update:modelValue", { ...props.modelValue, ...value });
}
</script>

<template>
	<div>
		<label class="form-label azulescuro fw-bolder"> {{ label }}</label>
		<div class="d-flex gap-2">
			<app-input
				class="w-50"
				label="PT"
				:model-value="modelValue?.pt ?? ''"
				@update:model-value="emitModelValue({ pt: $event })"
			/>

			<app-input
				class="w-50"
				label="EN"
				:model-value="modelValue?.en ?? ''"
				@update:model-value="emitModelValue({ en: $event })"
			/>
		</div>
	</div>
</template>

<style scoped>
input {
	padding: 0.75em 0.75em;
	border-radius: 0;
	border: 1px solid #ced4da;
	background-color: unset;
	color: unset;
}
</style>
