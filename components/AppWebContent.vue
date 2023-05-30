<script lang="ts" setup>
import { WebContent } from "@zafir.co.ao/lightray";
import { I18nWebContentGetter } from "~/lib/server_api_clients/web_content_client";

const props = defineProps<{
	getter: I18nWebContentGetter;
	editGetter: () => Promise<WebContent>;
	editSaver: (content: WebContent) => Promise<void>;
}>();

const content = ref<string>("");
const editorRef = ref();

onMounted(async () => {
	content.value = await props.getter();
});

async function editWebContent() {
	const content = await props.editGetter();
	editorRef.value?.open(content, async (content: WebContent) => {
		await props.editSaver(content);
	});
}
</script>

<template>
	<div class="app-web-content container mt-5 mb-5 position-relative">
		<app-icon-button
			iconClass="bi bi-pencil"
			class="edit-button d-none"
			@click="editWebContent"
		/>

		<div class="row">
			<div class="col" v-html="content" />
		</div>

		<web-content-editor-dialog ref="editorRef" />
	</div>
</template>

<style scoped>
.edit-button {
	position: absolute;
	top: -1.75em;
	right: 0;
}
</style>
