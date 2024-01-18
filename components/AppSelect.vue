<script setup lang="ts">
interface Option {
	label: string;
	value: string;
}

defineProps<{
	options: Option[];
	modelValue: string | undefined;
	label: string;
}>();

const emit = defineEmits(["update:modelValue"]);

function emitChange(event: Event) {
	emit("update:modelValue", (event.target as any).value);
}
</script>

<template>
	<div class="form-floating">
		<select class="form-select" :value="modelValue" @change="emitChange">
			<option v-for="option in options" :value="option.value">
				{{ option.label }}
			</option>
		</select>
		<label for="floatingSelect">{{ label }}</label>
	</div>
</template>

<style scoped>
.form-select {
	border-radius: 0;
	border: 1px solid #ced4da;
}
</style>
