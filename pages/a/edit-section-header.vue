<script lang="ts">
import { nodeServiceClient, useToast, Toast } from "~~/lib/deps";
import makeApiController from "./apiController";
import makeApiResponseHandler from "./apiResponseHandler";
import makeModelReloader from "./modelReloader";

const API_BASE_URL = "/api/section-headers";
const BACK_PAGE = "/a/section-headers";
</script>

<script lang="ts" setup>
import { forceReload } from "./forcedReloader";
import SectionHeader, {
	LocalizedSectionHeader,
	makeSectionHeader,
} from "~/lib/model/types/section_header";
definePageMeta({ layout: "admin" });

const toast = ref<Toast>();
const header = ref<SectionHeader>();
const uploadImageRef = ref<HTMLInputElement>();

const apiCtrl = makeApiController(API_BASE_URL);
const apiHandler = makeApiResponseHandler(toast);
const modelReloader = makeModelReloader(
	apiHandler,
	apiCtrl,
	makeSectionHeader,
	useRoute().query.uuid as string,
	header
);

const localizedHeader = computed(
	() =>
		({
			title: header.value.title.pt,
			subtitle: header.value.subtitle.pt,
			clipTop: header.value.clipTop,
			clipBottom: header.value.clipBottom,
			imageUrl: header.value.imageUrl,
		} as LocalizedSectionHeader)
);

await modelReloader.reload();

onMounted(async () => {
	toast.value = useToast("#pageTop");
});

function handleSave() {
	if (!header.value.uuid) {
		return uploadImageRef.value.click();
	}

	apiHandler.handle(apiCtrl.update(header.value)).then(modelReloader.reload);
}

function handleUploadImage() {
	if (header.value.uuid) {
		return updateImage();
	}
}

function updateImage() {
	nodeServiceClient
		.updateFile(header.value.uuid, uploadImageRef.value.files[0])
		.then(forceReload)
		.then(() => toast.value.success("Imagem actualizada com sucesso"))
		.catch((err) => toast.value.exception(err));
}
</script>

<template>
	<div id="pageTop">
		<admin-page-title :backTo="BACK_PAGE"
			>Criar / Editar Banner</admin-page-title
		>
		<div v-if="header.uuid" class="mb-5">
			<h4 class="mb-3">{{ header.nodeTitle }}</h4>
			<input
				ref="uploadImageRef"
				type="file"
				accept=".jpg, .png, .jpeg"
				class="d-none"
			/>
			<div class="d-flex">
				<label class="fw-bolder flex-fill">
					Pré-Visualizar (1920×660)</label
				>
				<app-icon-button
					iconClass="bi bi-pencil"
					@click="uploadImageRef.click()"
				/>
			</div>

			<app-section-header :header="localizedHeader" />
		</div>

		<admin-intl-content-field
			class="mb-4"
			label="Título - Linha 1 (Português / Inglês)"
			v-model="header.title"
		/>
		<div class="p-3 mb-5 tip">
			<span class="fw-bold">Dica:</span>
			Escrever o texto "&lt;br&gt;" para inserir uma quebra de linha
		</div>

		<admin-intl-content-field
			class="mb-4"
			label="Subtítulo (Português / Inglês)"
			v-model="header.subtitle"
		/>

		<span class="me-5">
			<app-input-check-box
				v-model="header.clipTop"
				label="Corte Superior"
			/>
		</span>
		<span>
			<app-input-check-box
				v-model="header.clipBottom"
				label="Corte Inferior"
			/>
		</span>

		<hr />

		<admin-actions
			class="mb-5"
			:backTo="BACK_PAGE"
			:deleteDisabled="true"
			:saveDisabled="!header.title?.pt"
			@save="handleSave"
		/>

		<input
			ref="uploadImageRef"
			type="file"
			accept=".jpg, .png, .jpeg"
			@change="handleUploadImage"
			class="d-none"
		/>
	</div>
</template>

<style scoped>
.tip {
	font-size: smaller;
	background-color: #fbf1da;
	border: solid 1px #f1ce7e;
}
</style>
