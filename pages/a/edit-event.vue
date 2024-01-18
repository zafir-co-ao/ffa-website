<script lang="ts">
/* __placeholder__ */
import type { WebContent } from "~~/lib/deps";

import { strings } from "~~/lib/intl/strings";
import makeApiController from "./apiController";
import makeApiResponseHandler from "./apiResponseHandler";
import makeModelReloader from "./modelReloader";

import { type Event, makeEvent } from "~~/lib/model/types/event";
import type { Toaster } from "~/types/toaster";

const API_BASE_URL = "/api/events";
const BACK_PAGE = "/a/events";
</script>

<script lang="ts" setup>
definePageMeta({ layout: "admin", middleware: "auth-guard" });

const { csrf } = useCsrf();

const editorRef = ref();

const toast = ref<Toaster>();
const event = ref<Partial<Event>>(makeEvent());

const apiCtrl = makeApiController<Event>(API_BASE_URL);
const apiHandler = makeApiResponseHandler(toast as Ref<Toaster>);
const modelReloader = makeModelReloader<Event>(
	apiHandler,
	apiCtrl,
	makeEvent,
	useRoute().query.uuid as string,
	event
);

onMounted(async () => {
	// const { useToast } = await import("~/lib/clientDeps");
	// toast.value = useToast(".edit-event");
	await reloadEvent();
});

async function handleSave(): Promise<void> {
	const task = event.value.uuid
		? apiCtrl.update(event.value as Event)
		: apiCtrl.create(event.value as Event);

	apiHandler.handle<string, void | string>(task).then(back);
}

async function handleDelete(): Promise<void> {
	if (!event.value.uuid) {
		return;
	}

	apiHandler.handle(apiCtrl.delete(event.value.uuid)).then(back);
}

function handleEditBody() {
	const wc = {
		title: event.value.title?.pt ?? "",
		pt: event.value.body?.pt ?? "",
		en: event.value.body?.en,
	};

	editorRef.value?.open(wc, (wc: WebContent) => {
		event.value.body = { pt: wc.pt, en: wc.en };
	});
}

function back() {
	useRouter().push(BACK_PAGE);
}

async function reloadEvent(): Promise<void> {
	await modelReloader.reload();
}
</script>

<template>
	<div id="pageTop" class="edit-event container-fluid">
		<admin-page-title :backTo="BACK_PAGE">Criar / Editar Evento</admin-page-title>

		<form>
			<admin-intl-content-field
				class="mb-3"
				:label="strings.legal_alert_title.pt"
				:model-value="event.title!"
				@update:model-value="event.title = $event"
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

			<hr class="my-4" />

			<admin-web-content-field
				class="mb-4"
				:label="strings.legal_alert_body.pt"
				:content="event.body!"
				@edit="handleEditBody"
			/>

			<hr class="my-4" />

			<admin-actions
				class="mb-4"
				:backTo="BACK_PAGE"
				:deleteDisabled="!event.uuid"
				:saveDisabled="!(event.title?.pt && event.eventDateTime)"
				@delete="handleDelete"
				@save="handleSave"
			/>

			<input type="hidden" name="csrf_token" :value="csrf" />
		</form>

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

.mw-75 {
	max-width: 75%;
}
</style>
