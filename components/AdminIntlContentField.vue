<script lang="ts"></script>

<script lang="ts" setup>
import { I18nMessagesEntry } from "~~/lib/intl/strings";

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
		<div class="d-flex">
			<textarea
				class="w-50 me-3"
				:value="modelValue?.pt ?? ''"
				@input="emitModelValue({ pt: $event.target['value'] })"
			/>
			<textarea
				class="w-50"
				:value="modelValue?.en ?? ''"
				@input="emitModelValue({ en: $event.target['value'] })"
			/>
		</div>
	</div>
</template>

<style scoped>
textarea {
	padding: 0.75em 0.75em;
	border: solid 1px #73777f;
	border-radius: 0;
	background-color: unset;
	color: unset;
}
</style>
