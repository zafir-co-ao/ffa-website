<script lang="ts">
import { categories, I18nMessages, languages, strings } from "~~/lib/intl/strings";
import { Lawyer, makeLawyer } from "~~/lib/model/types/lawyer";
import makeApiController from "./apiController";
import makeApiResponseHandler from "./apiResponseHandler";
import { forceReload, forceReplace } from "./forcedReloader";
import makeModelReloader from "./modelReloader";
import lawyerAreas from "~/lib/intl/lawyer_areas";
import { LrToast } from "~/lib/clientDeps";
import { WebContent } from "~/lib/deps";

const API_BASE_URL = "/api/lawyers";
const BACK_PAGE = "/a/lawyers";

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

const nodeClient = useAntboxClient();

const portraitUrl = ref("/images/anonymous-headshot.png");
const thumbnailUrl = ref("/images/anonymous-headshot.png");

const uploadPortraitRef = ref<HTMLInputElement>();
const uploadThumbRef = ref<HTMLInputElement>();

const toast = ref<LrToast>();
const lawyer = ref<Lawyer>(makeLawyer());

const apiCtrl = makeApiController(API_BASE_URL);
const apiHandler = makeApiResponseHandler(toast as Ref<LrToast>);
const editorRef = ref();

const modelReloader = makeModelReloader(
	apiHandler,
	apiCtrl,
	makeLawyer,
	useRoute().query.uuid as string,
	lawyer
);

const availableLanguages = mapI18nToOptions(languages);
const availableAreas = mapI18nToOptions(lawyerAreas);
const availableCategories = mapI18nToOptions({
	Socio: categories.Socio,
	Consultor: categories.Consultor,
	AssociadoCoordenador: categories.AssociadoSenior,
	Associado: categories.Associado,
	Estagiario: categories.Estagiario,
});

onMounted(async () => {
	const { useToast } = await import("~/lib/clientDeps");
	toast.value = useToast(".edit-lawyer");
	await reloadLawyer();
});

function handleUpdateLawyerCategory() {
	if (lawyer.value.position.pt) {
		return;
	}

	lawyer.value.position = {
		pt: categories[lawyer.value?.category!].pt,
		en: categories[lawyer.value?.category!].en,
	};
}

async function handleSave(): Promise<void> {
	apiHandler
		.handle(apiCtrl.createOrUpdate(lawyer.value))
		.then((uuid) => {
			if (uuid) {
				lawyer.value.uuid = uuid;
				forceReplace("/a/edit-lawyer?uuid=" + uuid);
			}
		})
		.then(scrollToTop);
}

async function handleDelete(): Promise<void> {
	if (!lawyer.value.uuid) {
		return;
	}

	apiHandler.handle(apiCtrl.delete(lawyer.value.uuid)).then(back);
}

function scrollToTop() {
	const a = document.createElement("a");
	a.href = "#pageTop";
	a.click();
}

function handleEditBio() {
	editorRef.value?.open(
		{ title: lawyer.value.name, ...lawyer.value.bio },
		(newBio: WebContent) => (lawyer.value.bio = newBio)
	);
}

function handleEditCareer() {
	editorRef.value?.open(
		{ title: lawyer.value.name, ...lawyer.value.career },
		(newCareer: WebContent) => (lawyer.value.career = newCareer)
	);
}

function back() {
	useRouter().push(BACK_PAGE);
}

async function uploadPhoto(file: File, lawyer: Lawyer & Record<string, string>, fieldname: string) {
	console.log("uploading photo", file, lawyer, lawyer[fieldname]);

	if (lawyer[fieldname]) {
		return apiHandler.handle(nodeClient.updateFile(lawyer[fieldname], file));
	}

	apiHandler
		.handle(nodeClient.createFile(file, { parent: lawyer.uuid }))
		.then((node) => {
			if (!node) {
				return;
			}

			lawyer[fieldname] = node.uuid;
			return apiCtrl.update(lawyer);
		})
		.then(() => apiCtrl.update(lawyer))
		.then(() => reloadLawyer());
}

async function handleUploadPortrait() {
	await uploadPhoto(
		uploadPortraitRef.value?.files?.[0]!,
		lawyer.value as any,
		"portraitUuid"
	).then(forceReload);
}

async function handleUploadThumb() {
	await uploadPhoto(uploadThumbRef.value?.files?.[0]!, lawyer.value as any, "thumbnailUuid").then(
		forceReload
	);
}

