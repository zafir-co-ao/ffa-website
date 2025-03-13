<script lang="ts"></script>

<script lang="ts" setup>
import { computed } from "vue";

export interface Props {
	variant?: "filled" | "tonal" | "outlined" | "standard";
	disabled?: boolean;
}

export interface Events {
	(e: "click", evt: MouseEvent): void;
}

const props = withDefaults(defineProps<Props>(), { variant: "standard", disabled: false });
defineEmits<Events>();

const classes = computed(() => {
	const classes = ["lr-icon-button"];
	classes.push(`lr-icon-button__${props.variant}`);
	return classes;
});
</script>

<template>
	<button @click="$emit('click', $event)" :class="classes" :disabled="disabled">
		<span class="material-symbols-sharp tw-text-2xl/6"><slot></slot></span>
	</button>
</template>

<style scoped>
/* Buttons */
.lr-icon-button {
	/* @apply tw-cursor-pointer tw-flex tw-items-center tw-justify-center tw-w-10 tw-h-10 tw-rounded-full tw-text-lr-primary
		hover:tw-bg-lr-primary hover:tw-bg-opacity-10
        focus:tw-bg-lr-primary focus:tw-bg-opacity-20 focus-visible:tw-outline-none
        disabled:tw-text-lr-on-surface disabled:tw-opacity-40 disabled:tw-cursor-default; */
	@apply tw-cursor-pointer tw-flex tw-items-center tw-justify-center tw-w-10 tw-h-10 tw-rounded-full
		tw-bg-opacity-10 focus:tw-bg-opacity-20 focus-visible:tw-outline-none
               disabled:tw-opacity-40 disabled:tw-cursor-default;
}

.lr-icon-button__filled {
	/* @apply tw-bg-lr-primary tw-text-lr-on-primary hover:tw-bg-opacity-80 focus:tw-bg-opacity-60; */
	@apply hover:tw-bg-opacity-80 focus:tw-bg-opacity-60;
}

.lr-icon-button__outlined {
	/* @apply tw-border tw-border-lr-outline; */
	@apply tw-border;
}

.lr-icon-button__elevated {
	/* @apply tw-shadow tw-shadow-lr-outline; */
	@apply tw-shadow;
}
</style>
