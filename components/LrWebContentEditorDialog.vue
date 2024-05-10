<script lang="ts">
import type { LrDialog } from "#build/components";
</script>

<script lang="ts" setup>
type WebContentLanguage = "pt" | "en";
interface WebContent {
	title: string;
	pt: string;
	en: string;
}

const curcontent = ref("");
const curlang = ref<WebContentLanguage>("pt");
const content = ref<WebContent>();
const dialogRef = ref<typeof LrDialog>();

const title = ref("");

const onSaveCb = ref<(content: WebContent) => void>();

function open(webcontent: WebContent, onSave: (content: WebContent) => void) {
	content.value = webcontent;
	curcontent.value = content.value.pt;
	curlang.value = "pt";
	title.value = webcontent.title;
	onSaveCb.value = onSave;

	dialogRef.value!.open();
}

function close() {
	dialogRef.value!.close();
}

function changeLanguage(lang: WebContentLanguage) {
	if (content.value) {
		if (!content.value[lang]) {
			content.value[lang] = "";
		}

		content.value[curlang.value as "pt"] = curcontent.value;
		curcontent.value = content.value[lang] ?? "";
		curlang.value = lang;
	}
}

function save() {
	if (content.value) {
		content.value[curlang.value] = curcontent.value;
	}

	onSaveCb.value?.(content.value!);
	close();
}

defineExpose({ open, close });
</script>

<template>
	<LrDialog ref="dialogRef">
		<div class="modal-body">
			<div class="mb-2 mt-4">
				<button
					role="button"
					class="language-button"
					:class="{ 'language-button--selected': curlang === 'pt' }"
					@click="changeLanguage('pt')"
				>
					Português
				</button>
				&nbsp;
				<button
					role="button"
					class="language-button"
					:class="{ 'language-button--selected': curlang === 'en' }"
					@click="changeLanguage('en')"
				>
					Inglês
				</button>
			</div>
			<html-editor v-model="curcontent" />
		</div>

		<div class="modal-footer">
			<AppButton label="Cancelar" :condensed="true" @click="close" />
			<AppButton label="Alterar" :dark="true" :condensed="true" @click="save" />
		</div>
	</LrDialog>
</template>

<style scoped>
.language-button {
	background-color: transparent;
	border: 1px solid #003152;

	color: #003152;
	cursor: pointer;
	font-size: 14px;
	padding: 4px 8px;
}

.language-button--selected {
	background-color: #0071bc;

	color: #fff;
	border-color: #0071bc;
}
</style>
