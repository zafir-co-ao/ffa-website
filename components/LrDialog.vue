<script lang="ts" setup>
import { ref } from "vue";

withDefaults(defineProps<{ borderless?: boolean }>(), { borderless: false });

const dialogRef = ref<HTMLDialogElement>();

function close() {
	dialogRef.value?.close();
}

function open() {
	dialogRef.value?.showModal();
}

defineExpose({ open, close });
</script>

<template>
	<dialog
		ref="dialogRef"
		class="tw-bg-transparent focus-visible:tw-outline-none tw-mt-4"
		:class="{ 'lr-dialog--borderless': borderless }"
	>
		<div class="tw-relative tw-p-4">
			<div class="tw-absolute tw-top-6 tw-right-6 tw-z-10">
				<LrIconButton @click="close" variant="filled">close</LrIconButton>
			</div>

			<div class="lr-dialog__container tw-relative tw-box-border tw-p-6 bg-white">
				<slot></slot>
			</div>
		</div>
	</dialog>
</template>

<style scoped>
dialog::backdrop {
	background-color: rgba(0, 0, 0, 0.75);
}

.lr-dialog--borderless .lr-dialog__container {
	@apply tw-p-0;
}
</style>
