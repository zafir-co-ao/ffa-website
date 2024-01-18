<script lang="ts">
import { legalAlertCategories, type I18nMessages, strings } from "~~/lib/intl/strings";
import makeApiController from "./apiController";
import makeApiResponseHandler from "./apiResponseHandler";
import makeModelReloader from "./modelReloader";
import { type LegalAlert, makeLegalAlert } from "~/lib/model/types/legal_alert";

import type { WebContent } from "~/lib/deps";
import type { Toaster } from "~/types/toaster";

const API_BASE_URL = "/api/legal-alerts";
const BACK_PAGE = "/a/legal-alerts";

function mapI18nToOptions(strings: I18nMessages): { value: string; label: string }[] {
	return Object.entries(strings)
		.map(([key, value]) => ({
			value: key,
			label: value.pt,
		}))
		.sort((a, b) => a.label.localeCompare(b.label));
}
</script>

<script lang="ts" setup>
definePageMeta({ layout: "admin", middleware: "auth-guard" });

const { csrf } = useCsrf();

const editorRef = ref();
const toast = ref<Toaster>();
const alert = ref<Partial<LegalAlert>>(makeLegalAlert());

const apiCtrl = makeApiController(API_BASE_URL);
const apiHandler = makeApiResponseHandler(toast as Ref<Toaster>);
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
	// const { useToast } = await import("~/lib/clientDeps");
	// toast.value = useToast(".edit-legal-alert");
	await reloadLegalAlert();
});

async function handleSave(): Promise<void> {
	const task = alert.value.uuid
		? apiCtrl.update(alert.value as LegalAlert)
		: apiCtrl.create(alert.value as LegalAlert);

	apiHandler.handle<string, void | string>(task).then(back);
}

async function handleDelete(): Promise<void> {
	if (!alert.value.uuid) {
		return;
	}

	apiHandler.handle(apiCtrl.delete(alert.value.uuid)).then(back);
}

function handleEditBody() {
	const wc = {
		title: alert.value.title?.pt ?? "",
		pt: alert.value.body?.pt ?? "",
		en: alert.value.body?.en,
	};

	editorRef.value?.open(wc, (wc: WebContent) => {
		alert.value.body = { pt: wc.pt, en: wc.en };
	});
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
		<admin-page-title :backTo="BACK_PAGE">Criar / Editar Alerta Jurídico</admin-page-title>

		<form>
			<admin-intl-content-field
				class="mb-3"
				:label="strings.legal_alert_title.pt"
				:model-value="alert.title!"
				@update:model-value="alert.title = $event"
			/>

			<div class="d-flex gap-2">
				<app-input
					class="w-50 flex-grow-1"
					type="date"
					v-model="alert.publishedOn"
					:label="strings.legal_alert_published_on.pt"
					:placeholder="strings.legal_alert_published_on.pt"
				/>

				<app-select
					class="w-50 flex-grow-1"
					:options="availableCategories"
					v-model="alert.category"
					:label="strings.lawyer_category.pt"
				/>
			</div>

			<hr class="my-4" />

			<admin-web-content-field
				class="mb-4"
				:label="strings.legal_alert_body.pt"
				:content="alert.body!"
				@edit="handleEditBody"
			/>

			<hr class="my-4" />

			<admin-actions
				class="mb-4"
				:backTo="BACK_PAGE"
				:deleteDisabled="!alert.uuid"
				:saveDisabled="!alert.title?.pt"
				@delete="handleDelete"
				@save="handleSave"
			/>

			<input type="hidden" name="csrf_token" :value="csrf" />
		</form>

		<lr-web-content-editor-dialog ref="editorRef" />
	</div>
</template>
