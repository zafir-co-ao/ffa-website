<script lang="ts">
import { Toast, useToast } from "~~/lib/deps";
import WebContentEditorDialog from "~lightray/WebContentEditorDialog.vue";
import editIntlField, {
	makeDialogProps,
	makeSaveHandler,
} from "~~/components/editIntField";
import { nodeServiceClient } from "~~/lib/deps";

import { I18nMessages, strings } from "~~/lib/intl/strings";
import makeApiController from "./apiController";
import makeApiResponseHandler from "./apiResponseHandler";
import { forceReplace } from "./forcedReloader";
import makeModelReloader from "./modelReloader";

import { MEDIA_ARTICLES_PARENT_FOLDER_FID } from "~~/lib/api/parentFolders";
import assertFolderExist from "~~/lib/api/assertFolderExist";
import MediaArticle, {
	makeMediaArticle,
	fromMediaArticle,
} from "~~/lib/model/types/mediaArticle";
import Lawyer from "~~/lib/model/types/lawyer";

const API_BASE_URL = "/api/media-articles";
const BACK_PAGE = "/a/media-articles";
</script>

<script lang="ts" setup>
definePageMeta({ layout: "admin" });

const pdfUrl = ref("");
const lawyerRef = ref<HTMLSelectElement>();

const dialogProps = reactive(makeDialogProps());
const saveIntlFieldHandler = makeSaveHandler(dialogProps);

// const pdfRef = ref<HTMLInputElement>();

const toast = ref<Toast>();
const article = ref<MediaArticle>(makeMediaArticle());

const apiCtrl = makeApiController(API_BASE_URL);
const apiHandler = makeApiResponseHandler(toast);
const modelReloader = makeModelReloader(
	apiHandler,
	apiCtrl,
	makeMediaArticle,
	useRoute().query.uuid as string,
	article
);

const { data: lawyers } = await useFetch<Lawyer[]>("/api/lawyers/-/pt");

onMounted(async () => {
	toast.value = useToast(".edit-legal-alert");
	await reloadMediaArticle();
});

async function handleSave(): Promise<void> {
	const node = fromMediaArticle(article.value);
	const file = makeFile(article, node.title);

	try {
		node.uuid = await createOrUpdateNodeFile(file, node.uuid);

		await nodeServiceClient.update(node.uuid, node);

		toast.value?.success("Operação executada com sucesso");
		forceReplace("/a/edit-media-article?uuid=" + node.uuid);
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
		MEDIA_ARTICLES_PARENT_FOLDER_FID,
		"Artigos de Imprensa"
	);

	return await nodeServiceClient.createFile(file, parent);
}

async function handleDelete(): Promise<void> {
	if (!article.value.uuid) {
		return;
	}

	apiHandler.handle(apiCtrl.delete(article.value.uuid)).then(back);
}

function scrollToTop() {
	const a = document.createElement("a");
	a.href = "#pageTop";
	a.click();
}

function handleEditBody() {
	editIntlField(dialogProps, strings.legal_alerts.pt, article.value.body);
}

function handleUpdateLawyerUuid() {
	if (lawyerRef.value.selectedIndex == 0) {
		article.value.lawyerName = undefined;
		return;
	}

	article.value.lawyerLinkedIn = undefined;
	article.value.lawyerName = lawyerRef.value.selectedOptions[0].label;
}

function back() {
	useRouter().push(BACK_PAGE);
}

// async function handleUploadPDF() {
// 	const file = pdfRef.value.files[0];

// 	if (alert.value.pdfUuid) {
// 		return await nodeServiceClient.updateFile(alert.value.pdfUuid, file);
// 	}

// 	const parent = await nodeServiceClient.get(
// 		fidToUuid(LEGAL_ALERTS_PARENT_FOLDER_FID)
// 	);

// 	await nodeServiceClient
// 		.createFile(file, parent.uuid)
// 		.then((uuid) => (alert.value.pdfUuid = uuid))
// 		.then(() => apiCtrl.update(alert.value))
// 		.then(forceReload);
// }

async function reloadMediaArticle(): Promise<void> {
	await modelReloader.reload();

	// if (article.value.pdfUuid) {
	// 	pdfUrl.value = nodeServiceClient.getNodeUrl(article.value.pdfUuid);
	// }
}
</script>

<template>
	<div id="pageTop" class="edit-legal-alert container-fluid">
		<admin-page-title :backTo="BACK_PAGE"
			>Criar / Editar Artigo</admin-page-title
		>

		<admin-intl-content-field
			class="mb-3"
			:label="strings.legal_alert_title.pt"
			v-model="article.title"
		/>

		<div class="row mb-4">
			<app-input
				class="col-md-6 col-lg-4"
				type="date"
				v-model="article.publishedOn"
				:label="strings.legal_alert_published_on.pt"
				:placeholder="strings.legal_alert_published_on.pt"
			/>

			<app-input
				class="col-md-6 col-lg-8"
				type="text"
				v-model="article.publicationName"
				:label="strings.media_article_publication_name.pt"
				:placeholder="strings.media_article_publication_name.pt"
			/>
		</div>

		<div class="row mb-4">
			<app-input
				type="text"
				v-model="article.href"
				:label="strings.media_article_href.pt"
				:placeholder="strings.media_article_href.pt"
			/>
		</div>

		<hr />

		<div class="row mb-4">
			<div class="col col-md-6 col-lg-4">
				<label class="form-label azulescuro fw-bolder">{{
					strings.media_article_lawyer.pt
				}}</label>
				<select
					ref="lawyerRef"
					class="form-select"
					v-model="article.lawyerUuid"
					@change="handleUpdateLawyerUuid"
				>
					<option :value="undefined">&nbsp;</option>
					<option
						v-for="option in lawyers"
						:value="option.uuid"
						:label="option.name"
					/>
				</select>
			</div>
			<app-input
				class="col-md-6 col-lg-8"
				type="text"
				v-model="article.lawyerName"
				:disabled="article.lawyerUuid?.length > 0"
				:label="strings.media_article_lawyer_name.pt"
				:placeholder="strings.media_article_lawyer_name.pt"
			/>
		</div>
		<div class="row mb-4">
			<app-input
				type="text"
				v-model="article.lawyerLinkedIn"
				:disabled="article.lawyerUuid?.length > 0"
				:label="strings.media_article_lawyer_linkedin.pt"
				:placeholder="strings.media_article_lawyer_linkedin.pt"
			/>
		</div>

		<hr />

		<admin-web-content-field
			class="mb-4"
			:label="strings.legal_alert_body.pt"
			:content="article.body"
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
			:deleteDisabled="!(article.uuid && article.publicationName)"
			:saveDisabled="!article.title?.pt"
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
