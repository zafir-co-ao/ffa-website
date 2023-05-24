<script lang="ts"></script>

<script lang="ts" setup>
import { I18nMessagesEntry } from "~/lib/intl/strings";
import { PortalLocale } from "~/lib/model/types/portal_locale";

interface MultichoiceOptionProps<T> {
	lang?: PortalLocale;
	label: I18nMessagesEntry;
	options: { value: T; label: string }[];
	modelValue?: T[];
}

const props = withDefaults(defineProps<MultichoiceOptionProps<any>>(), {
	modelValue: [] as any,
	lang: "pt",
});

const emit = defineEmits(["update:modelValue"]);

function updateParent(value: any) {
	if (props.modelValue?.includes(value)) {
		emit("update:modelValue", props.modelValue?.filter((v) => v !== value) ?? []);
	} else {
		emit("update:modelValue", [...(props.modelValue ?? []), value]);
	}
}
</script>

<template>
	<fieldset class="row">
		<label class="w-100 fw-bolder">{{ label?.[lang] ?? "%%%" }}</label>
		<div class="form-check col-4" v-for="option in options">
			<input
				class="form-check-input"
				type="checkbox"
				:checked="modelValue?.includes(option.value)"
				@change="updateParent(option.value)"
			/>
			<label class="form-check-label">{{ option.label }}</label>
		</div>
	</fieldset>
</template>

<style scoped>
.form-check {
	padding: 6px 36px !important;
}
.form-check-input {
	margin-right: 6px;
	border-radius: 0px;
}
</style>
