<script lang="ts">
import makeApiController from "./apiController";
import makeApiResponseHandler from "./apiResponseHandler";
import makeModelReloader from "./modelReloader";

import { type Banner, makeBanner } from "~/lib/model/types/banner";
import { left, right } from "~/lib/deps";
import type { Toaster } from "~/types/toaster";

const API_BASE_URL = "/api/banners";
const BACK_PAGE = "/a/banners";
</script>

<script lang="ts" setup>
import AdminIntlContentField from "~~/components/AdminIntlContentField.vue";

definePageMeta({ layout: "admin" });

const { csrf } = useCsrf();

const toast = ref<Toaster>();
const banner = ref<Partial<Banner>>(makeBanner());
const uploadImageRef = ref<HTMLInputElement>();

const apiCtrl = makeApiController(API_BASE_URL);
const apiHandler = makeApiResponseHandler(toast as Ref<Toaster>);
const modelReloader = makeModelReloader(
	apiHandler,
	apiCtrl,
	makeBanner,
	useRoute().query.uuid as string,
	banner
);

await modelReloader.reload();

onMounted(async () => {});

function handleSave() {
	const metadata = banner.value!;

	const formData = new FormData();
	formData.append("metadata", JSON.stringify(metadata));

	const url = `${API_BASE_URL}/${metadata.uuid}`;
	const headers = new Headers();
	headers.append("csrf-token", useCsrf().csrf);

	apiHandler
		.handle(
			fetch(url, { method: "PUT", body: formData, headers })
				.then((res) => {
					if (!res.ok) {
						return left<string, void>(res.statusText);
					}

					return right<string, void>(undefined);
				})
				.catch((err) => left(err as string))
		)
		.then(back);
}

function handleDelete() {
	if (!banner.value?.uuid) {
		return;
	}
	apiHandler.handle(apiCtrl.delete(banner.value.uuid)).then(back);
}

function back() {
	useRouter().push(BACK_PAGE);
}

function handleUploadImage() {
	const file = uploadImageRef.value?.files?.[0];

	if (!file) {
		return;
	}

	const metadata = banner.value!;

	const formData = new FormData();
	formData.append("file", file);
	formData.append("metadata", JSON.stringify(metadata));

	const method = metadata.uuid ? "PUT" : "POST";
	const url = method === "PUT" ? `${API_BASE_URL}/${metadata.uuid}` : API_BASE_URL;

	const headers = new Headers();
	headers.append("csrf-token", useCsrf().csrf);

	apiHandler
		.handle(
			fetch(url, { method, headers, body: formData })
				.then((res) => {
					if (!res.ok) {
						return left<string, void>(res.statusText);
					}

					if (method === "PUT") {
						return right<string, void>(undefined);
					}

					return res.json().then((data) => {
						return right<string, void>(data.uuid);
					});
				})
				.catch((err) => left(err as string))
		)
		.then(back);
}
</script>

<template>
	<div id="pageTop">
		<admin-page-title :backTo="BACK_PAGE">Criar / Editar Banner</admin-page-title>

		<form class="d-flex flex-column gap-2">
			<div v-if="banner?.uuid" class="mb-5">
				<input ref="uploadImageRef" type="file" accept=".jpg, .png, .jpeg" class="d-none" />
				<div class="d-flex">
					<label class="fw-bolder flex-fill"> Pré-Visualizar</label>
					<app-icon-button iconClass="bi bi-pencil" @click="uploadImageRef?.click()" />
				</div>

				<app-banner
					:title1="banner.title1?.pt"
					:title2="banner.title2?.pt"
					:subtitle="banner.subtitle?.pt"
					:imageUrl="banner.imageUrl!"
					:href="banner.href"
					lang="pt"
				/>
			</div>

			<admin-intl-content-field
				class="mb-4"
				label="Título - Linha 1 (Português / Inglês)"
				:model-value="banner.title1!"
				@update:model-value="banner.title1 = $event"
			/>

			<admin-intl-content-field
				class="mb-4"
				label="Título - Linha 2 (Português / Inglês)"
				:model-value="banner.title2!"
				@update:model-value="banner.title2 = $event"
			/>

			<admin-intl-content-field
				class="mb-4"
				label="Subtítulo (Português / Inglês)"
				:model-value="banner.subtitle!"
				@update:model-value="banner.subtitle = $event"
			/>

			<app-input type="text" v-model="banner.href" label="URL" />

			<app-input
				type="number"
				v-model="banner.priority"
				label="Prioridade"
				style="widows: 50%"
			/>

			<hr class="my-4" />

			<div v-if="!banner.uuid" class="row mt-4">
				<div class="d-flex justify-content-end">
					<nuxt-link :to="BACK_PAGE">
						<app-button label="Voltar" />
					</nuxt-link>

					&nbsp;
					<app-button
						:dark="true"
						:disabled="!banner?.title1?.pt || !banner.title1?.en"
						label="Anexar Imagem e Salvar"
						@click="uploadImageRef?.click()"
					/>
				</div>
			</div>

			<admin-actions
				v-else
				class="mb-5"
				:backTo="BACK_PAGE"
				:deleteDisabled="!banner?.uuid"
				:saveDisabled="!banner?.uuid || !banner?.title1?.pt || !banner.title1?.en"
				@save="handleSave"
				@delete="handleDelete"
			/>

			<input type="hidden" name="csrf_token" :value="csrf" />
		</form>

		<input
			ref="uploadImageRef"
			type="file"
			accept=".jpg, .png, .jpeg"
			@change="handleUploadImage"
			class="d-none"
		/>
	</div>
</template>
