<script lang="ts" setup>
interface AppInputProps {
	type?: "text" | "email" | "date" | "password" | "number";
	label?: string;
	placeholder?: string;
	disabled?: boolean;
	modelValue: any;
}

withDefaults(defineProps<AppInputProps>(), {
	type: "text",
	disabled: false,
});
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
	<div>
		<div class="form-floating">
			<input
				:type="type"
				class="form-control"
				:placeholder="placeholder"
				:value="modelValue"
				:disabled="disabled"
				@input="emit('update:modelValue', ($event.target as any).value)"
			/>
			<label v-if="label" for="floatingInput" class="form-label azulescuro fw-bolder">{{
				label
			}}</label>
		</div>
	</div>
</template>
