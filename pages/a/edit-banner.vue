<script lang="ts">
import { nodeServiceClient, useToast, Toast } from "~~/lib/deps";
import Banner, { makeBanner } from "~~/lib/model/types/banner";
import makeApiController from "./apiController";
import makeApiResponseHandler from "./apiResponseHandler";
import makeModelReloader from "./modelReloader";

const API_BASE_URL = "/api/banners";
const BACK_PAGE = "/a/banners";
</script>

<script lang="ts" setup>
import AdminIntlContentField from "~~/components/AdminIntlContentField.vue";
import { forceReload } from "./forcedReloader";
definePageMeta({ layout: "admin" });

const toast = ref<Toast>();
const banner = ref<Banner>();
const uploadImageRef = ref<HTMLInputElement>();

const apiCtrl = makeApiController(API_BASE_URL);
const apiHandler = makeApiResponseHandler(toast);
const modelReloader = makeModelReloader(
	apiHandler,
	apiCtrl,
	makeBanner,
	useRoute().query.uuid as string,
	banner
);

await modelReloader.reload();

onMounted(async () => {
	toast.value = useToast("#pageTop");
});

function handleSave() {
	if (!banner.value.uuid) {
		return uploadImageRef.value.click();
	}

	apiHandler.handle(apiCtrl.update(banner.value)).then(modelReloader.reload);
}

function handleDelete() {
	apiHandler.handle(apiCtrl.delete(banner.value.uuid)).then(back);
}

function back() {
	useRouter().push(BACK_PAGE);
}

function handleUploadImage() {
	if (banner.value.uuid) {
		return updateBannerImage();
	}

	return createBannerImage();
}

function updateBannerImage() {
	nodeServiceClient
		.updateFile(banner.value.uuid, uploadImageRef.value.files[0])
		.then(forceReload)
		.then(() => toast.value.success("Imagem actualizada com sucesso"))
		.catch((err) => toast.value.exception(err));
}

function createBannerImage() {
	nodeServiceClient
		.createFile(uploadImageRef.value.files[0])
		.then((uuid) => {
			banner.value.uuid = uuid;
			apiHandler
				.handle(apiCtrl.create(banner.value))
				.then(modelReloader.reload);
		})
		.catch((err) => toast.value.exception(err));
}
</script>

<template>
	<div id="pageTop">
		<admin-page-title :backTo="BACK_PAGE"
			>Criar / Editar Banner</admin-page-title
		>
		<div v-if="banner.uuid" class="mb-5">
			<input
				ref="uploadImageRef"
				type="file"
				accept=".jpg, .png, .jpeg"
				class="d-none"
			/>
			<div class="d-flex">
				<label class="fw-bolder flex-fill"> Pré-Visualizar</label>
				<app-icon-button
					iconClass="bi bi-pencil"
					@click="uploadImageRef.click()"
				/>
			</div>

			<app-banner
				:title1="banner.title1?.pt"
				:title2="banner.title2?.pt"
				:subtitle="banner.subtitle?.pt"
				:imageUrl="banner.imageUrl"
				:href="banner.href"
				lang="pt"
			/>
		</div>

		<admin-intl-content-field
			class="mb-4"
			label="Título - Linha 1 (Português / Inglês)"
			v-model="banner.title1"
		/>

		<admin-intl-content-field
			class="mb-4"
			label="Título - Linha 2 (Português / Inglês)"
			v-model="banner.title2"
		/>

		<admin-intl-content-field
			class="mb-4"
			label="Subtítulo (Português / Inglês)"
			v-model="banner.subtitle"
		/>

		<app-input type="text" v-model="banner.href" label="URL" />

		<hr />

		<admin-actions
			class="mb-5"
			:backTo="BACK_PAGE"
			:deleteDisabled="!banner.uuid"
			:saveDisabled="!banner.title1?.pt || !banner.title1?.en"
			@save="handleSave"
			@delete="handleDelete"
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
