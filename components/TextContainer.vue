<script lang="ts" setup>
import {
	fidToUuid,
	nodeServiceClient,
	webContentServiceClient,
} from "~~/lib/deps";

import WebContentEditorDialog from "~lightray/WebContentEditorDialog.vue";
import { makeDialogProps } from "./editIntField";

const { $locale } = useI18n();
const auth = useAuth();

const dialogProps = reactive(makeDialogProps());
const props = defineProps<{ contentFid: string }>();

const uuid = () => fidToUuid(props.contentFid);

const username = ref<string>();

const content = ref();

await reloadContent();

async function reloadContent() {
	content.value = await webContentServiceClient.get(uuid(), $locale.value);
}

async function saveContentHandler() {
	const parts = [JSON.stringify(dialogProps.content)];
	const file = new File(parts, "Content.json", { type: "application/json" });

	const webContentUuid = await nodeServiceClient
		.get(uuid())
		.then((n) => n.uuid)
		.catch((err) => console.error(err));

	if (!webContentUuid) {
		return;
	}

	nodeServiceClient
		.updateFile(webContentUuid, file)
		.then(() => (dialogProps.command = "hide"))
		.then(reloadContent)
		.catch((err) => console.error(err));
}

async function editContent() {
	const webContent = await nodeServiceClient
		.export(uuid())
		.then((b) => b.text())
		.then((t) => JSON.parse(t));

	if (!webContent) {
		return;
	}

	dialogProps.title = "";
	dialogProps.content = webContent;
	dialogProps.command = "show";
}

onMounted(() => {
	username.value = auth.username;
});
</script>

<template>
	<div class="text-container container mt-5 mb-5">
		<div class="row">
			<div class="col" v-html="content" />
		</div>
		<i
			v-if="username"
			class="edit-button bi bi-pencil azul"
			@click="editContent"
		/>

		<web-content-editor-dialog
			:title="dialogProps.title"
			:content="dialogProps.content"
			v-model:command="dialogProps.command"
			@save="saveContentHandler"
		/>
	</div>
</template>

<style scoped>
.text-container {
	position: relative;
}

.edit-button {
	position: absolute;
	right: 0;
	top: 0;

	font-size: 12px;
	cursor: pointer;
}
</style>
