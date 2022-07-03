<script lang="ts">
import { Toast, useToast } from "~~/lib/deps";
import WebContentEditorDialog from "~lightray/WebContentEditorDialog.vue";
import editIntlField, {
	makeDialogProps,
	makeSaveHandler,
} from "~~/components/editIntField";
import { nodeServiceClient } from "~~/lib/deps";

import {
	legalAlertCategories,
	I18nMessages,
	strings,
} from "~~/lib/intl/strings";
import makeApiController from "./apiController";
import makeApiResponseHandler from "./apiResponseHandler";
import { forceReplace } from "./forcedReloader";
import makeModelReloader from "./modelReloader";
import LegalAlert, {
	fromLegalAlert,
	makeLegalAlert,
} from "~~/lib/model/legalAlerts";
import { LEGAL_ALERTS_PARENT_FOLDER_FID } from "~~/lib/api/parentFolders";
import assertFolderExist from "~~/lib/api/assertFolderExist";

const API_BASE_URL = "/api/legal-alerts";
const BACK_PAGE = "/a/legal-alerts";

function mapI18nToOptions(
	strings: I18nMessages
): { value: string; label: string }[] {
	return Object.entries(strings)
		.map(([key, value]) => ({
			value: key,
			label: value.pt,
		}))
		.sort((a, b) => a.label.localeCompare(b.label));
}
</script>

<script lang="ts" setup>
definePageMeta({ layout: "admin" });

const dialogProps = reactive(makeDialogProps());
const saveIntlFieldHandler = makeSaveHandler(dialogProps);

const toast = ref<Toast>();
const alert = ref<LegalAlert>(makeLegalAlert());

const apiCtrl = makeApiController(API_BASE_URL);
const apiHandler = makeApiResponseHandler(toast);
const modelReloader = makeModelReloader(
	apiHandler,
	apiCtrl,
	makeLegalAlert,
	useRoute().query.uuid as string,
	alert
);

const availableCategories = mapI18nToOptions({
	Alert: legalAlertCategories.Alert,
	Bulletin: legalAlertCategories.Bulletin,
});

onMounted(async () => {
	toast.value = useToast(".edit-legal-alert");
	await reloadLegalAlert();
});

async function handleSave(): Promise<void> {
	const node = fromLegalAlert(alert.value);
	const file = makeFile(alert, node.title);

	try {
		node.uuid = await createOrUpdateNodeFile(file, node.uuid);

		await nodeServiceClient.update(node.uuid, node);

		toast.value?.success("Operação executada com sucesso");
		forceReplace("/a/edit-legal-alert?uuid=" + node.uuid);
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

	const parent = await assertFolderExist(
		LEGAL_ALERTS_PARENT_FOLDER_FID,
		"Alertas Jurídicos"
	);

	return await nodeServiceClient.createFile(file, parent);
}

async function handleDelete(): Promise<void> {
	if (!alert.value.uuid) {
		return;
	}

	apiHandler.handle(apiCtrl.delete(alert.value.uuid)).then(back);
}

function scrollToTop() {
	const a = document.createElement("a");
	a.href = "#pageTop";
	a.click();
}

function handleEditBody() {
	editIntlField(dialogProps, strings.legal_alerts.pt, alert.value.body);
}

function back() {
	useRouter().push(BACK_PAGE);
}

async function reloadLegalAlert(): Promise<void> {
	await modelReloader.reload();
}
</script>

<template>
	<div id="pageTop" class="edit-legal-alert container-fluid">
		<admin-page-title :backTo="BACK_PAGE"
			>Criar / Editar Alerta Jurídico</admin-page-title
		>

		<admin-intl-content-field
			class="mb-3"
			:label="strings.legal_alert_title.pt"
			v-model="alert.title"
		/>

		<div class="row mb-4">
			<app-input
				class="col-md-6"
				type="date"
				v-model="alert.publishedOn"
				:label="strings.legal_alert_published_on"
				:placeholder="strings.legal_alert_published_on"
			/>

			<div class="col col-md-6">
				<label class="form-label azulescuro fw-bolder">{{
					strings.lawyer_category.pt
				}}</label>
				<select class="form-select" v-model="alert.category">
					<option
						v-for="option in availableCategories"
						:value="option.value"
					>
						{{ option.label }}
					</option>
				</select>
			</div>
		</div>

		<hr />

		<admin-web-content-field
			class="mb-4"
			:label="strings.legal_alert_body.pt"
			:content="alert.body"
			@edit="handleEditBody"
		/>
		<!--
		<hr v-if="alert.uuid" />
		<div v-if="alert.uuid" class="row mb-4 d-flex justify-content-center">
			<input
				ref="pdfRef"
				type="file"
				accept=".pdf"
				@change="handleUploadPDF"
				class="d-none"
			/>
			<a
				class="btn lawyer-photo-container"
				href="#"
				@click="pdfRef.click()"
			>
				Anexar PDF
			</a>
		</div>
        -->

		<hr />

		<admin-actions
			class="mb-3"
			:backTo="BACK_PAGE"
			:deleteDisabled="!alert.uuid"
			:saveDisabled="!alert.title?.pt"
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
</style>
