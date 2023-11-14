<script lang="ts" setup>
import { WebContent } from "~/lib/deps";
import { I18nWebContentGetter } from "~/lib/server_api_clients/web_content_client";

const props = defineProps<{
	getter: I18nWebContentGetter;
	editGetter: () => Promise<WebContent>;
	editSaver: (content: WebContent) => Promise<void>;
}>();

// const editorRef = ref();

const content = ref<string>("");
content.value = await props.getter();

// const canEdit = computed(() => {
// 	const auth = useAuth();

// 	return (
// 		auth.username !== null &&
// 		auth.username !== undefined &&
// 		props.editSaver !== undefined &&
// 		props.editSaver !== null
// 	);
// });

// async function editWebContent() {
// 	const content = await props.editGetter();

// 	editorRef.value?.open(content, async (content: WebContent) => {
// 		await props.editSaver(content);
// 	});
// }
</script>

<template>
	<div class="app-web-content container mt-5 mb-5 position-relative">
		<!--
		<client-only>
			<lr-web-content-editor-dialog ref="editorRef" /> 
			<app-icon-button
				v-if="canEdit"
				iconClass="bi bi-pencil"
				class="edit-button"
				@click="editWebContent"
			/>
		</client-only>
		-->

		<div class="row">
			<div class="col" v-html="content" />
		</div>
	</div>
</template>

<style scoped>
.edit-button {
	position: absolute;
	top: -1.75em;
	right: 0;

	box-sizing: border-box;
	width: 2em;
	height: 2em;

	display: flex;
	justify-content: center;

	border-radius: 50%;
}

.edit-button:hover {
	background-color: aliceblue;
}
</style>
