<script lang="ts">
import { strings } from "~~/lib/intl/strings";
import makeApiController from "./apiController";
import makeApiResponseHandler from "./apiResponseHandler";
import makeModelReloader from "./modelReloader";

import { makeMediaArticle, MediaArticle } from "~/lib/model/types/media_article";
import { Toast } from "~/lib/clientDeps";
import { Lawyer } from "~/lib/model/types/lawyer";
import { WebContent } from "~/lib/deps";

const API_BASE_URL = "/api/media-articles";
const BACK_PAGE = "/a/media-articles";
</script>

<script lang="ts" setup>
definePageMeta({ layout: "admin", middleware: "auth-guard" });

const lawyerRef = ref<HTMLSelectElement>();
const editorRef = ref();

const toast = ref<Toast>();
const article = ref<Partial<MediaArticle>>(makeMediaArticle());

const apiCtrl = makeApiController(API_BASE_URL);
const apiHandler = makeApiResponseHandler(toast as Ref<Toast>);
const modelReloader = makeModelReloader(
	apiHandler,
	apiCtrl,
	makeMediaArticle,
	useRoute().query.uuid as string,
	article
);

const { data: lawyers } = await useFetch<Lawyer[]>("/api/lawyers?lang=pt");

onMounted(async () => {
	const { useToast } = await import("~/lib/clientDeps");
	toast.value = useToast(".edit-legal-alert");
	await reloadMediaArticle();
});

async function handleSave(): Promise<void> {
	const task = article.value.uuid
		? apiCtrl.update(article.value as MediaArticle)
		: apiCtrl.create(article.value as MediaArticle);

	apiHandler.handle<string, void | string>(task).then(back);
}

async function handleDelete(): Promise<void> {
	if (!article.value.uuid) {
		return;
	}

	apiHandler.handle(apiCtrl.delete(article.value.uuid)).then(back);
}

function handleEditBody() {
	const wc = {
		title: article.value.title?.pt ?? "",
		pt: article.value.body?.pt ?? "",
		en: article.value.body?.en,
	};

	editorRef.value?.open(wc, (wc: WebContent) => {
		article.value.body = { pt: wc.pt, en: wc.en };
	});
}

function handleUpdateLawyerUuid() {
	if (lawyerRef.value?.selectedIndex == 0) {
		article.value.lawyerName = undefined;
		return;
	}

	article.value.lawyerLinkedIn = undefined;
	article.value.lawyerName = lawyerRef.value?.selectedOptions[0].label;
}

function back() {
	useRouter().push(BACK_PAGE);
}

async function reloadMediaArticle(): Promise<void> {
	await modelReloader.reload();
}
</script>

<template>
	<div id="pageTop" class="edit-legal-alert container-fluid">
		<admin-page-title :backTo="BACK_PAGE">Criar / Editar Artigo</admin-page-title>

		<admin-intl-content-field
			class="mb-3"
			:label="strings.legal_alert_title.pt"
			:model-value="article.title!"
			@update:model-value="article.title = $event"
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

		<div class="row mb-4 d-flex align-items-end">
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
					<option v-for="option in lawyers" :value="option.uuid" :label="option.name" />
				</select>
			</div>
			<app-input
				class="col-md-6 col-lg-8"
				type="text"
				v-model="article.lawyerName"
				:disabled="(article.lawyerUuid?.length ?? -1) > 0"
				:label="strings.media_article_lawyer_name.pt"
				:placeholder="strings.media_article_lawyer_name.pt"
			/>
		</div>
		<div class="row mb-4">
			<app-input
				type="text"
				v-model="article.lawyerLinkedIn"
				:disabled="(article.lawyerUuid?.length ?? -1) > 0"
				:label="strings.media_article_lawyer_linkedin.pt"
				:placeholder="strings.media_article_lawyer_linkedin.pt"
			/>
		</div>

		<hr />

		<admin-web-content-field
			class="mb-4"
			:label="strings.legal_alert_body.pt"
			:content="article.body!"
			@edit="handleEditBody"
		/>

		<hr />

		<admin-actions
			class="mb-3"
			:backTo="BACK_PAGE"
			:deleteDisabled="!article.uuid"
			:saveDisabled="!article.title?.pt || !article.publicationName"
			@delete="handleDelete"
			@save="handleSave"
		/>

		<lr-web-content-editor-dialog ref="editorRef" />
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
