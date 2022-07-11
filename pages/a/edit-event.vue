<script lang="ts">
import { Toast, useToast } from "~~/lib/deps";
import WebContentEditorDialog from "~lightray/WebContentEditorDialog.vue";
import editIntlField, {
	makeDialogProps,
	makeSaveHandler,
} from "~~/components/editIntField";
import { nodeServiceClient } from "~~/lib/deps";

import { strings } from "~~/lib/intl/strings";
import makeApiController from "./apiController";
import makeApiResponseHandler from "./apiResponseHandler";
import { forceReplace } from "./forcedReloader";
import makeModelReloader from "./modelReloader";

import { EVENTS_PARENT_FOLDER_FID } from "~~/lib/api/parentFolders";
import assertFolderExist from "~~/lib/api/assertFolderExist";
import Event, { makeEvent, fromEvent } from "~~/lib/model/event";

import { forceReload } from "./forcedReloader";

const API_BASE_URL = "/api/events";
const BACK_PAGE = "/a/events";
</script>

<script lang="ts" setup>
definePageMeta({ layout: "admin" });

const dialogProps = reactive(makeDialogProps());
const saveIntlFieldHandler = makeSaveHandler(dialogProps);

const toast = ref<Toast>();
const event = ref<Event>(makeEvent());
const uploadImageRef = ref<HTMLInputElement>();

const apiCtrl = makeApiController(API_BASE_URL);
const apiHandler = makeApiResponseHandler(toast);
const modelReloader = makeModelReloader(
	apiHandler,
	apiCtrl,
	makeEvent,
	useRoute().query.uuid as string,
	event
);

const bannerUrl = computed(() =>
	nodeServiceClient.getNodeUrl(event.value.bannerUuid)
);

onMounted(async () => {
	toast.value = useToast(".edit-event");
	await reloadEvent();
});

async function handleSave(): Promise<void> {
	const node = fromEvent(event.value);
	const file = makeFile(event, node.title);

	try {
		node.uuid = await createOrUpdateNodeFile(file, node.uuid);

		await nodeServiceClient.update(node.uuid, node);

		toast.value?.success("Operação executada com sucesso");

		forceReplace("/a/edit-event?uuid=" + node.uuid);
		scrollToTop();
	} catch (err) {
		toast.value?.exception({
			name: "ApiCtrlError",
			message: err,
		});
	}
}

function makeFile(alert, title: string) {
	return new File([JSON.stringify(alert.value.body)], title, {
		type: "application/json",
	});
}

async function createOrUpdateNodeFile(
	file: File,
	uuid?: string
): Promise<string> {
	if (uuid) {
		await nodeServiceClient.updateFile(uuid, file);
		return uuid;
	}

	const parent = await assertFolderExist(EVENTS_PARENT_FOLDER_FID, "Eventos");

	return await nodeServiceClient.createFile(file, parent);
}

async function handleDelete(): Promise<void> {
	if (!event.value.uuid) {
		return;
	}

	const bannerUuid = event.value.bannerUuid;

	apiHandler
		.handle(apiCtrl.delete(event.value.uuid))
		.then(() => {
			if (bannerUuid) {
				return apiCtrl.delete(bannerUuid);
			}
		})
		.then(back);
}

function scrollToTop() {
	const a = document.createElement("a");
	a.href = "#pageTop";
	a.click();
}

function handleEditBody() {
	editIntlField(dialogProps, strings.legal_alerts.pt, event.value.body);
}

function back() {
	useRouter().push(BACK_PAGE);
}

function handleUploadImage() {
	if (event.value.bannerUuid) {
		return updateBannerImage();
	}

	return createBannerImage();
}

function updateBannerImage() {
	nodeServiceClient
		.updateFile(event.value.bannerUuid, uploadImageRef.value.files[0])
		.then(forceReload)
		.then(() => toast.value.success("Imagem actualizada com sucesso"))
		.catch((err) => toast.value.exception(err));
}

async function createBannerImage() {
	const parent = await assertFolderExist(EVENTS_PARENT_FOLDER_FID, "Eventos");

	nodeServiceClient
		.createFile(uploadImageRef.value.files[0], parent)
		.then((uuid) => {
			event.value.bannerUuid = uuid;

			const node = fromEvent(event.value);
			return nodeServiceClient.update(node.uuid, node);
		})
		.then(modelReloader.reload)
		.catch((err) => toast.value.exception(err));
}

async function reloadEvent(): Promise<void> {
	await modelReloader.reload();
}
</script>

<template>
	<div id="pageTop" class="edit-event container-fluid">
		<admin-page-title :backTo="BACK_PAGE"
			>Criar / Editar Evento</admin-page-title
		>

		<div v-if="event.uuid" class="mb-5">
			<input
				ref="uploadImageRef"
				type="file"
				accept=".jpg, .png, .jpeg"
				class="d-none"
				@change="handleUploadImage"
			/>
			<div class="d-flex">
				<label class="fw-bolder flex-fill"
					>Banner - Pré-Visualizar</label
				>
				<app-icon-button
					iconClass="bi bi-pencil"
					@click="uploadImageRef.click()"
				/>
			</div>
			<div class="text-center">
				<img v-if="event.bannerUuid" :src="bannerUrl" class="mw-75" />
			</div>
		</div>

		<admin-intl-content-field
			class="mb-3"
			:label="strings.legal_alert_title.pt"
			v-model="event.title"
		/>

		<div class="row mb-4">
			<app-input
				class="col-md-6 col-lg-4"
				type="date"
				v-model="event.eventDateTime"
				:label="strings.event_event_date_time.pt"
				:placeholder="strings.event_event_date_time.pt"
			/>

			<app-input
				class="col-md-6 col-lg-8"
				type="text"
				v-model="event.eventPlace"
				:label="strings.event_event_place.pt"
				:placeholder="strings.event_event_place.pt"
			/>
		</div>

		<div class="row mb-4">
			<app-input
				type="text"
				v-model="event.registrationUrl"
				:label="strings.event_registration_url.pt"
				:placeholder="strings.event_registration_url.pt"
			/>
		</div>

		<hr />

		<admin-web-content-field
			class="mb-4"
			:label="strings.legal_alert_body.pt"
			:content="event.body"
			@edit="handleEditBody"
		/>

		<hr />

		<admin-actions
			class="mb-3"
			:backTo="BACK_PAGE"
			:deleteDisabled="!event.uuid"
			:saveDisabled="!(event.title?.pt && event.eventDateTime)"
			@delete="handleDelete"
			@save="handleSave"
		/>

		<web-content-editor-dialog
			:title="dialogProps.title"
			:content="dialogProps.content"
			v-model:command="dialogProps.command"
			@save="saveIntlFieldHandler"
		/>
	</div>
</template>

<style scoped>
select,
input[readonly] {
	padding: 0.75em 0.75em;
	border: solid 1px #73777f;
	border-radius: 0;
}
select option {
	padding: 1.5em;
}

.mw-75 {
	max-width: 75%;
}
</style>
