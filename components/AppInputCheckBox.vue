<script lang="ts"></script>

<script lang="ts" setup>
interface AppInputProps {
	modelValue: boolean;
	label: string;
}

defineProps<AppInputProps>();
const emit = defineEmits(["update:modelValue"]);

function updateParent(evt: any) {
	emit("update:modelValue", evt.target.checked);
}
</script>

<template>
	<input
		class="form-check-input"
		type="checkbox"
		:value="modelValue"
		@change="updateParent($event)"
	/>
	<label class="form-check-label">{{ label }}</label>
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
