<script lang="ts">
import makeApiController from "./apiController";
import makeApiResponseHandler from "./apiResponseHandler";
import makeModelReloader from "./modelReloader";
import { LrToast } from "~/lib/clientDeps";
import { left, right } from "~/lib/deps";

const API_BASE_URL = "/api/section-headers";
const BACK_PAGE = "/a/section-headers";
</script>

<script lang="ts" setup>
import {
	I18nSectionHeader,
	SectionHeader,
	makeSectionHeader,
} from "~/lib/model/types/section_header";
definePageMeta({ layout: "admin", middleware: "auth-guard" });

const toast = ref<LrToast>();
const header = ref<SectionHeader>(makeSectionHeader());
const uploadImageRef = ref<HTMLInputElement>();

const apiCtrl = makeApiController(API_BASE_URL);
const apiHandler = makeApiResponseHandler(toast as Ref<LrToast>);
const modelReloader = makeModelReloader(
	apiHandler,
	apiCtrl,
	makeSectionHeader,
	useRoute().query.uuid as string,
	header
);

const localizedHeader = computed(() =>
	Promise.resolve({
		title: header.value?.title.pt,
		subtitle: header.value?.subtitle?.pt,
		clipTop: header.value?.clipTop,
		clipBottom: header.value?.clipBottom,
		imageUrl: header.value?.imageUrl,
	} as I18nSectionHeader)
);

await modelReloader.reload();

onMounted(async () => {
	const { useToast } = await import("~/lib/clientDeps");
	toast.value = useToast("#pageTop");
});

function handleSave() {
	save(header.value?.uuid!, { metadata: header.value as SectionHeader });
}

function save(uuid: string, opts: { metadata?: SectionHeader; file?: File }) {
	const formData = new FormData();

	if (opts?.metadata) {
		formData.append("metadata", JSON.stringify(opts.metadata));
	}

	if (opts?.file) {
		formData.append("file", opts.file);
	}

	const url = `${API_BASE_URL}/${uuid}`;

	apiHandler
		.handle(
			fetch(url, { method: "PUT", body: formData })
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

function back() {
	useRouter().push(BACK_PAGE);
}

function handleUploadImage() {
	const file = uploadImageRef.value?.files?.[0];

	if (!file) {
		return;
	}

	const metadata = header.value!;

	save(metadata.uuid!, { metadata, file });
}
</script>

<template>
	<div id="pageTop">
		<admin-page-title :backTo="BACK_PAGE">Criar / Editar Banner</admin-page-title>
		<div v-if="header?.uuid" class="mb-5">
			<h4 class="mb-3">{{ header.nodeTitle }}</h4>
			<input ref="uploadImageRef" type="file" accept=".jpg, .png, .jpeg" class="d-none" />
			<div class="d-flex">
				<label class="fw-bolder flex-fill"> Pré-Visualizar (1920×660)</label>
				<app-icon-button iconClass="bi bi-pencil" @click="uploadImageRef?.click()" />
			</div>

			<app-section-header :getter="() => localizedHeader" />
		</div>

		<admin-intl-content-field
			class="mb-4"
			label="Título - Linha 1 (Português / Inglês)"
			:model-value="header.title!"
			@update:model-value="header.title = $event"
		/>
		<div class="p-3 mb-5 tip">
			<span class="fw-bold">Dica:</span>
			Escrever o texto "&lt;br&gt;" para inserir uma quebra de linha
		</div>

		<admin-intl-content-field
			class="mb-4"
			label="Subtítulo (Português / Inglês)"
			:model-value="header.subtitle!"
			@update:model-value="header.subtitle = $event"
		/>

		<span class="me-5">
			<app-input-check-box v-model="header.clipTop" label="Corte Superior" />.
		</span>
		<span>
			<app-input-check-box v-model="header.clipBottom" label="Corte Inferior" />
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