async function reloadLawyer(): Promise<void> {
	await modelReloader.reload();

	if (lawyer.value.portraitUuid) {
		portraitUrl.value = nodeClient.getNodeUrl(lawyer.value.portraitUuid);
	}

	if (lawyer.value.thumbnailUuid) {
		thumbnailUrl.value = nodeClient.getNodeUrl(lawyer.value.thumbnailUuid);
	}
}
</script>

<template>
	<div id="pageTop" class="edit-lawyer container-fluid">
		<admin-page-title :backTo="BACK_PAGE">Criar / Editar Advogado</admin-page-title>

		<div v-if="lawyer.uuid" class="row mb-4 d-flex justify-content-center">
			<input
				ref="uploadThumbRef"
				type="file"
				accept=".jpg, .png, .jpeg"
				@change="handleUploadThumb"
				class="d-none"
			/>
			<a class="btn lawyer-photo-container" href="#" @click="uploadThumbRef?.click()">
				<img class="lawyer-thumb" :src="thumbnailUrl" />
				<div class="subtitle2 mt-2 azul">Definir Avatar (512x512)</div>
			</a>

			<input
				ref="uploadPortraitRef"
				type="file"
				accept=".jpg, .png, .jpeg"
				@change="handleUploadPortrait"
				class="d-none"
			/>
			<a class="btn lawyer-photo-container" href="#" @click="uploadPortraitRef?.click()">
				<img class="lawyer-portrait" :src="portraitUrl" />
				<div class="subtitle2 mt-2 azul">Definir Retratro (600x900)</div>
			</a>
		</div>

		<div class="row mb-4">
			<app-input
				type="text"
				v-model="lawyer.name"
				:label="strings.lawyer_name.pt"
				:placeholder="strings.lawyer_name.pt"
			/>
		</div>

		<div class="row mb-4">
			<div class="col col-md-4">
				<label class="form-label azulescuro fw-bolder">{{
					strings.lawyer_category.pt
				}}</label>
				<select
					class="form-select"
					v-model="lawyer.category"
					@change="handleUpdateLawyerCategory"
				>
					<option v-for="option in availableCategories" :value="option.value">
						{{ option.label }}
					</option>
				</select>
			</div>

			<div class="col col-md-8">
				<admin-intl-content-field
					:label="`${strings.lawyer_position.pt} (Português / Inglês)`"
					v-model="lawyer.position"
				/>
			</div>
		</div>

		<div class="row mb-4">
			<app-input
				class="col-lg-4"
				type="text"
				v-model="lawyer.email"
				:label="strings.lawyer_email.pt"
				:placeholder="strings.lawyer_email.pt"
			/>

			<app-input
				class="col-md-6 col-lg-4"
				type="text"
				v-model="lawyer.officeTelephones"
				:label="strings.lawyer_contacts_office.pt"
				:placeholder="strings.lawyer_contacts_office.pt"
			/>

			<app-input
				class="col-md-6 col-lg-4"
				type="text"
				v-model="lawyer.mobilePhone"
				:label="strings.lawyer_contacts_mobile.pt"
				:placeholder="strings.lawyer_contacts_mobile.pt"
			/>
		</div>
		<hr />
		<app-multichoice-input-checkbox
			class="mb-4"
			v-model="lawyer.languages"
			:options="availableLanguages"
			:label="strings.lawyer_languages"
		/>
		<hr />
		<app-multichoice-input-checkbox
			class="mb-4"
			v-model="lawyer.areas"
			:options="availableAreas"
			:label="strings.lawyer_areas_of_practice"
		/>

		<hr />

		<admin-web-content-field
			class="mb-4"
			:label="strings.lawyer_bio.pt"
			:content="lawyer.bio"
			@edit="handleEditBio"
		/>

		<admin-web-content-field
			class="mb-4"
			:label="strings.lawyer_career.pt"
			:content="lawyer.career"
			@edit="handleEditCareer"
		/>

		<hr />

		<admin-actions
			class="mb-3"
			:backTo="BACK_PAGE"
			:deleteDisabled="!lawyer.uuid"
			:saveDisabled="!lawyer.name"
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

.lawyer-photo-container {
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	max-width: 144px;

	padding: 8px;
}

.lawyer-photo-container div {
	text-align: center;
}

img.lawyer-thumb {
	width: 128px;
	border-radius: 50%;
}

img.lawyer-portrait {
	width: 86px;
	border-radius: 4px;
}

img.lawyer-thumb,
img.lawyer-portrait {
	height: 128px;
	object-fit: cover;
}
</style>
